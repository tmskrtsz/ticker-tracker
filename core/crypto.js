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

module.exports = {
	getChange,
	// getPrice,
	testFiat,
	testTicker
}
