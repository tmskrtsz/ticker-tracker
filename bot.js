const bot = require('./config/telegram');

function getThreats(first_name, last_name) {
  const threats = [
    `Akkarsz verest, ${last_name}?`,
    `Nagy barat szeretnel lenni a halallal?`,
    `${first_name}, elment az eszed?`,
    `${first_name} ${last_name} egy igazi szeleburdi`,
    `${first_name}, Ne tüzeskedj, mert bepisilsz!`,
    `Ne irjal tobbet, hátrakötöm a sarkadat!`,
    `Vigyázz, mert ha csak melléd ütök is, a tűzoltók vágnak ki az ajtókeretből!`
  ]

  return threats[Math.floor(Math.random() * threats.length)];
}

const helloText = `👋 Welcome to the Ticker Tracker!`;
// bot.on('message', (msg) => {
//   if (msg.text.toString() === "/start") {
//     bot.sendMessage(msg.chat.id, helloText);
//   } else {
//     console.log(msg.text);
//     bot.sendMessage(msg.chat.id, getThreats(msg.from.first_name, msg.from.last_name));
//   }
// })

bot.command('start', (ctx) => ctx.reply(helloText));
bot.command('setpair', (ctx) => {
	ctx.reply('You selected setpair');
});

bot.startWebhook(BOT_URL);
