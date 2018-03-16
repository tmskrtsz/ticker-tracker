const helloText =`I'm TickerTracker bot and my only purpose is to give you alerts whenever a cryptocurrency of your choice reaches a set target.
Any cryptocurrency as long as it's on Binance that is 🌚.`;

const helpText = `Commands that you can use 💪
/help - It's this command, oh how meta.
/setpair - Set the cryptocurrency pair, for example, to get the price of Ethereum in Bitcoin, write ethereum, bitcoin.
/settarget - Set the target of a specific crypto pair to watch.
/getprice - Get the prices for all of the saved crypto pairs.`;

function getSuggestions(first_name) {
  const suggestions = [
    `I'm really useless when it comes to conversations, ${first_name}.`,
		`Me no habla inglés, señor 😶`,
		`All I know is how to get the latest crypto prices.`,
		`There's really no point in you trying to make me understand.`,
		`https://www.youtube.com/watch?v=wqzLoXjFT34`,
		`${first_name}, you really are persistent, aren't you?`,
		`Ask me about crypto`,
		`${first_name}, ask me to keep track of your crypto pairs by hitting /setpair`,
		`I can assure you that I am a useful bot`
  ]

  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

function getFirstName(ctx) {
  return ctx.update.message.from.first_name;
}

function getMessage(command, ctx) {
  let message = ctx.message.text
    .replace(`${command} `, '');

	if (message.includes('/')) {
		return message = undefined
	}

	return message;
}

function greet (ctx) {
  const name = ctx.message.from.first_name;
  return `👋 Hey ${name}`
}

module.exports = {
	helloText,
	helpText,
	getSuggestions,
	getFirstName,
	getMessage,
	greet
}
