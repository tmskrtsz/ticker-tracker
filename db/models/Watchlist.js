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

const Watchlist = mongoose.model('Watchlist', WatchlistSchema);

async function savePair(chat_id, coin1, coin2) {
	const [coin1Id] = await findCoin(coin1);
	const [coin2Id] = await findCoin(coin2);

	const entry = new Watchlist({
		chat_id: chat_id,
		coin_1: coin1Id.name,
		coin_2: coin2Id.name
	});

	try {
		await entry.save()
		console.log(`${entry} was saved!`);
		return `Cryptopair was saved!`;

	} catch(e) {
		console.error(`There was a problem: ${e}`)
	}
}

async function getWatchlist(chat_id) {
	try {
		const watchlistCollection = await Watchlist.find({ chat_id: { $in: chat_id } });

		let list = `
		`;

		const listCollection = watchlistCollection.map(pair => {
			list += `${pair.coin_1} - ${pair.coin_2}
			`;
		});

		return list;

	} catch(e) {
		console.error(`getWatchlist resulted in: ${e}`);
	}
}

module.exports = {
	Watchlist,
	savePair,
	getWatchlist
}
