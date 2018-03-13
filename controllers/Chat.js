const ChatModel = require('../models/Chat.js');
const bot = require('../config/telegram.js');

bot.onText(/^\/setpair (.+)$/, (msg) => {
	console.log(msg.text)
})
