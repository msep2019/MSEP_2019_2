import configparser
import docker
import time
import json
import http.client

config = configparser.ConfigParser()
config.read('conf.ini')


def main():
    # client = docker.DockerClient(base_url='http://127.0.0.1:2375')
    client = docker.DockerClient(config["docker"]["url"])
    containers = client.containers.list()
    while True:
        all_stats = []
        for container in containers:
            stats = container.stats(stream=False)
            all_stats.extend(generateSenMLData(stats))
        sendDataToService(all_stats)


def sendDataToService(data):
    client = http.client.HTTPConnection(config['iot-service']['host'], config['iot-service']['port'])
    headers = {'Content-type': 'application/json'}
    client.request(method="POST", url=config['iot-service']['url'], body=json.dumps(data), headers=headers)
    client.getresponse()


def generateSenMLData(data):
    container_name = str(data["name"])[1:]
    senml_message = []

    cpu = {}
    cpu['bn'] = "urn:dev:mac:" + config['device']['mac'] + ":" + container_name + ":"
    cpu['bt'] = time.time()
    cpu['n'] = "cpu"
    cpu['u'] = '%EL'
    cpu['t'] = 0
    cpu['v'] = calculate_cpu_percent(data)
    senml_message.append(cpu)

    memory = {}
    mem_in_MB = (float(data["memory_stats"]["usage"])/(1024 * 1024))
    memory['n'] = "mem"
    memory['u'] = '%'
    memory['t'] = 0
    memory['v'] = mem_in_MB
    senml_message.append(memory)
    return senml_message


def calculate_cpu_percent(data):
    cpu_count = len(data["cpu_stats"]["cpu_usage"]["percpu_usage"])
    cpu_percent = 0.0
    cpu_delta = float(data["cpu_stats"]["cpu_usage"]["total_usage"]) - \
                float(data["precpu_stats"]["cpu_usage"]["total_usage"])
    system_delta = float(data["cpu_stats"]["system_cpu_usage"]) - \
                   float(data["precpu_stats"]["system_cpu_usage"])
    if system_delta > 0.0:
        cpu_percent = cpu_delta / system_delta * 100.0 * cpu_count
    return cpu_percent


if __name__ == "__main__":
    main()
