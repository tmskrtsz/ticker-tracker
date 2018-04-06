const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap();

function testFiat(ticker) {
	// Fiat values that are supported by CoinMarketCap
	const fiats = ["USD", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];

	if (fiats.includes(ticker.toUpperCase())) {
		return true // If the array is larger than 0, it's a match
	} else {
		return false // Not a fiat
	}
}

async function testTicker(ticker) {
	const result = await cmc.getTicker({ currency:ticker });

	if (result.error) {
		return false
	} else {
		return true
	}
}

async function getPrice(tickers) {
	let result = [];
	let priceIn = '';

	// Add a dash to separate certain coin names like bitcoin cash
	// In order to be usable with the CMC api
	const newTickers = tickers.map((el, index) => {
		return el.replace(' ', '-').toLowerCase();
	})

	if (Array.isArray(tickers)) {
		if (testFiat(newTickers[1])) {
			priceIn = newTickers[1];
		} else {
			priceIn = await getSymbol(newTickers[1]);
		}

		result = await cmc.getTicker({
			currency: newTickers[0],
			convert: priceIn
		});

		const resultObj = {...result[0]};
		const price = resultObj[`price_${priceIn}`];
		console.log(price)
		// if (result.error || price === undefined) {
		// 	return false;
		// }

		return {
			priceFrom: resultObj.symbol,
			price: price.toLowerCase().toFixed(5),
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
		const symbol = testFiat(ticker);
		return symbol;
	}
}

function getChange(change) {
	if (parseInt(change) >= 0) {
		return `${change} 🔼 (1h change)`
	} else {
		return `${change} 🔽 (1h change)`
	}
}

module.exports = {
	getChange,
	getPrice,
	getSymbol,
	testFiat,
	testTicker
}
