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

**Current features**
- Allow connecting from Raspberry Pi to multiple SensorTag and retrieving 8 types of sensor data.
- Allow developers to push dummy data for testing by using HTTP requests on IoT Service.
- Allow users/application to interact with InfluxDB to get neccessary data
- Monitor current status of sensor data on Raspberry Pi
- Monitor docker statistics
- Grafana configuration for retrieving data from InfluxDB and create proper visualizations. Instructions to create Alerts on Grafana and send messages to Slack or send emails to users.
- A simple dashboard built on Python and Flask framework.

