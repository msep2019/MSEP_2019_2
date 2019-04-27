import bluepy
from bluepy import sensortag
from bluepy import btle
import math
import threading
import time
import json
import redis
from threading import Timer, Thread, Event


def main():
    interval = 30
    stopFlag = Event()
    timerTask = TimerTask(stopFlag, interval)
    timerTask.start()


class TimerTask(Thread):
    def __init__(self, event, duration):
        Thread.__init__(self)
        self.stopped = event
        self.duration = duration

    def run(self):

        while not self.stopped.wait(self.duration):
            try:
                device_list = []
                current_device_id = 0
                scanner = btle.Scanner()

                _redis = redis.StrictRedis(host="localhost", port=6379, db=0)
                print("Try to detect sensors each %s seconds" % self.duration)
                device_info_list = scanner.scan(5)

                for device in device_info_list:
                    device_name = device.getValueText(9)
                    print("Device addr ", device.addr, "name " , device_name)

                    if (device_name is not None) and ("SensorTag" in device_name):

                        if len(device_list) == 0:
                            data_thread = RetrievingDataThread(current_device_id, "Thread - " + str(current_device_id),
                                                               current_device_id, device)
                            current_device_id += 1
                            device_list.append(device.addr)
                            data_thread.start()
                        else:
                            not_existed = True
                            for tmp_run in device_list:
                                if device.addr == tmp_run:
                                    not_existed = False

                            if not_existed:
                                device_list.append(device.addr)
                                data_thread = RetrievingDataThread(current_device_id, "Thread - " + str(current_device_id),
                                                                   current_device_id, device)
                                current_device_id += 1
                                data_thread.start()
                for tmp in device_list:
                    _redis.sadd("device_list", tmp)
            except Exception as e:
                print("Exception in scanning")
                print(e)

class RetrievingDataThread(threading.Thread):
    _sensor_info = None
    _exit_flag = False
    _sensor = None
    _retry_count = 0
    _redis = None

    def __init__(self, threadID, name, counter, sensor_info):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
        self._sensor_info = sensor_info

        self._redis = redis.StrictRedis(host="localhost", port=6379, db=0)
    def run(self):
        print(">>>>>...")
        print(self._sensor_info)
        self._reconnect()

        while not self._exit_flag and self._retry_count < 5:
            try:
                if self._sensor.getState() == "conn":
                    # Get the timestamp
                    current_time = time.asctime(time.localtime(time.time()))
                    data_dict = {}
                    data_dict["current_time"] = current_time
                    data_dict["MAC"] = self._sensor_info.addr
                    data_dict["temperature"] = self._sensor.IRtemperature.read()
                    data_dict["humidity"] = self._sensor.humidity.read()
                    data_dict["barometer"] = self._sensor.barometer.read()
                    data_dict["accelerometer"] = self._sensor.accelerometer.read()
                    data_dict["magnetometer"] = self._sensor.magnetometer.read()
                    data_dict["gyroscope"] = self._sensor.gyroscope.read()
                    data_dict["light"] = self._sensor.lightmeter.read()
                    data_dict["battery"] = self._sensor.battery.read()
                    json_str = json.dumps(data_dict)
                    length = self._redis.lpush(self._sensor_info.addr, json_str)
                    if length > 100:
                        self._redis.rpop(self._sensor_info.addr)
                    #print(json_str)
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

            time.sleep(1.0)

    def set_exit_flag(self, exit_flag):
        self._exit_flag = exit_flag

    def _reconnect(self):
        try:
            if self._sensor is not None:
                self._sensor.disconnect()
                self._sensor = None

            if self._sensor is None and self._sensor_info is not None:

                print("Try to connect SensorTag...")
                self._sensor = sensortag.SensorTag(self._sensor_info.addr)

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


if __name__ == "__main__":
    main()