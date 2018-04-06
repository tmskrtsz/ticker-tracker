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
	getPrice,
	getSymbol,
	testFiat,
	testTicker
	} = require('./core/crypto');

bot.command('start', (ctx) => {
	ctx.reply(greet(ctx));
	ctx.reply(helloText);
	ctx.reply('For a list of commands type /help');
});

bot.command('help', (ctx) => ctx.reply(helpText));

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

		const result = await getPrice(cryptoPair);

		if (!result) {
			ctx.reply(`⚠️ Either "${cryptoPair[0]}" or "${cryptoPair[1]}" is incorrect`);
			return;
		}

		ctx.reply('Getting rates...');

		ctx.reply(`1 ${result.priceFrom} = ${result.price} ${result.priceTo}, ${getChange(result.change)}`);

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
