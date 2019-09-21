var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./configuration.ini');
exports.domain = properties.get("domain.url");