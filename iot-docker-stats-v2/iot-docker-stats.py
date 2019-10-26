# import eventlet
# eventlet.monkey_patch()

import configparser
import docker
import time
import json
import http.client
import threading
import schedule
import pymongo
import re
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from bson.json_util import dumps, RELAXED_JSON_OPTIONS
import dateutil.parser

async_mode = "eventlet"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode='threading')
thread = None

config = configparser.ConfigParser()
config.read('conf.ini')
sid = []
client_sid = {}
client_workers = {}
threads = {}
pattern = '[\w]x[\w]*_'
container_start_time = {}
mongoclient = MongoClient('mongodb+srv://iot-testbed:iot-testbed@cluster0-txati.gcp.mongodb.net/test?retryWrites=true&w=majority')
dockerStatsDb = mongoclient.dockerstats

try:
    # client = docker.DockerClient(config["docker"]["url"])
    client = docker.from_env()
except:
    client = docker.DockerClient(config["docker"]["url"])


class Worker:
    _exit_flag = False

    def __init__(self, socketio, container_id, session_id):
        self.socketio = socketio
        self.container_id = container_id
        self.session_id = session_id
        super(Worker, self).__init__()

    def run(self):
        docker_client = docker.from_env()
        while not self._exit_flag:
            container = docker_client.containers.get(self.container_id)
            final_stats = generate_container_stats(container)
            self.socketio.emit("stats", json.dumps(final_stats), room=self.session_id, namespace="/stats")

    def stop(self):
        self._exit_flag = True


def main():
    # client = docker.DockerClient(base_url='http://127.0.0.1:2375')
    #
    # containers = client.containers.get()
    # client.stats()
    # containers = client.containers.list()
    # while True:
    #     all_stats = []
    #     for container in containers:
    #         stats = container.stats(stream=False)
    #         # all_stats.extend(generateSenMLData(stats))
    #     # sendDataToService(all_stats)
    trackingThread = TrackingContainerThread(client)
    trackingThread.start()
    print("start socket io")
    socketio.run(app, debug=True)
    # compiledPattern = re.compile(pattern)
    # print(bool(compiledPattern.match('0x1d00523b820fFF8AC51480D687b0fEb1799B2227_')))



class TrackingContainerThread(threading.Thread):
    docker_client = None

    def __init__(self, docker_client):
        threading.Thread.__init__(self)
        self.docker_client = docker_client

    def run(self):
        print("In tracking thread")
        schedule.every(10).seconds.do(self.collect_docker_stats)
        while True:
            schedule.run_pending()
            time.sleep(1)

    def collect_docker_stats(self):
        print("Get containers")
        containers = self.docker_client.containers.list(filters={"name":pattern})
        for container in containers:
            print(container.id)
            if container.id in threads:
                # Get running time
                if time.time() - container_start_time[container.id] > 900:
                    threads[container.id].stop()
                    threads.pop(container.id)
                    container_start_time.pop(container.id)
                    container.stop()
            else:
                container_start_time[container.id] = time.time()
                thread = ContainerStatsCollectorThread(container)
                threads[container.id] = thread
                thread.start()
                # stats = container.stats(stream=False)


class ContainerStatsCollectorThread(threading.Thread):
    _container = None
    _stopFlag = False

    def __init__(self, container):
        threading.Thread.__init__(self)
        self._container = container

    def run(self):
        previous_stat = {}
        for stat in self._container.stats(stream=True, decode=True):
            if not self._stopFlag:
                print('In thread ' + self._container.id)
                dockerStatsDb.stats.insert_one(self.generate_container_stats(self._container.name, stat, previous_stat))
                time.sleep(5)
                previous_stat = stat
            else:
                break

    def stop(self):
        self._stopFlag = True

    def generate_container_stats(self, container_name, stat, previous_stat):
        print(stat)
        result = {}
        result['container_name'] = container_name
        result['container_id'] = stat['id']
        result['read_time'] = dateutil.parser.parse(stat['read'])
        result['cpu_percentage'] = calculate_cpu_percent(stat, previous_stat)
        result['mem_usage'] = stat['memory_stats']['usage']
        result['mem_max_usage'] = stat['memory_stats']['max_usage']
        result['mem_limit'] = stat['memory_stats']['limit']

        # Calculate network stats
        networks = stat['networks']
        totalRev = 0
        totalSend = 0
        for network in networks :
            print(network)
            totalRev = totalRev + networks[network]['rx_bytes']
            totalSend = totalSend + networks[network]['tx_bytes']
        result['network_input'] = totalRev
        result['network_output'] = totalSend

        # Calculate io stats
        accumulate_read = 0
        accumulate_write = 0
        iorows = stat['blkio_stats']['io_service_bytes_recursive']
        for row in iorows:
            if row['op'] == 'Read':
                accumulate_read = row['value']
            if row['op'] == 'Write':
                accumulate_write = row['value']
        result['accumulate_read'] = accumulate_read
        result['accumulate_write'] = accumulate_write
        return result

@app.route('/')
def index():
    return render_template('websocket-test.html')

@app.route('/api-test')
def restful():
    return render_template('websocket-test-restfulAPI.html')

@app.route('/stats/containers/<string:container_id>/', methods=['GET'])
def get_container_stats(container_id):
    # docker_client = docker.from_env()
    # container = docker_client.containers.get(container_id)
    # return jsonify(generate_container_stats(container))
    stats = dockerStatsDb.stats.find({'container_id':container_id}).sort("read_time")
    json_stats = dumps(stats, json_options=RELAXED_JSON_OPTIONS)
    stats_array = json.loads(json_stats)
    return render_template('container-stats.html', container_id=container_id, stats=stats_array)

@app.route('/stats/containers/<string:container_id>/raw', methods=['GET'])
def get_container_stats_raw(container_id):
    # docker_client = docker.from_env()
    # container = docker_client.containers.get(container_id)
    # return jsonify(generate_container_stats(container))
    stats = dockerStatsDb.stats.find({'container_id':container_id})
    return dumps(stats)

@socketio.on('container', namespace="/stats")
def container_stat(message):

    print("Received message")
    print(message)
    if (message['data'] != 'I\'m connected!'):
        # sid.append(request.sid)
        # client_sid[request.sid] = request
        # data_thread = RetrievingDataThread(request.sid, "Thead-" + request.sid, message['data'])
        # client_threads[request.sid] = data_thread
        # data_thread.start()
        worker = Worker(socketio, message['data'], request.sid)
        client_workers[request.sid] = worker
        socketio.start_background_task(worker.run())
        # while True:
        #     container = client.containers.get(message['data'])
        #     stats = container.stats(stream = False)
        #     print(stats)
        #     final_stats = {}
        #     final_stats['cpu_percentage'] = calculate_cpu_percent(stats)
        #     socketio.emit("stats", json.dumps(final_stats), room=request.sid, callback=test_callback(), namespace="/stats")
    else:
        emit('stats', {'data': 'Connected'})


def getContainerStats(container_id, sid):
    docker_client = docker.from_env()
    while True:
        container = docker_client.containers.get(container_id)
        # TODO: Use stream = true instead of using loop
        stats = container.stats(stream=False)
        print(stats)
        final_stats = {}
        final_stats['cpu_percentage'] = calculate_cpu_percent(stats, previous_stats)
        previous_stats = stats
        # client_sid[self.threadID].emit("stats", json.dumps(final_stats))
        socketio.emit("stats", json.dumps(final_stats), room=request.sid, namespace="/stats")
    # data_thread = RetrievingDataThread(request.sid, "Thead-" + request.sid, container_id)
    # client_threads[request.sid] = data_thread
    # data_thread.start()

def test_callback():
    print('sent')

@socketio.on('connect', namespace="/stats")
def test_connect():
    print("Connected")
    emit('stats', {'data': 'Connected'})

@socketio.on('disconnect', namespace="/stats")
def test_disconnect():
    print("Disconnected")
    client_workers[request.sid].stop()

# def sendDataToService(data):
#     client = http.client.HTTPConnection(config['iot-service']['host'], config['iot-service']['port'])
#     headers = {'Content-type': 'application/json'}
#     client.request(method="POST", url=config['iot-service']['url'], body=json.dumps(data), headers=headers)
#     client.getresponse()
#
#
# def generateSenMLData(data):
#     container_name = str(data["name"])[1:]
#     senml_message = []
#
#     cpu = {}
#     cpu['bn'] = "urn:dev:mac:" + config['device']['mac'] + ":" + container_name + ":"
#     cpu['bt'] = time.time()
#     cpu['n'] = "cpu"
#     cpu['u'] = '%EL'
#     cpu['t'] = 0
#     cpu['v'] = calculate_cpu_percent(data)
#     senml_message.append(cpu)
#
#     memory = {}
#     mem_in_MB = (float(data["memory_stats"]["usage"])/(1024 * 1024))
#     memory['n'] = "mem"
#     memory['u'] = '%'
#     memory['t'] = 0
#     memory['v'] = mem_in_MB
#     senml_message.append(memory)
#     return senml_message


def calculate_cpu_percent(data, previous_data):
    if not data or not previous_data:
        return 0
    # cpu_count = len(data["cpu_stats"]["cpu_usage"]["percpu_usage"])
    cpu_count = data["cpu_stats"]["online_cpus"]
    cpu_percent = 0.0
    cpu_delta = float(data["cpu_stats"]["cpu_usage"]["total_usage"]) - \
                float(previous_data["cpu_stats"]["cpu_usage"]["total_usage"])

    system_delta = float(data["cpu_stats"]["system_cpu_usage"]) - float(previous_data["cpu_stats"]["system_cpu_usage"])
    if system_delta > 0.0:
        cpu_percent = cpu_delta / system_delta * 100.0 * cpu_count
    return cpu_percent

def generate_container_stats(container):
    result = {}
    stats = container.stats(stream=False)
    print(container.attrs['Config'])
    print(stats)
    result['cpu_percentage'] = calculate_cpu_percent(stats)
    result['image'] = container.attrs['Config']['Image']
    result['port_bindings'] = container.attrs['HostConfig']['PortBindings']
    return result

# def convert_mongo_docs_to_dict(docs):
#     final_result = []
#     for doc in docs:
#         result = {}
#         result['container_name'] = doc['container_name']
#         result['container_id'] = doc['id']
#         result['read_time'] = dateutil.parser.parse(stat['read'])
#         result['cpu_percentage'] = calculate_cpu_percent(stat)
#         result['mem_usage'] = stat['memory_stats']['usage']
#         result['mem_max_usage'] = stat['memory_stats']['max_usage']
#         result['mem_limit'] = stat['memory_stats']['limit']
#
#         # Calculate network stats
#         networks = stat['networks']
#         totalRev = 0
#         totalSend = 0
#         for network in networks:
#             print(network)
#             totalRev = totalRev + networks[network]['rx_bytes']
#             totalSend = totalSend + networks[network]['tx_bytes']
#         result['network_input'] = totalRev
#         result['network_output'] = totalSend
#
#         # Calculate io stats
#         accumulate_read = 0
#         accumulate_write = 0
#         iorows = stat['blkio_stats']['io_service_bytes_recursive']
#         for row in iorows:
#             if row['op'] == 'Read':
#                 accumulate_read = row['value']
#             if row['op'] == 'Write':
#                 accumulate_write = row['value']
#         result['accumulate_read'] = accumulate_read
#         result['accumulate_write'] = accumulate_write
#         return result


if __name__ == "__main__":
    main()

