process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const TOKEN = "962110064:AAEdGpmra9QDcN3TTBn7jr8L5qZdWeHVZ54";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./connect_db')

let user = mongoose.model('vertex2', 
	new Schema({})
	);

const bot = new TelegramBot(TOKEN, {
	polling:{
		autoStart: true,
	} 
})

function delimeter() {
	console.log('----------------------------------------')
}


bot.onText(/\/help/, msg => {
	const chat_id = msg.chat.id;
	user.find({}).then(c => {		
		c.forEach((vla) => {
			console.log(vla['first_name'])
		})
		// bot.sendMessage(chat_id, c.toString())
		
	})
})

// bot.onText(/\/test (.+)/, (msg, arr) => {
// 	console.log(arr.collections)
// 	delimeter()
// })


