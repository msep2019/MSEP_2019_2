import paho.mqtt.client as mqtt
import threading
import time
import json
import configparser
import sys
import random

config = configparser.ConfigParser()
config.read('conf.ini')


def main():
    num_of_threads = int(sys.argv[1])
    # create random mac address

    for _ in range(num_of_threads):
        mac_address = generateMAC()
        data_thread = GeneratingDataThread(mac_address)
        data_thread.start()


def generateMAC():
    return ':'.join('%02x' % random.randint(0, 255) for _ in range(6))


class GeneratingDataThread(threading.Thread):
    _device_mac = None
    _exit_flag = False

    def __init__(self, device_mac):
        threading.Thread.__init__(self)
        self._device_mac = device_mac

    def run(self):
        while True:
            self.push_to_mqtt(self._device_mac)

    def set_exit_flag(self, exit_flag):
        self._exit_flag = exit_flag

    def push_to_mqtt(self, mac_address):
        json_str = json.dumps(self.generate_senml_messages(mac_address))
        # print("SENML ", json_str)
        # Replace id, key and channel id with proper values
        # TODO: Add these information to configuration file.
        device_id = "6fea86c9-199d-432f-90cd-e189698e1576"
        device_key = "58a7d908-0399-4901-bc6d-2f2282e94d1e"
        channel_id = "a3e7119a-4fd4-4270-9689-169cbe1dc08b"

        # get broker address
        broker_address = config['MQTT']['broker']

        mqtt_client = mqtt.Client()
        mqtt_client.username_pw_set(device_id, device_key)
        mqtt_client.connect(broker_address)
        mqtt_topic = "channels/" + channel_id + "/messages"
        mqtt_client.publish(topic=mqtt_topic, payload=json_str)
        mqtt_client.disconnect()

    def generate_senml_messages(self, mac_address):
        senml_message = []
        current_time = time.time()
        # Insert battery value
        battery = {}
        battery['bn'] = "urn:dev:mac:" + mac_address + ":"
        battery['bt'] = current_time
        battery['n'] = 'battery'
        battery['u'] = '%EL'
        battery['t'] = 0
        battery['v'] = random.randint(1, 100)
        senml_message.append(battery)

        ambient_tmp = {}
        ambient_tmp['n'] = 'ambient_temp'
        ambient_tmp['u'] = 'Cel'
        ambient_tmp['t'] = 0
        ambient_tmp['v'] = random.randint(1, 100)
        senml_message.append(ambient_tmp)

        humidity = {}
        humidity['n'] = 'humidity'
        humidity['u'] = '%RH'
        humidity['t'] = 0
        humidity['v'] = random.randint(1, 100)
        senml_message.append(humidity)

        light = {}
        light['n'] = 'light'
        light['u'] = 'lux'
        light['t'] = 0
        light['v'] = random.randint(1, 2000)
        senml_message.append(light)

        pressure = {}
        pressure['n'] = 'pressure'
        pressure['u'] = 'millibar'
        pressure['t'] = 0
        pressure['v'] = random.randint(1, 3000)
        senml_message.append(pressure)

        accelerometer_x = {}
        accelerometer_x['n'] = 'accelerometer_x'
        accelerometer_x['u'] = 'G'
        accelerometer_x['t'] = 0
        accelerometer_x['v'] = random.randint(1, 10)
        senml_message.append(accelerometer_x)

        accelerometer_y = {}
        accelerometer_y['n'] = 'accelerometer_y'
        accelerometer_y['u'] = 'G'
        accelerometer_y['t'] = 0
        accelerometer_y['v'] = random.randint(1, 10)
        senml_message.append(accelerometer_y)

        accelerometer_z = {}
        accelerometer_z['n'] = 'accelerometer_z'
        accelerometer_z['u'] = 'G'
        accelerometer_z['t'] = 0
        accelerometer_z['v'] = random.randint(1, 10)
        senml_message.append(accelerometer_z)

        magnetometer_x = {}
        magnetometer_x['n'] = 'magnetometer_x'
        magnetometer_x['u'] = 'uT'
        magnetometer_x['t'] = 0
        magnetometer_x['v'] = random.randint(1, 10)
        senml_message.append(magnetometer_x)

        magnetometer_y = {}
        magnetometer_y['n'] = 'magnetometer_y'
        magnetometer_y['u'] = 'uT'
        magnetometer_y['t'] = 0
        magnetometer_y['v'] = random.randint(1, 10)
        senml_message.append(magnetometer_y)

        magnetometer_z = {}
        magnetometer_z['n'] = 'magnetometer_z'
        magnetometer_z['u'] = 'uT'
        magnetometer_z['t'] = 0
        magnetometer_z['v'] = random.randint(1, 10)
        senml_message.append(magnetometer_z)

        gyroscope_x = {}
        gyroscope_x['n'] = 'gyroscope_x'
        gyroscope_x['u'] = 'deg/sec'
        gyroscope_x['t'] = 0
        gyroscope_x['v'] = random.randint(1, 180)
        senml_message.append(gyroscope_x)

        gyroscope_y = {}
        gyroscope_y['n'] = 'gyroscope_y'
        gyroscope_y['u'] = 'deg/sec'
        gyroscope_y['t'] = 0
        gyroscope_y['v'] = random.randint(1, 180)
        senml_message.append(gyroscope_y)

        gyroscope_z = {}
        gyroscope_z['n'] = 'gyroscope_z'
        gyroscope_z['u'] = 'deg/sec'
        gyroscope_z['t'] = 0
        gyroscope_z['v'] = random.randint(1, 180)
        senml_message.append(gyroscope_z)

        return senml_message


if __name__ == "__main__":
    main()