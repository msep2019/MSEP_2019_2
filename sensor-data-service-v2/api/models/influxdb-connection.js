const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '34.67.130.25',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });
module.exports.influx = influx;  