const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '34.69.148.86',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });
module.exports.influx = influx;  