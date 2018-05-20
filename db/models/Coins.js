const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinMarketCap = require('coinmarketcap-api');
const cmc = new CoinMarketCap();

const CoinsModelSchema = new Schema({
	id: {
		type: Number,
		unique: false,
		required: [true, "An ID must be associated with a coin!"]
	},
	name: {
		type: String,
		unique: false,
		required: [true, "Full name must be saved"]
	},
	symbol: {
		type: String,
		unique: false,
		required: [true, "A symbol to be associated with the full name"]
	},
	slug: String,
})

const Coin = mongoose.model('Coin', CoinsModelSchema);

module.exports = async function findCoin(name) {
	const upperCaseName = name.toUpperCase();

	const query = {
		$or: [
			{ name: name },
			{ symbol: upperCaseName},
			{ slug: name }
		]
	}

	let result;

	try {
		result = await Coin.find(query);

		if (!result || result.length <= 0) {
			return { error: "No coin found" };
		}
	} catch(err) {
		console.error(err);
	}

 return result;
}

function getAllCoins() {
	cmc.getListings()
		.then(res => {
			const { data } = res;

			Object.keys(data).forEach(coins => {
				const coin = data[coins];

				const entry = new Coin({
					id: coin.id,
					name: coin.name,
					symbol: coin.symbol,
					slug: coin.website_slug
				});

				entry.save(function (err, entry) {
					if (err) {
						return console.error(err);
					} else {
						console.log(`${entry.name} was saved!`);
					}
				})
			})
		})
		.catch(console.error);
	}

Coin.count()
	.then(count => {
		if (count === 0) {
			getAllCoins();
		}
	})
	.catch(err => console.error(err));
