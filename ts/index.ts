import { Fabric } from './fabric/Fabric'
import {DateSchedule as Schedule} from './schedule/Schedule'
import {CallbackQueryFabric as Callback} from './fabric/CallbackQueryFabric'; 

require('dotenv').config();
require('../config/express')

const TelegramBot = require('node-telegram-bot-api');

const ObjectId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const fs = require('fs');

type env = string | undefined;

const TOKEN:env = process.env.TOKEN;
const MONGODB_URI: env = process.env.MONGODB_URI;
const NAME: env = process.env.NAME;

const mongo = new MongoClient(MONGODB_URI, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

const bot = new TelegramBot(TOKEN, {
	polling:{
		autoStart: true,
	} 
})

mongo.connect(function( err: string, client: any ) {
    if(err) throw Error(`Something went wrong: ${err}`);

    const db: any = client.db(NAME);
    
	const collection: any =  db.collection('vertex2');//основная коллекция
    const state_collection: any = db.collection('state') // коллекция для промежуточных данных
    
    console.log("MongoBD has connected...");

    const schedule = new Schedule(collection, bot);
    schedule.sheduleDateOfBirth([
        {minute: 1, second: 1, hour: 8},
        {minute: 1, second: 1, hour: 20}
    ])
    bot.onText(/^(\d+)/g, (match: any, msg: any) => { // обработчик изменения карточки 
        try{
            const callback: any  = new Callback(bot, collection, state_collection, match)
            return
        } catch(e) {
            console.log(e)
        }
    })
    bot.on('message', (params: any) => {
        
        if(!params.entities) return
        try {
            new Fabric(bot, collection, state_collection, params);
        } catch(e) {
            console.log(e)
        }  
    })

    bot.on('callback_query', (match: any ) => {
        try {
            const callback: any  = new Callback(bot, collection, state_collection, match)
        } catch(e) {
            console.log(e)
        }  
    })    
})