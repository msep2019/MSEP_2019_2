from flask import Flask, render_template
from flask_restful import Resource, Api
import time
import datetime
import random
import json
import influxdb
import configparser

app = Flask(__name__)
api = Api(app)
config = configparser.ConfigParser()
config.read('conf.ini')
client = influxdb.InfluxDBClient(config["InfluxDB"]["host"], config["InfluxDB"]["port"], config["InfluxDB"]["username"],
                                 config["InfluxDB"]["password"], config["InfluxDB"]["database"])

@app.route('/')
def homepage():

    try:
        return render_template("index.html")
    except Exception as e:
        return render_template("error.html")

@app.route('/light-update/<string:device_id>')
def light(device_id):

    device_name = "urn:dev:mac:" + device_id + ":light"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(device_name)

    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    response = app.response_class(
        response=json.dumps(final_list),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/temp-update/<string:device_id>')
def temperature(device_id):
    device_name = "urn:dev:mac:" + device_id + ":ambient_temp"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(device_name)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    response = app.response_class(
        response=json.dumps(final_list),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/humidity-update/<string:device_id>')
def humidity(device_id):
    device_name = "urn:dev:mac:" + device_id + ":humidity"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(device_name)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    response = app.response_class(
        response=json.dumps(final_list),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/accelerometer-update/<string:device_id>')
def accelerometer(device_id):
    measurement = "urn:dev:mac:" + device_id + ":accelerometer_x"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_series = []
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    measurement = "urn:dev:mac:" + device_id + ":accelerometer_y"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    measurement = "urn:dev:mac:" + device_id + ":accelerometer_z"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    response = app.response_class(
        response=json.dumps(final_series),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/gyroscope-update/<string:device_id>')
def gyroscope(device_id):
    measurement = "urn:dev:mac:" + device_id + ":gyroscope_x"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_series = []
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    measurement = "urn:dev:mac:" + device_id + ":gyroscope_y"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    measurement = "urn:dev:mac:" + device_id + ":gyroscope_z"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    response = app.response_class(
        response=json.dumps(final_series),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/magnetometer-update/<string:device_id>')
def magnetometer(device_id):
    measurement = "urn:dev:mac:" + device_id + ":magnetometer_x"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_series = []
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    measurement = "urn:dev:mac:" + device_id + ":magnetometer_y"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    measurement = "urn:dev:mac:" + device_id + ":magnetometer_z"
    query = "select time, publisher, channel, link, \"name\", " \
            "protocol,unit,updateTime,value from messages " \
            "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576'" \
            "AND \"name\"= '{}' ORDER BY time DESC LIMIT 20".format(measurement)
    result = client.query(query)
    points = result.get_points()
    final_list = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000, round(point['value'], 2)]
        final_list.append(tmp_dict)
    final_list.reverse()
    final_series.append(final_list)

    response = app.response_class(
        response=json.dumps(final_series),
        status=200,
        mimetype='application/json'
    )
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
