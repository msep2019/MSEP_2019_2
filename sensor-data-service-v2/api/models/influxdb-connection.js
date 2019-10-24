const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '35.224.2.110',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });
module.exports.influx = influx;  