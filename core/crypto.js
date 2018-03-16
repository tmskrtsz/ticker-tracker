const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap();

// Fiat values that are supported by CoinMarketCap
const fiats = ["USD", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];

async function getPrice(symbol, convertPrice) {
	if (typeof symbol === 'string') {
		const result = await cmc.getTicker({
			limit: 1,
			currency: symbol.toLowerCase(),
			convert: convertPrice.toLowerCase()
		});

		return result;
	}
}

async function getSymbol(ticker) {
	const fiatFilter = fiats.filter((fiat => fiat === ticker.toUpperCase()));

	if (!fiatFilter.length > 0) {
		const symbol = await cmc.getTicker({ currency: ticker });
		return symbol[0].symbol;
	} else {
		const symbol = fiatFilter[0];
		return symbol;
	}
}

module.exports = {
	getPrice,
	getSymbol
}
