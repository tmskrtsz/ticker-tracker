const TelegramBot = require('telegraf');
const config = require('config');
const token = config.get('TELEGRAM_API');

// Telegram bot configuration
const bot = new TelegramBot(token);

const {
	helloText,
	helpText,
	getSuggestions,
	getFirstName,
	getMessage,
	greet } = require('./core/');

const {
	getChange,
	// getPrice,
	testFiat,
	testTicker,
	savePair
	} = require('./core/crypto');

const Watchlist = require('./db/models/Watchlist.js');

bot.command('start', (ctx) => {
	ctx.reply(greet(ctx));
	ctx.reply(helloText);
	ctx.reply('For a list of commands type /help');
});

bot.command('help', (ctx) => ctx.reply(helpText));

bot.command('setpair', async (ctx) => {
	let message;

	try {
		message = await getMessage('/setpair', ctx);
	} catch(e) {
		console.error(`There was a problem getting the message. ${e}`);
	}

	if (message != undefined) {
		let cryptoPair = new Array();

		if (message.indexOf(' ') <= 0) {
			cryptoPair = message.split(',', 2);
		} else {
			cryptoPair = message.split(', ', 2);
		}

		if (cryptoPair.length < 2) {
			ctx.reply('⚠️ Beep-boop you didn\'t specify a second option.');
			return;
		}

		if (testFiat(cryptoPair[0])) {
			ctx.reply('⚠️ You can only have fiat as the second option in the pair.');
			return;
		}

		if (await testTicker(cryptoPair) === undefined) {
			ctx.reply(`⚠️ There was a problem finding ${cryptoPair[0]} or ${cryptoPair[1]}.`)
			return;
		}

		try {
			await savePair(ctx.chat.id, cryptoPair[0], cryptoPair[1]);
			ctx.reply(`✅ Done! Hit /watchlist to view the price.`)
		} catch(e) {
			ctx.reply('There was a problem');
			console.error(e);
		}
	}
});

bot.command('getprice', async (ctx) => {
	const message = await getMessage('/getprice', ctx);

	if (message != undefined) {
		let cryptoPair = new Array();

		if (message.indexOf(' ') <= 0) {
			cryptoPair = message.split(',', 2);
		} else {
			cryptoPair = message.split(', ', 2);
		}

		if (cryptoPair.length < 2) {
			ctx.reply('⚠️ Beep-boop you didn\'t specify a second option.');
			return;
		}

		if (testFiat(cryptoPair[0])) {
			ctx.reply('⚠️ You can only have fiat as the second option in the pair.');
			return;
		}

		// To do: Get crypto prices from db and send it to client

		ctx.reply('Getting rates...');

	} else {
		ctx.reply('⚠️ You didn\'t specify a crypto pair. Try /getprice ethereum, bitcoin');
	}
});

bot.hears(['Hey', 'hey', 'hello', 'hi'], ctx => ctx.reply(`A ${ctx.message.text} to you too! 👋`));

bot.on('text', (ctx) => {
	const firstName = getFirstName(ctx);
	ctx.reply(getSuggestions(firstName));
});

bot.catch((err) => {
	console.log('Ooops', err)
})

bot.startPolling()
