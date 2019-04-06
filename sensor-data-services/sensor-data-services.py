from flask import Flask
from flask_restful import Resource, Api
import redis
import json

app = Flask(__name__)
api = Api(app)

_redis = redis.StrictRedis(host="localhost", port=6379, db=0)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/')

class DeviceList(Resource):
    def get(self):
        device_list = _redis.lrange("device_list", 0, 100)
        data_dict = {}
        tmp_devices = []
        for device in device_list:
            tmp_devices.append(device.decode('utf-8'))
        data_dict["device_list"] = tmp_devices
        print(device_list)
        return data_dict

class SensorTagInfo(Resource):
    def get(self, device_id):
        device_info = _redis.lrange(device_id, 0, 100)
        data_dict = {}
        tmp_devices = []
        for device in device_info:
            tmp_devices.append(json.loads(device.decode('utf-8')))
        data_dict["data"] = tmp_devices
        # print(tmp_devices)
        return data_dict

api.add_resource(DeviceList, '/devices')
api.add_resource(SensorTagInfo, '/device/info/all/<string:device_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)