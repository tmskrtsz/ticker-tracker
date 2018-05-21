const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findCoin = require('./Coins.js');

const WatchlistSchema = new Schema({
	chat_id: {
		type: Array,
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

	const query = {
			coin_1: coin1Id.name,
			coin_2: coin2Id.name
	}

	// If the crypto pair is already in the database,
	// add the new chat id to the array to avoid duplications
	const update = {
		$addToSet: { chat_id: chat_id }
	}

	let isInDb = false;

	try {
		await Watchlist.findOneAndUpdate(query, update, function(err, result) {
			if (result) {
				isInDb = true;
			}
		});

	} catch(e) {
		console.error(e);
	}

	if (isInDb) return isInDb;

	if (!isInDb) {
		const entry = new Watchlist({
			chat_id: chat_id,
			coin_1: coin1Id.name,
			coin_2: coin2Id.name
		});

		try {
			await entry.save()
			console.log(`${entry} was saved!`);
			return true;

		} catch(err) {
			console.error(`There was a problem: ${err}`)
			return false;
		}
	}
}

async function checkDuplicate(chat_id, coin1, coin2) {
	const [coin1Id] = await findCoin(coin1);
	const [coin2Id] = await findCoin(coin2);

	const query = {
			chat_id: { $in: [chat_id ] },
			coin_1: coin1Id.name,
			coin_2: coin2Id.name
	}

	let result = false;

	const duplicateResult = await Watchlist.find(query);

	if (duplicateResult.err) {
		console.error(err);
		return;
	}

	if (duplicateResult.length > 0) {
		result = true;
	}

	return result;
}

async function getWatchlist(chat_id) {
	try {
		const watchlistCollection = await Watchlist.find({ chat_id: { $in: [ chat_id ] } });

		let list = `
		`;

		const listCollection = watchlistCollection.map(pair => {
			list += ` ${pair.coin_1} - ${pair.coin_2}
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
	checkDuplicate,
	getWatchlist
}
