# import eventlet
# eventlet.monkey_patch()

import configparser
import docker
import time
import json
import http.client
import threading
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit


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
try:
    # client = docker.DockerClient(config["docker"]["url"])
    client = docker.from_env()
except:
    client = docker.DockerClient(config["docker"]["url"])


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
    print("start socket io")
    socketio.run(app, debug=True)


@app.route('/')
def index():
    return render_template('websocket-test.html')

@app.route('/stats/containers/<string:container_id>', methods=['GET'])
def get_container_stats(container_id):
    docker_client = docker.from_env()
    container = docker_client.containers.get(container_id)
    stats = container.stats(stream=False)
    print(stats)
    final_stats = {}
    final_stats['cpu_percentage'] = calculate_cpu_percent(stats)
    return jsonify(final_stats)

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
        stats = container.stats(stream=False)
        print(stats)
        final_stats = {}
        final_stats['cpu_percentage'] = calculate_cpu_percent(stats)
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
            stats = container.stats(stream=False)
            print(stats)
            final_stats = {}
            final_stats['cpu_percentage'] = calculate_cpu_percent(stats)
            # client_sid[self.threadID].emit("stats", json.dumps(final_stats))
            self.socketio.emit("stats", json.dumps(final_stats), room=self.session_id, namespace="/stats")
    def stop(self):
        self._exit_flag = True

if __name__ == "__main__":
    main()

