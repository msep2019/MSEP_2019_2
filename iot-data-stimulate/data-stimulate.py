
import configparser
import time
import random
import json
import http.client

config = configparser.ConfigParser()
config.read('conf.ini')

def main():
    print("IoT service", config['iot-service']['url'])
    print("IoT service", config['iot-service']['host'])
    print("IoT service", config['iot-service']['port'])
    print("Name", "urn:dev:mac:" + config['device']['mac'] + ":")
    for i in range(1, 20):
        sendDataToService(generateSenMLData(20, 25))
        time.sleep(1)

    while True:
    # for i in range(1, 20):
        sendDataToService(generateSenMLData(51, 60))
        time.sleep(1)

def sendDataToService(data):
    client = http.client.HTTPConnection(config['iot-service']['host'], config['iot-service']['port'])
    headers = {'Content-type': 'application/json'}
    client.request(method="POST", url=config['iot-service']['url'], body=json.dumps(data), headers=headers)

    client.getresponse()


def generateSenMLData(minTemp, maxTemp):
    senml_message = []
    ambient_tmp = {}
    ambient_tmp['bn'] = "urn:dev:mac:" + config['device']['mac'] + ":"
    ambient_tmp['bt'] = time.time()
    ambient_tmp['n'] = 'ambient_temp'
    ambient_tmp['u'] = 'Cel'
    ambient_tmp['t'] = 0
    ambient_tmp['v'] = random.randint(minTemp, maxTemp)
    senml_message.append(ambient_tmp)
    return senml_message

if __name__ == "__main__":
    main()