# MSEP_2019_2

A repository for IoT solution.
Structure of repository:

**Projects deployed on IoT Gateway (Raspberry Pi)**

- sensor-data-collector: for getting sensor data and simuating virtual devices
- sensor-data-services: for monitoring sensors

**Projects deployed on IoT server**

- iot-dashboard: a simple dashboard for visualizing sensor data
- iot-services: services for IoT functionalities
- iot-admin: project for registering and monitoring users and devices

**Utility projects**

- iot-docker-stats: a simple tool for collecting Docker image statistics and sending to IoT platform
- iot-data-stimulate: a simple tool for generating sample data and sending to IoT platform

**Other directories**

- document: contains all related documents

**Main technologies**

- Programming language: Python3
- Package solution: Docker image
- Database: Redis, MySQL, SQLite, InfluxDB
- Protocols: HTTP, MQTT

**Docker**

- document -> configuration.md : docker installation and configuration for Windows OS and Ubuntu
- document -> back-up.md : docker container backup and restore & docker images saving and restore

**Grafana**

- document: Grafana installation via Docker, Grafana dashboard configuration and alert setting up

