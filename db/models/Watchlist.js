const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findCoin = require('./Coins.js');

const WatchlistSchema = new Schema({
	chat_id: {
		type: Number,
		unique: false,
		required: [true, "Chatroom ID must be saved"]
	},
	coin_1: {
		type: String,
		unique: false,
		required: true
	},
	coin_2: {
		type: String,
		unique: false,
		required: true
	},
	price: {
		type: Number,
		unique: false,
		required: false
	}
})

module.exports = mongoose.model('Watchlist', WatchlistSchema);
