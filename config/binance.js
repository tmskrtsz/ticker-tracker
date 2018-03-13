const binance = require('node-binance-api');
const config = require('config');

binance.options({
  APIKEY: config.get('BINANCE_API'),
  APISECRET: config.get('BINANCE_API_SECRET'),
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
});
