const TelegramBot = require('telegraf');
const config = require('config');
const binance = require('node-binance-api');
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

const { getPrice, getSymbol } = require('./core/crypto');

bot.command('start', (ctx) => {
  ctx.reply(greet(ctx));
  ctx.reply(helloText);
  ctx.reply('For a list of commands type /help');
});

bot.command('help', (ctx) => ctx.reply(helpText));

bot.command('setpair', async (ctx) => {
  const message = await getMessage('/setpair', ctx);

  if (message != undefined) {
    const cryptoPair = await message.split(', ', 2);
    const tickers = await cryptoPair.join('');

    if (cryptoPair.length < 2) {
      ctx.reply('Beep-boop you didn\'t specify a second coin.');
      return;
    } else if (cryptoPair.length > 2) {
      ctx.reply('Pair means 2 🙌, discarding the last coin.')
    } else {
      ctx.reply('Getting rates...');
    }

    const symbol = await getSymbol(cryptoPair[1]);
    const result = await getPrice(cryptoPair[0], symbol);

    const replyMsg = `1 ${cryptoPair[0]} = ${result[0][`price_${symbol.toLowerCase()}`]} ${cryptoPair[1]}`;

    await ctx.reply(replyMsg);
  } else {
    ctx.reply('You didn\'t specify a crypto pair. Try /setpair ethereum, bitcoin');
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
