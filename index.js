const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const binance = require('node-binance-api');
const config = require('config');
const mongoose = require('mongoose');

const port = config.get('PORT');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

binance.options({
  APIKEY: config.get('BINANCE_API'),
  APISECRET: config.get('BINANCE_API_SECRET'),
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
});

require('./bot');

//-- Set up MongoDB
const mongoDB = config.get('MONGO_URI');

mongoose.connect(mongoDB)
  .then(() => console.log(`Connection with database established`))
  .catch((err) => console.log(`An error occured: ${err}`));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.get('/', (req, res) => {
  res.send('Hello World')
});

if (!process.env.NODE_ENV) {
  const localtunnel = require('localtunnel');
  const options = {subdomain: 'tickertracker'}

  const tunnel = localtunnel(port, options, (err, tunnel) => {
    if (err) {
      console.log(err);
    }
      tunnel.url
      console.log(`LocalTunnel up at ${tunnel.url}`);
  });

}

app.listen(port, () => console.log(`Listening on port ${port}`));
