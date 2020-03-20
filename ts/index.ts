import { Fabric } from './fabric/Fabric'
import {DateSchedule as Schedule} from './schedule/Schedule'
import {CallbackQueryFabric as Callback} from './fabric/CallbackQueryFabric'; 

require('dotenv').config();

// const CommandRoute = require('./class/CommandRoute');
const TelegramBot = require('node-telegram-bot-api');
// const bot_answer = require('./doc_models/bot_answer');
// const TextTransform = require('./class/TextTransform');

const express = require('../config/express')
const ObjectId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const fs = require('fs');

// const path_text: string = './state/rewrite.txt';

const Markdown: object = {
	parse_mode: 'Markdown'
} // parser for a bot message out 

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
        {minute: 0, second: 0, hour: 8},
        {minute: 0, second: 0, hour: 20}
    ])

    bot.on('message', (params: any) => {
        
        if(!params.entities) return

        const command: any = new Fabric(bot, collection, state_collection, params);
        const getType: string = command.getType();

        if(getType === 'info') {
            command.getInfoObject()
        } else if(getType === 'help' ) {
            command.readHelpMessage()
        } else if(getType === 'find' ) {
            command.sendPersonList();
        } else if(getType === 'add' ) {
            command.insertToState();
        }
        
    })

    bot.on('callback_query', (match: any ) => {
        const callback: any  = new Callback(bot, collection, state_collection, match)
        const type: string = callback.getType();
        if(type === 'person') {
            callback.getPreviewPerson()
        } else if(type === 'change') {
            

        } else if(type === 'yes') {
            callback.insertToBaseAllow();
        }
        else if(type === 'no') {
            console.log(match)
        }
        
    })
})