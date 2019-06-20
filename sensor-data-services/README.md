Project for monitoring current connected sensors. 
- Link for getting current connected sensors: http://\<host\>:\<port\>/devices
- Link for getting latest 100 SENML messages: http://\<host\>:\<port\>/device/info/all/<device_mac>

**Command**

- To run project: python3 sensor-data-services.py
- To deploy/run docker image: docker-compose up (modified docker-compose.yml to correct environment)


