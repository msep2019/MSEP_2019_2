import configparser
import docker

config = configparser.ConfigParser()
config.read('conf.ini')

def main():
    # client = docker.DockerClient(base_url='http://127.0.0.1:2375')
    client = docker.DockerClient(base_url='unix://var/run/docker.sock')
    containers = client.containers.list()
    for container in containers:
        stats = container.stats(stream=False)
        print("Name ", stats["name"][1:])
        print("Memory ", stats["memory_stats"]["usage"]/ (1024 * 1024))
        print(calculate_cpu_percent(container.stats(stream=False)))

def calculate_cpu_percent(d):
    cpu_count = len(d["cpu_stats"]["cpu_usage"]["percpu_usage"])
    cpu_percent = 0.0
    cpu_delta = float(d["cpu_stats"]["cpu_usage"]["total_usage"]) - \
                float(d["precpu_stats"]["cpu_usage"]["total_usage"])
    system_delta = float(d["cpu_stats"]["system_cpu_usage"]) - \
                   float(d["precpu_stats"]["system_cpu_usage"])
    if system_delta > 0.0:
        cpu_percent = cpu_delta / system_delta * 100.0 * cpu_count
    return cpu_percent
if __name__ == "__main__":
    main()
