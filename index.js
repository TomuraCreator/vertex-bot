process.env.NTBA_FIX_319 = 1;

require('dotenv').config();

const CommandRoute = require('./class/CommandRoute');
const TelegramBot = require('node-telegram-bot-api');
const bot_answer = require('./doc_models/bot_answer')
const MongoClient = require("mongodb").MongoClient;
const fs = require('fs');

const path_json = './state/state.json';
const path_text = './state/rewrite.txt';


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
let state = null;
mongo.connect(function( err, client ) {
	const db = client.db('heroku_t8sdqpj3');
	const collection = db.collection('vertex2');
	console.log("MongoBD has connected...")

	bot.on('message', (arr) => {
		fs.writeFileSync(path_text, arr.text);
		const {id} = arr.chat;
		
		try {
			if(arr.entities) {
				state = new CommandRoute( arr, bot, collection );
			} else {
				console.log(state.state_employee);
				bot.sendMessage(id, bot_answer.command_error_md, {
					parse_mode: 'Markdown'
				})
			}
		} catch(e) {
			console.log(e)
		}
	})

	bot.on('callback_query', (query) => {
		const {id} = query.message.chat
		if(query.data === 'yes_add') {
			fs.readFile(path_json, "utf8", (error, data) => {
				if(data) {
					try {
						collection.insertOne(JSON.parse(data)).then(data => {
							fs.writeFile(path_json, '', (error) => {
								console.log('Remove successful')
							})
							
						});
						bot.sendMessage(id, 'Сотрудник 	успешно добавлен в базу данных');
						
					} catch(e) {
						console.log(e)
					}
					// console.log(JSON.parse(data))
				} else {
					bot.sendMessage(id, 'Карточка сотрудника была очищена. ВВедите запрос заново.');
				}
			})
			
		} else if(query.data === "no") {
			fs.writeFile(path_json, '', (error) => {
				bot.sendMessage(id, 'Карточка была успешно удалена')
			})
		} else if(query.data === "rewrite") {
			// fs.writeFile(path_json, '', (error) => {
			// 	bot.sendMessage(id, 'Прошу исправьте запись и отправьте снова')
			// 	fs.readFile(path_text, 'utf8', (error, data) => {
			// 		bot.editMessageText('rewrite', {
			// 			message_id: query.message.message_id,
			// 			chat_id: id
			// 		});
			// 		console.log(query)
			// 	})
				
			// })
		}	
		
	})

})
