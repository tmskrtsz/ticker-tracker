const TelegramBot = require('telegraf');
const config = require('config');

// Telegram bot configuration
const bot = new TelegramBot(config.get('TELEGRAM_API'), {webhookReply: true});
// bot.setWebHook(`${config.get('BOT_URL')}/bot${config.get('TELEGRAM_API')}`);
bot.telegram.setWebhook(`${config.get('BOT_URL')}/hook`)
// bot.telegram.setWebhook(config.get('TELEGRAM_API'));

module.exports = bot;
