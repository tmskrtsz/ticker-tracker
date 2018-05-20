const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap();
const findCoin = require('../db/models/Coins.js');
const Watchlist = require('../db/models/Watchlist.js');

function testFiat(ticker) {
	// Fiat values that are supported by CoinMarketCap
	const fiats = ["USD", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];

	if (fiats.includes(ticker.toUpperCase())) {
		return true // If the array is larger than 0, it's a match
	} else {
		return false // Not a fiat
	}
}

async function testTicker(coins) {
	let result;
	for (const i in coins) {
		try {
			result = await findCoin(coins[i]);
		} catch(e) {
			console.error(e);
			return undefined;
		}
	}

	if (result === undefined || result.error) {
		return undefined;
	} else {
		return true;
	}
}

// async function getPrice(tickers) {
// 	const ticker;
// }

function getChange(change) {
	if (parseInt(change) >= 0) {
		return `${change} 🔼 (1h change)`
	} else {
		return `${change} 🔽 (1h change)`
	}
}

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

module.exports = {
	getChange,
	// getPrice,
	testFiat,
	testTicker,
	savePair
}
