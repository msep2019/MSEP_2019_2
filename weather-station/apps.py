import configparser
import time
import json
import http.client
import threading
from flask import Flask, render_template, request, jsonify
import dateutil.parser
import urllib.request
import urllib.parse
import requests
import math

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
thread = None

config = configparser.ConfigParser()
config.read('conf.ini')
highest_temp = 0
lowest_temp = -100


def main():
    app.run(host='0.0.0.0', debug=True, port=8000)


@app.route('/')
def index():
    return render_template('weather.html', config=config['restful-server'])


@app.route('/sensor/data', methods=['GET'])
def get_sensor_data():
    global highest_temp
    global lowest_temp
    final_result = {}
    # connection = http.client.HTTPConnection(config['restful-server']['service_host'], config['restful-server']['service_port'], timeout=10)
    # temperature_url = urllib.parse.quote(config['restful-server']['request_url'].replace("datastream_id", config['restful-server']['temperature_datastream']))
    # print("Temp url " + temperature_url)
    # connection.request('GET', temperature_url)
    # temperature_response = connection.getresponse()
    # temperature_data = json.load(temperature_response.json())
    # print(temperature_data)

    # Get temperature data
    temperature_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server']['temperature_datastream'])
    response = requests.get(temperature_url)
    temperature_data = response.json()

    # Get light data
    light_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server'][
        'light_datastream'])
    response = requests.get(light_url)
    light_data = response.json()

    # Get humidity data
    humidity_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server'][
        'humidity_datastream'])
    response = requests.get(humidity_url)
    humidity_data = response.json()

    # Get pressure data
    pressure_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server'][
        'pressure_datastream'])
    response = requests.get(pressure_url)
    pressure_data = response.json()

    light_value = light_data[0]['result']
    humidity_value = humidity_data[0]['result']
    temperature_value = temperature_data[0]['result']
    pressure_value = pressure_data[0]['result']

    final_result['temperature'] = temperature_value
    if highest_temp == 0:
        highest_temp = temperature_value
    else:
        if highest_temp < temperature_value:
            highest_temp = temperature_value

    if lowest_temp == -100:
        lowest_temp = temperature_value
    else:
        if lowest_temp > temperature_value:
            lowest_temp = temperature_value
    final_result['highest_temp'] = highest_temp
    final_result['lowest_temp'] = lowest_temp
    final_result['light'] = light_value
    final_result['humidity'] = humidity_value
    final_result['pressure'] = pressure_value
    chance_to_rain_value = calculate_chance_to_rain(humidity_value, light_value, temperature_value)
    final_result['chance_to_rain'] = chance_to_rain_value
    # TODO: calculate wind speed based on acceleration and gyroscope
    wind_value = 20
    final_result['wind'] = wind_value
    final_result['highest_wind'] = 40
    final_result['lowest_wind'] = 5


    suggestion = suggest(humidity_value, chance_to_rain_value, light_value, temperature_value, wind_value)
    max_acc_diff = calculate_max_acceleration_diff()
    if max_acc_diff > 3:
        suggestion = suggestion + "\n" + "The sensor is dropped or there is an earthquake. \n"

    final_result['suggestion'] = suggestion
    return jsonify(final_result)


# Just a dummy calculation based on humidity, light, temperature
def calculate_chance_to_rain(humidity, light, temperature):
    chance_to_rain = humidity / 2
    if 150 < light < 200:
        chance_to_rain = chance_to_rain + 10
    if 50 < light <= 150:
        chance_to_rain = chance_to_rain + 12
    if 0 <= light <= 50:
        if temperature < 15:
            chance_to_rain = chance_to_rain + 15
        else:
            chance_to_rain = chance_to_rain + 5
    if chance_to_rain > 100:
        chance_to_rain = 100
    return chance_to_rain

def calculate_max_acceleration_diff():
    # Get acceleration x data
    acceleration_x_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server'][
        'accelerometer_x_datastream'])
    response = requests.get(acceleration_x_url)
    acceleration_x_data = response.json()
    max_difference_x = 0
    previous_value = 0
    for point in acceleration_x_data:
        diff = abs(point['result'] - previous_value)
        previous_value = point['result']
        if max_difference_x < diff:
            max_difference_x = diff

    # Get acceleration y data
    acceleration_y_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server'][
        'accelerometer_y_datastream'])
    response = requests.get(acceleration_y_url)
    acceleration_y_data = response.json()
    max_difference_y = 0
    previous_value = 0
    for point in acceleration_y_data:
        diff = abs(point['result'] - previous_value)
        previous_value = point['result']
        if max_difference_y < diff:
            max_difference_y = diff

    # Get acceleration z data
    acceleration_z_url = config['restful-server']['service_url'].replace("datastream_id", config['restful-server'][
        'accelerometer_z_datastream'])
    response = requests.get(acceleration_z_url)
    acceleration_z_data = response.json()
    max_difference_z = 0
    previous_value = 0
    for point in acceleration_z_data:
        diff = abs(point['result'] - previous_value)
        previous_value = point['result']
        if max_difference_z < diff:
            max_difference_z = diff
    return max_difference_x + max_difference_y + max_difference_z

# A dummy suggestion
def suggest(humidity, chance_to_rain, light, temperature, wind):
    suggestion = ""
    if temperature > 30:
        suggestion = suggestion + "Temperature is too high, remember to drink enough water.\n"

    if chance_to_rain > 50:
        suggestion = suggestion + "There may be rain outside, please remember to bring umbrella.\n"

    if light < 20:
        suggestion = suggestion + "Time to get some sleep.\n"

    if suggestion == "":
        suggestion = "Excellent for outdoor activities.\n"

    return suggestion

if __name__ == "__main__":
    main()

