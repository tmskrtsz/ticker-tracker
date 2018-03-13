const TelegramBot = require('node-telegram-bot-api');
const config = require('config');

const token = config.get('TELEGRAM_API');

// Telegram bot configuration
const bot = new TelegramBot(token);
bot.setWebHook(`${config.get('BOT_URL')}/bot${token}`);

module.exports = bot;

