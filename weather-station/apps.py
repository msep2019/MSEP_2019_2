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

    light_value = light_data[0]['result']
    humidity_value = humidity_data[0]['result']
    temperature_value = temperature_data[0]['result']

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
    chance_to_rain_value = calculate_chance_to_rain(humidity_value, light_value, temperature_value)
    final_result['chance_to_rain'] = chance_to_rain_value
    # TODO: calculate wind speed based on acceleration and gyroscope
    wind_value = 20
    final_result['wind'] = wind_value
    final_result['highest_wind'] = 40
    final_result['lowest_wind'] = 5
    final_result['suggestion'] = suggest(humidity_value, chance_to_rain_value, light_value, temperature_value, wind_value)
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

