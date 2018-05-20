const config = require('config');
const mongoose = require('mongoose');

//-- Set up MongoDB
const mongoDB = config.get('MONGO_URI');

mongoose.connect(mongoDB)
.then(() => console.log(`Connection with database established`))
.catch((err) => console.log(`An error occured: ${err}`));

mongoose.Promise = global.Promise;
const db = mongoose.connection;

//-- Models
require('./models/Coins.js');
require('./models/Watchlist.js');

//-- Model methods
const findCoin = require('./models/Coins.js');
