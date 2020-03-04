process.env.NTBA_FIX_319 = 1;

require('dotenv').config();

const CommandRoute = require('./class/CommandRoute');
const TelegramBot = require('node-telegram-bot-api');
const bot_answer = require('./doc_models/bot_answer');
const TextTransform = require('./class/TextTransform');
const express = require('express');
const app = express();
const ObjectId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const fs = require('fs');

const path_text = './state/rewrite.txt';

const Markdown = {
	parse_mode: 'Markdown'
}

app.get('/', (request, response) => {
	response.send(`Server alive`);
})

const server_port = process.env.PORT || 80;
const server_host = process.env.HOST;

app.listen(server_port, server_host, (err) => {
	if(err) {
		return console.log(`something wrong`, err)
	}
	console.log(`Server is listening port on ${server_port}`)
})

const TOKEN = process.env.TOKEN;

const mongo = new MongoClient(process.env.MONGODB_URI, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

const bot = new TelegramBot(TOKEN, {
	polling:{
		autoStart: true,
	} 
})

mongo.connect(function( err, client ) {
	if(err) throw Error(`Something went wrong: ${err}`)
	const db = client.db('heroku_t8sdqpj3');
	const collection = db.collection('vertex2'); //основная коллекция
	const state_collection = db.collection('state'); // коллекция для промежуточных данных
	console.log("MongoBD has connected...")

	bot.on('message', (arr) => {
		fs.writeFileSync(path_text, arr.text);
		const {id} = arr.chat;
		
		try { // если команда, запускаем распознавание команд
			if(arr.entities) {
				new CommandRoute( arr, bot, collection, state_collection );
			} else {
				const text_replace = TextTransform.getTranslateKey(TextTransform.getArray(arr.text))
				const number = TextTransform.getArray(arr.text)[0]

				state_collection.findOne({message_id: Number(number)}).then( data => {
					
					if(!data) {
						bot.sendMessage(id, bot_answer.command_error_md,Markdown)
						return
					} else {
						// collection.findOne({_id: ObjectId(data.id)})
						// .then(data => {
						// 	const replacees = TextTransform.getReplaseFields(data, text_replace);
						// 	const translate = TextTransform.translateFieldstoRus(replacees,
						// 		'_Подтвердите изменение_')

						// 	bot.sendMessage(id, translate, {
						// 			parse_mode: `Markdown`,
						// 			reply_markup: {
						// 				inline_keyboard: [
						// 					[
						// 						{
						// 							text: "отменить",
						// 							callback_data: String(['no-change', data.id])
						// 						}
						// 					],
						// 					[
						// 						{
						// 							text: "подтвердить",
						// 							callback_data: String(['yes-change', data.id])
						// 						}
						// 					]
						// 				]
						// 			}
						// 		}
						// 		)
						// 		.then(() => {
						// 			state_collection.insertOne(replacees).then().catch(e => console.log(e))
						// 		});
						// })
						console.log(String(['yes-change', data.id]))
					}
				})
			}
		} catch(e) {
			console.log(e)
		}
	})

	bot.on('callback_query', (query) => {
		const {id} = query.message.chat	
		const callback_array = query.data.split(',');
		
		if(callback_array[0] === 'yes') {
			try {
				state_collection.find({_id: ObjectId(callback_array[1])}).toArray((err, data) => {
					
					collection.insertOne(data[0]).then(data => {
						bot.sendMessage(id, 'Сотрудник 	успешно добавлен в базу данных').then(()=> {
							state_collection.findOneAndDelete({_id: ObjectId(callback_array[1])}).then((data)=> {
								bot.sendMessage(id, '_Промежуточные данные очищены_',
								Markdown)
							})
						});

					})
				})
			} catch(e) {
				console.log(e)
			}
		} else if(callback_array[0] === "no") {
			try {
				state_collection.findOneAndDelete({_id: ObjectId(callback_array[1])}).then(()=> {
					if(data.length === 0) {
						bot.sendMessage(id, '_Такого сотрудника не существует_', Markdown)
						return
					}
					bot.sendMessage(id, '_Промежуточные данные очищены_', Markdown)
				})
			} catch(e) {
				console.log(e)
			}
		} else if(callback_array[0] === "person") {
			try {
				collection.find({ _id: ObjectId(callback_array[1])}).toArray((err, result)=> {
					bot.sendMessage(id, TextTransform.translateFieldstoRus(result[0], ''), {
						parse_mode: 'Markdown',
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "изменить",
										callback_data: String(['change', callback_array[1]]) 
									}
								]
							]
						}
					})
				})
			} catch(e) {
				console.log(e);
			}
			
		} else if(callback_array[0] === "delete") {
			try {
				collection.findOneAndDelete({ _id: ObjectId(callback_array[1])}).then((result)=> {
					if(!result.value) {
						bot.sendMessage(id, "_Срок действия команды истёк_", Markdown)
						return
					}
					bot.sendMessage(id, "_Сотрудник удалён из базы данных_", Markdown)
				}).catch(err => console.log(`Deleting has been bad: ${err}`))
			} catch(e) {
				console.log(e);
			}
			
		} else if(callback_array[0] === "no-delete") {
			try {
				bot.sendMessage(id, "_Действие отменено_", Markdown)
			} catch(e) {
				console.log(e);
			}

		} else if(callback_array[0] === "change") {
			try {
				const state_data = {
					id: callback_array[1],
					message_id: query.message.message_id
				}	
				bot.sendMessage(id, bot_answer.bot_answer_alert_change_md, Markdown).then((data)=> { //объект с данными по изменяемой карточке 
					state_collection.findOne({id: callback_array[1]}).then((result) => {
						if(!result) {
							state_collection.insertOne(state_data).then((data)=> {
								bot.sendMessage(id, bot_answer.bot_answer_alert_text_md(data.ops[0].message_id), Markdown)
								// console.log(data)
							}).catch(e => {
								console.log(e)
							})
						} else {
							state_data.message_id = data.message_id;
							state_collection.replaceOne({id: callback_array[1]}, state_data)
							bot.sendMessage(id, bot_answer.bot_answer_alert_text_md(data.message_id), Markdown)
							// console.log(data.message_id)
						}
					})
				})
			} catch(e) {
				console.log(e);
			}
		} else if(callback_array[0] === "no-change") {
			try {
				// state_collection.findOneAndDelete({id: callback_array[1]}).then((result) => {
				// if(!result) {
				// 	bot.sendMessage(id, "Срок действия команды истёк");
				// 	return
				// } else {
				// 	state_collection.findOneAndDelete({_id: ObjectId(callback_array[1])}).then(()=> {
				// 		bot.sendMessage(id, "Изменение отменено. Промежуточные данные очищены.");
				// 	}).catch(e => console.log(e))
				// }
				// }).catch(e => {
				// 	console.log(e)
				// })
				console.log(query)
			} catch(e) {
				console.log(e)
			}
			
		} else if(callback_array[0] === "yes-change") {
			try {
				console.log()
				// state_collection.findOne({_id: ObjectId(callback_array[1])}).then((result)=> {
				// 	collection.findOneAndReplace({id: callback_array[1]}, result).then((result) => {
				// 		if(!result) {
				// 			state_collection.findOneAndDelete({_id: ObjectId(callback_array[1])}, (err, result)=> {
				// 				state_collection.findOneAndDelete({id: callback_array[1]})
				// 				console.log(`Промежуточные данные очищены. 
				// 				Карточка сотрудника сохранена`)
				// 			})
				// 		}
				// 	}).catch(e => {console.log(e)})

					
				// }).catch(e => console.log(e))
				console.log(query)
			} catch(e) {
				console.log(e)
			}	
				
				
		}
	})

})
