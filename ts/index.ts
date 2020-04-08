import { Fabric } from './fabric/Fabric'
import {DateSchedule as Schedule} from './schedule/Schedule'
import {CallbackQueryFabric as Callback} from './fabric/CallbackQueryFabric'; 
import { match } from 'assert';

require('dotenv').config();

// const CommandRoute = require('./class/CommandRoute');
const TelegramBot = require('node-telegram-bot-api');
// const bot_answer = require('./doc_models/bot_answer');
// const TextTransform = require('./class/TextTransform');

const express = require('../config/express')
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
            const command: any = new Fabric(bot, collection, state_collection, params);
            return
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