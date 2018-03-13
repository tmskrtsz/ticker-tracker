const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const binance = require('node-binance-api');
const config = require('config');
const mongoose = require('mongoose');

const port = config.get('PORT');

const isProduction = process.env.NODE_ENV === 'production';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

const bot = require('./config/telegram.js');
require('./config/binance.js');

app.post(`/bot${config.get('TELEGRAM_API')}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

//-- Set up MongoDB
const mongoDB = config.get('MONGO_URI');

mongoose.connect(mongoDB)
  .then(() => console.log(`Connection with database established`))
  .catch((err) => console.log(`An error occured: ${err}`));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

require('./controllers/Chat');

function getThreats(first_name, last_name) {
  const threats = [
    `Akkarsz verest, ${last_name}?`,
    `Nagy barat szeretnel lenni a halallal?`,
    `${first_name}, elment az eszed?`,
    `${first_name} ${last_name} egy igazi szeleburdi`,
    `${first_name}, Ne tüzeskedj, mert bepisilsz!`,
    `Ne irjal tobbet, hátrakötöm a sarkadat!`,
    `Vigyázz, mert ha csak melléd ütök is, a tűzoltók vágnak ki az ajtókeretből!`
  ]

  return threats[Math.floor(Math.random() * threats.length)];
}

const helloText = `👋 Welcome to the Ticker Tracker!`;
bot.on('message', (msg) => {
  if (msg.text.toString() === "/start") {
    bot.sendMessage(msg.chat.id, helloText);
  } else {
    console.log(msg.text);
    bot.sendMessage(msg.chat.id, getThreats(msg.from.first_name, msg.from.last_name));
  }
})

app.get('/', (req, res) => {
  res.redirect('https://t.me/TickerTracker_bot');
});


binance.prices('NANOETH', (error, ticker) => {
  const message = `Price of Nano is: ${ticker.NANOETH} ETH`;

	console.log(message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
