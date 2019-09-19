from bluepy import sensortag, btle
import paho.mqtt.client as mqtt
import threading
import time
import json
import redis
from threading import Timer, Thread, Event
import sqlite3
import configparser

config = configparser.ConfigParser()
config.read('conf.ini')
retrieving_rate = float(config['general']['retrieving-rate'])

def main():
    print("DB url", config['SQLiteDB']['url'])
    interval = 180
    stopFlag = Event()
    timerTask = TimerTask(stopFlag, interval)
    timerTask.start()


class TimerTask(Thread):
    def __init__(self, event, duration):
        Thread.__init__(self)
        self.stopped = event
        self.duration = duration

    def run(self):

        while True:
            try:
                device_list = []
                current_device_id = 0
                # scanner = btle.Scanner()
                # device_info_list = scanner.scan(15)
                # print(device_info_list)
                _redis = redis.StrictRedis(host="localhost", port=6379, db=0)
                print("Try to detect sensors each %s seconds" % self.duration)
                # search configured devices in db
                conn = sqlite3.connect(config['SQLiteDB']['url'])
                c = conn.cursor()
                c.execute('SELECT DISTINCT mac FROM sensor')
                for row in c:
                    device_mac = row[0]
                    if len(device_list) == 0:
                        data_thread = RetrievingDataThread(current_device_id, "Thread - " + str(current_device_id),
                                                           current_device_id, device_mac)
                        current_device_id += 1
                        device_list.append(device_mac)
                        data_thread.start()
                    else:
                        not_existed = True
                        for tmp_run in device_list:
                            if device_mac == tmp_run:
                                not_existed = False

                        if not_existed:
                            device_list.append(device_mac)
                            data_thread = RetrievingDataThread(current_device_id, "Thread - " + str(current_device_id),
                                                               current_device_id, device_mac)
                            current_device_id += 1
                            data_thread.start()
                c.close()
                for tmp in device_list:
                    _redis.sadd("device_list", tmp)
            except Exception as e:
                print("Exception in scanning")
                print(e)
            if self.stopped.wait(self.duration):
                break


class RetrievingDataThread(threading.Thread):
    _device_mac = None
    _exit_flag = False
    _sensor = None
    _retry_count = 0
    _redis = None

    def __init__(self, threadID, name, counter, device_mac):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
        self._device_mac = device_mac

        self._redis = redis.StrictRedis(host="localhost", port=6379, db=0)

    def run(self):
        print(">>>>>...")
        print(self._device_mac)
        self._reconnect()

        while not self._exit_flag and self._retry_count < 5:
            try:
                if self._sensor.getState() == "conn":
                    # Get the timestamp
                    # current_time = time.asctime(time.localtime(time.time()))
                    current_time = time.time()
                    data_dict = {}
                    data_dict["current_time"] = current_time
                    data_dict["MAC"] = self._device_mac
                    data_dict["temperature"] = self._sensor.IRtemperature.read()
                    data_dict["humidity"] = self._sensor.humidity.read()
                    data_dict["barometer"] = self._sensor.barometer.read()
                    data_dict["accelerometer"] = self._sensor.accelerometer.read()
                    data_dict["magnetometer"] = self._sensor.magnetometer.read()
                    data_dict["gyroscope"] = self._sensor.gyroscope.read()
                    data_dict["light"] = self._sensor.lightmeter.read()
                    data_dict["battery"] = self._sensor.battery.read()
                    # self.push_to_redis(data_dict)
                    self.push_to_mqtt(data_dict)
                else:
                    self._retry_count += 1
                    if self._retry_count < 5:
                        self._reconnect()
            except Exception as e:
                print("Exception, wait and try to reconnect")
                print(e)
                self._retry_count += 1
                if self._retry_count < 5:
                    self._reconnect()

            time.sleep(retrieving_rate)

    def set_exit_flag(self, exit_flag):
        self._exit_flag = exit_flag

    def _reconnect(self):
        try:
            if self._sensor is not None:
                self._sensor.disconnect()
                self._sensor = None

            if self._sensor is None and self._device_mac is not None:

                print("Try to connect SensorTag...")
                self._sensor = sensortag.SensorTag(self._device_mac.upper())

                # Enabling selected sensors
                self._sensor.IRtemperature.enable()
                self._sensor.humidity.enable()
                self._sensor.barometer.enable()
                self._sensor.accelerometer.enable()
                self._sensor.magnetometer.enable()
                self._sensor.gyroscope.enable()
                self._sensor.keypress.enable()
                self._sensor.setDelegate(sensortag.KeypressDelegate())
                self._sensor.lightmeter.enable()
                self._sensor.battery.enable()

            time.sleep(1.0)
            self._retry_count = 0
        except Exception as e:
            print(e)

    def push_to_redis(self, data_dict):
        json_str = json.dumps(data_dict)
        length = self._redis.lpush(self._device_mac, json_str)
        if length > 100:
            self._redis.rpop(self._device_mac)

    def push_to_mqtt(self, data_dict):
        json_str = json.dumps(self.generate_senml_messages(data_dict))
        # print("SENML ", json_str)
        # device_id = "bab0170f-5d34-48e0-8b10-22c40f150377"
        # device_key = "29200cc0-c191-428e-ae06-cec233fef9a1"
        # channel_id = "74b92194-c101-472b-b033-e495cfddcb79"

        # get broker address
        broker_address = config['MQTT']['broker']
        # get device id, key and channel from SQLite
        conn = sqlite3.connect(config['SQLiteDB']['url'])
        c = conn.cursor()
        t = (data_dict['MAC'],)
        c.execute('SELECT * FROM sensor WHERE mac=?', t)
        for row in c:
            mqtt_client = mqtt.Client()
            mqtt_client.username_pw_set(row[1], row[2])
            mqtt_client.connect(broker_address)
            mqtt_topic = "channels/" + row[3] + "/messages"
            mqtt_client.publish(topic=mqtt_topic, payload=json_str)
            mqtt_client.disconnect()
        c.close()

    def generate_senml_messages(self, data_dict):
        senml_message = []

        if data_dict is not None:
            # Insert battery value
            base = {}
            base['bn'] = "urn:dev:mac:" + data_dict['MAC'] + ":"
            base['bt'] = data_dict['current_time']
            base['n'] = 'base'
            base['u'] = ''
            base['t'] = 0
            base['v'] = 0
            senml_message.append(base)
            if 'battery' in config[data_dict['MAC']]:
                battery_streams = config[data_dict['MAC']]['battery']
                tmp_parts = battery_streams.split(",")
                for part in tmp_parts:
                    battery = {}
                    # battery['bn'] = "urn:dev:mac:" + data_dict['MAC'] + ":"
                    # battery['bt'] = data_dict['current_time']
                    battery['n'] = 'battery' + "-" + part
                    battery['u'] = '%EL'
                    battery['t'] = 0
                    battery['v'] = data_dict['battery']
                    senml_message.append(battery)
            # battery = {}
            # battery['bn'] = "urn:dev:mac:" + data_dict['MAC'] + ":"
            # battery['bt'] = data_dict['current_time']
            # battery['n'] = 'battery'
            # battery['u'] = '%EL'
            # battery['t'] = 0
            # battery['v'] = data_dict['battery']
            # senml_message.append(battery)

            if 'ambient_temp' in config[data_dict['MAC']]:
                temp_streams = config[data_dict['MAC']]['ambient_temp']
                tmp_parts = temp_streams.split(",")
                for part in tmp_parts:
                    ambient_tmp = {}
                    ambient_tmp['n'] = 'ambient_temp' + "-" + part
                    ambient_tmp['u'] = 'Cel'
                    ambient_tmp['t'] = 0
                    ambient_tmp['v'] = data_dict['barometer'][0]
                    senml_message.append(ambient_tmp)
            # ambient_tmp = {}
            # ambient_tmp['n'] = 'ambient_temp'
            # ambient_tmp['u'] = 'Cel'
            # ambient_tmp['t'] = 0
            # ambient_tmp['v'] = data_dict['barometer'][0]
            # senml_message.append(ambient_tmp)


            if 'humidity' in config[data_dict['MAC']]:
                humidity_streams = config[data_dict['MAC']]['humidity']
                tmp_parts = humidity_streams.split(",")
                for part in tmp_parts:
                    humidity = {}
                    humidity['n'] = 'humidity' + "-" + part
                    humidity['u'] = '%RH'
                    humidity['t'] = 0
                    humidity['v'] = data_dict['humidity'][1]
                    senml_message.append(humidity)
            # humidity = {}
            # humidity['n'] = 'humidity'
            # humidity['u'] = '%RH'
            # humidity['t'] = 0
            # humidity['v'] = data_dict['humidity'][1]
            # senml_message.append(humidity)

            # Get configured data streams based on MAC

            if 'light' in config[data_dict['MAC']]:
                light_streams = config[data_dict['MAC']]['light']
                tmp_parts = light_streams.split(",")
                for part in tmp_parts:
                    light = {}
                    light['n'] = 'light' + "-" + part
                    light['u'] = 'lux'
                    light['t'] = 0
                    light['v'] = data_dict['light']
                    senml_message.append(light)


            # light = {}
            # light['n'] = 'light' + ""
            # light['u'] = 'lux'
            # light['t'] = 0
            # light['v'] = data_dict['light']
            # senml_message.append(light)


            if 'pressure' in config[data_dict['MAC']]:
                pressure_streams = config[data_dict['MAC']]['pressure']
                tmp_parts = pressure_streams.split(",")
                for part in tmp_parts:
                    pressure = {}
                    pressure['n'] = 'pressure' + "-" + part
                    pressure['u'] = 'millibar'
                    pressure['t'] = 0
                    pressure['v'] = data_dict['barometer'][1]
                    senml_message.append(pressure)
            # pressure = {}
            # pressure['n'] = 'pressure'
            # pressure['u'] = 'millibar'
            # pressure['t'] = 0
            # pressure['v'] = data_dict['barometer'][1]
            # senml_message.append(pressure)


            if 'accelerometer_x' in config[data_dict['MAC']]:
                accx_streams = config[data_dict['MAC']]['accelerometer_x']
                tmp_parts = accx_streams.split(",")
                for part in tmp_parts:
                    accelerometer_x = {}
                    accelerometer_x['n'] = 'accelerometer_x' + "-" + part
                    accelerometer_x['u'] = 'G'
                    accelerometer_x['t'] = 0
                    accelerometer_x['v'] = data_dict['accelerometer'][0]
                    senml_message.append(accelerometer_x)
            # accelerometer_x = {}
            # accelerometer_x['n'] = 'accelerometer_x'
            # accelerometer_x['u'] = 'G'
            # accelerometer_x['t'] = 0
            # accelerometer_x['v'] = data_dict['accelerometer'][0]
            # senml_message.append(accelerometer_x)


            if 'accelerometer_y' in config[data_dict['MAC']]:
                accy_streams = config[data_dict['MAC']]['accelerometer_y']
                tmp_parts = accy_streams.split(",")
                for part in tmp_parts:
                    accelerometer_y = {}
                    accelerometer_y['n'] = 'accelerometer_y' + "-" + part
                    accelerometer_y['u'] = 'G'
                    accelerometer_y['t'] = 0
                    accelerometer_y['v'] = data_dict['accelerometer'][1]
                    senml_message.append(accelerometer_y)
            # accelerometer_y = {}
            # accelerometer_y['n'] = 'accelerometer_y'
            # accelerometer_y['u'] = 'G'
            # accelerometer_y['t'] = 0
            # accelerometer_y['v'] = data_dict['accelerometer'][1]
            # senml_message.append(accelerometer_y)


            if 'accelerometer_z' in config[data_dict['MAC']]:
                accz_streams = config[data_dict['MAC']]['accelerometer_z']
                tmp_parts = accz_streams.split(",")
                for part in tmp_parts:
                    accelerometer_z = {}
                    accelerometer_z['n'] = 'accelerometer_z' + "-" + part
                    accelerometer_z['u'] = 'G'
                    accelerometer_z['t'] = 0
                    accelerometer_z['v'] = data_dict['accelerometer'][2]
                    senml_message.append(accelerometer_z)
            # accelerometer_z = {}
            # accelerometer_z['n'] = 'accelerometer_z'
            # accelerometer_z['u'] = 'G'
            # accelerometer_z['t'] = 0
            # accelerometer_z['v'] = data_dict['accelerometer'][2]
            # senml_message.append(accelerometer_z)


            if 'magnetometer_x' in config[data_dict['MAC']]:
                magnetx_streams = config[data_dict['MAC']]['magnetometer_x']
                tmp_parts = magnetx_streams.split(",")
                for part in tmp_parts:
                    magnetometer_x = {}
                    magnetometer_x['n'] = 'magnetometer_x' + "-" + part
                    magnetometer_x['u'] = 'uT'
                    magnetometer_x['t'] = 0
                    magnetometer_x['v'] = data_dict['magnetometer'][0]
                    senml_message.append(magnetometer_x)
            # magnetometer_x = {}
            # magnetometer_x['n'] = 'magnetometer_x'
            # magnetometer_x['u'] = 'uT'
            # magnetometer_x['t'] = 0
            # magnetometer_x['v'] = data_dict['magnetometer'][0]
            # senml_message.append(magnetometer_x)


            if 'magnetometer_y' in config[data_dict['MAC']]:
                magnety_streams = config[data_dict['MAC']]['magnetometer_y']
                tmp_parts = magnety_streams.split(",")
                for part in tmp_parts:
                    magnetometer_y = {}
                    magnetometer_y['n'] = 'magnetometer_y' + "-" + part
                    magnetometer_y['u'] = 'uT'
                    magnetometer_y['t'] = 0
                    magnetometer_y['v'] = data_dict['magnetometer'][1]
                    senml_message.append(magnetometer_y)
            # magnetometer_y = {}
            # magnetometer_y['n'] = 'magnetometer_y'
            # magnetometer_y['u'] = 'uT'
            # magnetometer_y['t'] = 0
            # magnetometer_y['v'] = data_dict['magnetometer'][1]
            # senml_message.append(magnetometer_y)


            if 'magnetometer_z' in config[data_dict['MAC']]:
                magnetz_streams = config[data_dict['MAC']]['magnetometer_z']
                tmp_parts = magnetz_streams.split(",")
                for part in tmp_parts:
                    magnetometer_z = {}
                    magnetometer_z['n'] = 'magnetometer_z' + "-" + part
                    magnetometer_z['u'] = 'uT'
                    magnetometer_z['t'] = 0
                    magnetometer_z['v'] = data_dict['magnetometer'][2]
                    senml_message.append(magnetometer_z)
            # magnetometer_z = {}
            # magnetometer_z['n'] = 'magnetometer_z'
            # magnetometer_z['u'] = 'uT'
            # magnetometer_z['t'] = 0
            # magnetometer_z['v'] = data_dict['magnetometer'][2]
            # senml_message.append(magnetometer_z)


            if 'gyroscope_x' in config[data_dict['MAC']]:
                gyrox_streams = config[data_dict['MAC']]['gyroscope_x']
                tmp_parts = gyrox_streams.split(",")
                for part in tmp_parts:
                    gyroscope_x = {}
                    gyroscope_x['n'] = 'gyroscope_x' + "-" + part
                    gyroscope_x['u'] = 'deg/sec'
                    gyroscope_x['t'] = 0
                    gyroscope_x['v'] = data_dict['gyroscope'][0]
                    senml_message.append(gyroscope_x)
            # gyroscope_x = {}
            # gyroscope_x['n'] = 'gyroscope_x'
            # gyroscope_x['u'] = 'deg/sec'
            # gyroscope_x['t'] = 0
            # gyroscope_x['v'] = data_dict['gyroscope'][0]
            # senml_message.append(gyroscope_x)

            if 'gyroscope_y' in config[data_dict['MAC']]:
                gyroy_streams = config[data_dict['MAC']]['gyroscope_y']
                tmp_parts = gyroy_streams.split(",")
                for part in tmp_parts:
                    gyroscope_y = {}
                    gyroscope_y['n'] = 'gyroscope_y' + "-" + part
                    gyroscope_y['u'] = 'deg/sec'
                    gyroscope_y['t'] = 0
                    gyroscope_y['v'] = data_dict['gyroscope'][1]
                    senml_message.append(gyroscope_y)
            # gyroscope_y = {}
            # gyroscope_y['n'] = 'gyroscope_y'
            # gyroscope_y['u'] = 'deg/sec'
            # gyroscope_y['t'] = 0
            # gyroscope_y['v'] = data_dict['gyroscope'][1]
            # senml_message.append(gyroscope_y)

            if 'gyroscope_z' in config[data_dict['MAC']]:
                gyroz_streams = config[data_dict['MAC']]['gyroscope_z']
                tmp_parts = gyroz_streams.split(",")
                for part in tmp_parts:
                    gyroscope_z = {}
                    gyroscope_z['n'] = 'gyroscope_z' + "-" + part
                    gyroscope_z['u'] = 'deg/sec'
                    gyroscope_z['t'] = 0
                    gyroscope_z['v'] = data_dict['gyroscope'][2]
                    senml_message.append(gyroscope_z)

            # gyroscope_z = {}
            # gyroscope_z['n'] = 'gyroscope_z'
            # gyroscope_z['u'] = 'deg/sec'
            # gyroscope_z['t'] = 0
            # gyroscope_z['v'] = data_dict['gyroscope'][2]
            # senml_message.append(gyroscope_z)

        return senml_message
if __name__ == "__main__":
    main()