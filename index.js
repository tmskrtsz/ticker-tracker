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

const bot = require('./config/telegram.js');

binance.options({
  APIKEY: config.get('BINANCE_API'),
  APISECRET: config.get('BINANCE_API_SECRET'),
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
});

app.post(`/hook`, (req, res) => {
  bot.handleUpdate(req.body, res.sendStatus(200));
});

//-- Set up MongoDB
const mongoDB = config.get('MONGO_URI');

mongoose.connect(mongoDB)
  .then(() => console.log(`Connection with database established`))
  .catch((err) => console.log(`An error occured: ${err}`));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.get('/', (req, res) => {
  res.redirect('https://t.me/TickerTracker_bot');
});

binance.prices('NANOETH', (error, ticker) => {
  const message = `Price of Nano is: ${ticker.NANOETH} ETH`;

	console.log(message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
