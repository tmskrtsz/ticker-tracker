const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap();

function testFiat(ticker) {
	// Fiat values that are supported by CoinMarketCap
	const fiats = ["USD", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];
	const fiatFilter = fiats.filter((fiat => fiat === ticker.toUpperCase()));

	if (fiatFilter.length > 0) {
		return true // If the array is larger than 0, it's a match
	} else {
		return false // Not a fiat
	}
}

async function testTicker(ticker) {
	if (Array.isArray(ticker)) {
		let result = [];
		ticker.map(async (currency, index) => {
			result[index] = await cmc.getTicker({ currency: currency });
		});
		console.log(result);
		return result
	} else if (typeof ticker === String) {
		const result = await cmc.getTicker({ currency: ticker })
		console.log(result);
		return result
	}
}

async function getPrice(tickers) {
	let result = [];

	if (Array.isArray(tickers)) {
		const priceIn = await getSymbol(tickers[1]);

		result = await cmc.getTicker({
			currency: tickers[0],
			convert: priceIn
		});

		const resultObj = {...result[0]};
		return {
			priceFrom: resultObj.symbol,
			price: resultObj[`price_${priceIn.toLowerCase()}`],
			priceTo: priceIn,
			change: resultObj.percent_change_1h
		}
	}
}

async function getSymbol(ticker) {
	// The ticker is not fiat
	if (!testFiat(ticker)) {
		const symbol = await cmc.getTicker({ currency: ticker });

		// The returned value is an error, the parameter has to be
		// a CMC id such as 'bitcoin'
		if (symbol.error) {
			return symbol; // Return a json error from CMC
		} else {
			// Otherwise return the symbol for the id. BTC for bitcoin, f.e.
			return symbol[0].symbol;
		}
	} else {
		// If the parameter matches a fiat in the list, return that
		const symbol = fiatFilter[0];
		return symbol;
	}
}

module.exports = {
	getPrice,
	getSymbol,
	testFiat,
	testTicker
}
