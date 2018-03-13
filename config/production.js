const now = require('now-env');

const { MONGO_URI } = process.env;

module.exports = {
	PORT: 8080,
	MONGO_URI: MONGO_URI,
}
