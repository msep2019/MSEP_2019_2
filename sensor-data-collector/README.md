This project is for retrieving data from SensorTag. It searchs for pre-defined SensorTag data in SQLite DB and connect to sensor based on MAC address. There are 8 types of sensor data includes battery, light, temperature, humidity, pressure, accelerometer, gyroscope and magnetometer.
After connected to sensor, data will be send each x seconds (retrieving-rate value in configuration) through MQTT. Sensor data is formatted in SENML format (https://tools.ietf.org/html/draft-jennings-senml-08).
It also allows simulating devices for testing performance.

**Required libraries**

- paho-mqtt 
- bluepy
- redis
- sqlite3

**Command**

- To retrieve data from real sensors: python3 SensorTagDetector.py
- To simulate devices: python3 DataSimulator.py <**number of devices**>



  
