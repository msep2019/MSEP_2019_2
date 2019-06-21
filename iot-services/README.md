A RESTful service to support IoT Testbed feature, currently provide service for adding sensor data.

**Required libraries**

- flask
- flask-restful
- redis
- influxdb
- paho-mqtt

**Command**

- To run/deploy Docker image: docker-compose up (modified docker-compose.yml to correct environment)

**Link**

- To insert data into IoT platform: http://\<host\>:\<port\>/iot/service/device/data
- Body: SENML message
