from flask import Flask
from flask_restful import Resource, Api
from influxdb import InfluxDBClient
import configparser

app = Flask(__name__)
api = Api(app)
config = configparser.ConfigParser()
config.read('conf.ini')

influx_client = InfluxDBClient(host=config['InfluxDB']['host'], port=config['InfluxDB']['port'])
influx_client.switch_database(config['InfluxDB']['database'])

# Declare resources for getting influxdb data

@app.route('/')
def homepage():

    try:
        return "hello"
    except Exception as e:
        return "error"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config['Server']['port'], debug=True)
