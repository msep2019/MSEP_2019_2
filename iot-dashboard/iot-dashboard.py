from flask import Flask, render_template
from flask_restful import Resource, Api
import time
import datetime
import random
import json
import influxdb

app = Flask(__name__)
api = Api(app)
@app.route('/')
def homepage():

    try:
        return render_template("index.html")
    except Exception as e:
        return render_template("error.html")

@app.route('/light-update')
def light():
    client = influxdb.InfluxDBClient('localhost', '8086', 'admin', '', 'mainflux')
    query = "select time, publisher, channel, link, \"name\", protocol,unit,updateTime,value from messages " \
                                                         "WHERE \"publisher\"='6fea86c9-199d-432f-90cd-e189698e1576' " \
                                                         "AND \"name\"='urn:dev:mac:f0:f8:f2:86:87:83:light' ORDER BY time DESC LIMIT 10"
    result = client.query(query)
    points = result.get_points()
    dict = []
    for point in points:
        tmp_time = time.mktime(datetime.datetime.strptime(point['time'][:-4], "%Y-%m-%dT%H:%M:%S.%f").timetuple())
        tmp_dict = [tmp_time * 1000 , round(point['value'], 2)]
        dict.append(tmp_dict)
        print("Time: %s, Value: %f" % (point['time'], point['value']))
    # print(result['values'])
    # print(result.raw)
    response = app.response_class(
        response=json.dumps(dict),
        status=200,
        mimetype='application/json'
    )
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
