process.env.NTBA_FIX_319 = 1;

require('dotenv').config();
const Commands = require('./class/Commands');
const TextTransfom = require('./class/TextTransform')
const CommandRoute = require('./class/CommandRoute');
const TelegramBot = require('node-telegram-bot-api');
const bot_answer = require('./doc_models/bot_answer')
const MongoClient = require("mongodb").MongoClient;
const TOKEN = process.env.BOT_TOKEN;


const mongo = new MongoClient(process.env.DB_URL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

const bot = new TelegramBot(TOKEN, {
	polling:{
		autoStart: true,
	} 
})

mongo.connect(function( err, client ) {
	const db = client.db('heroku_t8sdqpj3');
	const collection = db.collection('vertex2');
	console.log("MongoBD has connected...")

	bot.on('message', (arr) => {
		const {id} = arr.chat;
		try {
			if(arr.entities) {
				new CommandRoute( arr, bot, collection );
			} else { 
				bot.sendMessage(id, bot_answer.command_error_md, {
					parse_mode: 'Markdown'
				})
			}
		} catch(e) {
			console.log(e)
		}
	})

})

function makePerson( 
	surname, 
	shift,
	position,
	first_name = null, 
	second_name = null,
	category = null, 
	age = null,
	gender = 'мужской',
	phone_number = null 
	) {
		if(surname && shift && position) {
			return {
				"first_name" : first_name,
				"second_name": second_name,
				"surname": surname,
				"age": age,
				"date_of_birth": null,
				"gender": gender,
				"position": position,
				"shift": shift,
				"category": category,
				"owns_equipment": null,
				"phone_number": phone_number,
				"auto": {
					"available": Boolean(false),
					"model": null,
					"state_car_number": null
				},
				"child": {
					"available": Boolean(false),
					"child_name": null
				},
				"is_ill": {
					"available": Boolean(false),
					"date_ill_start": null,
					"date_ill_end": null
				},
				"is_vacation": {
					"available": Boolean(false),
					"days_vacation": null,
					"date_of_vacation": null
				} 
			}
		} else {
			return false;
		}
}


