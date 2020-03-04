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
		const callback_array = query.data.split(',');
		
		if(callback_array[0] === 'yes') {
			try {
				state_collection.find({_id: ObjectId(callback_array[1])}).toArray((err, data) => {
					if(data.length === 0) {
						bot.sendMessage(id, '_Такого сотрудника не существует_',
								{
									parse_mode: 'Markdown'
								})
						return
					}
					collection.insertOne(data[0]).then(data => {
						bot.sendMessage(id, 'Сотрудник 	успешно добавлен в базу данных').then(()=> {
							state_collection.findOneAndDelete({_id: ObjectId(callback_array[1])}).then((data)=> {
								bot.sendMessage(id, '_Промежуточные данные очищены_',
								{
									parse_mode: 'Markdown'
								})
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
					bot.sendMessage(id, '_Промежуточные данные очищены_',
					{
						parse_mode: 'Markdown'
					})
				})
			} catch(e) {
				console.log(e)
			}
		} else if(callback_array[0] === "person") {
			try {
				collection.find({ _id: ObjectId(callback_array[1])}).toArray((err, result)=> {
					bot.sendMessage(id, TextTransform.translateFieldstoRus(result[0], ''), {
						parse_mode: 'Markdown'
					})
				})
			} catch(e) {
				console.log(e);
			}
			
		}
	})

})
