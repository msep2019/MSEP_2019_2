from flask import Flask, request
from flask_restful import Resource, Api
from influxdb import InfluxDBClient
import configparser
import paho.mqtt.client as mqtt
import json


app = Flask(__name__)
api = Api(app)
config = configparser.ConfigParser()
config.read('conf.ini')

# influx_client = InfluxDBClient(host=config['InfluxDB']['host'], port=config['InfluxDB']['port'])
# influx_client.switch_database(config['InfluxDB']['database'])


@app.route('/iot/service/device/data', methods=['POST'])
def add_device_data():
    # if not request.json:
    #     abort(400)
    # print("Request message ", json.dumps(request.json))
    broker_address = config['Mainflux']['broker']
    mqtt_client = mqtt.Client()
    mqtt_client.username_pw_set(config['Mainflux']['thing-id'], config['Mainflux']['thing-key'])
    mqtt_client.connect(broker_address)
    mqtt_topic = "channels/" + config['Mainflux']['channel-id'] + "/messages"
    mqtt_client.publish(topic=mqtt_topic, payload=json.dumps(request.json))

    mqtt_client.disconnect()
    dict = {}
    dict['status'] = 200
    response = app.response_class(
        response=json.dumps(dict),
        status=200,
        mimetype='application/json'
    )
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config['Server']['port'], debug=True)
