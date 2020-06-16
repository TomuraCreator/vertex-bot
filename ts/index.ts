import { Fabric } from './fabric/Fabric'
import {DateSchedule as Schedule} from './schedule/Schedule'
import {CallbackQueryFabric as Callback} from './fabric/CallbackQueryFabric'; 

require('dotenv').config();
require('../config/express')

const TelegramBot = require('node-telegram-bot-api');

const MongoClient = require("mongodb").MongoClient;
const fs = require('fs');

const {TOKEN, MONGODB_URI, NAME, WEBHOOK, PORT, IAM_TOKEN, FOLDER_ID} = process.env;

const mongo = new MongoClient(MONGODB_URI, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: PORT
    } 
}) 

bot.setWebHook(`${WEBHOOK}/bot${TOKEN}`)
bot.getWebHookInfo();

mongo.connect(function( err: string, client: any ) {
    if(err) throw Error(`Something went wrong: ${err}`);

    const db: any = client.db(NAME);
    
	const collection: any =  db.collection('vertex2');//основная коллекция
    const state_collection: any = db.collection('state') // коллекция для промежуточных данных
    // const schedule_collection: any = db.collection('schedule_shift') // коллекция для промежуточных данных
    
    console.log("MongoBD has connected...");

    // collection.updateMany({}, {$set: {workInTheNight: true}}, {multi: true}) // обновление всех документов
    
    // const shift: any = require('./shift_schedule/sheduleGenerate') // генерация графика смен

    // const arraysShifts: any = shift(365, 2020);
    // arraysShifts.forEach((element: any, index: number, arr: any) => {
    //     for(let i = 0; i < element.length; i++) {
    //         state_collection.insertOne(element[i])
    //     }
    // });

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
            console.log({
                'ErrorName': e.name,
                'ErrorMessage': e.message
            })
        }
    })
    bot.on('message', (params: any) => {
        
        if(!params.entities) return
        try {
            new Fabric(bot, collection, state_collection, params);
        } catch(e) {
            console.log({
                'ErrorName': e.name,
                'ErrorMessage': e.message
            })
        }  
    })

    bot.on('callback_query', (match: any ) => {
        try {
            const callback: any  = new Callback(bot, collection, state_collection, match)
        } catch(e) {
            console.log({
                'ErrorName': e.name,
                'ErrorMessage': e.message
            })
        }  
    }) 
    
    
    const fs = require('fs');
    const path = require('path')

    const fetch = require('node-fetch');
    const api_key = IAM_TOKEN;

    const { URLSearchParams } = require('url');

    const params = new URLSearchParams();


    


    bot.on('voice', async (msg: any, match: any) => {
        const filePath: string = path.join(process.env.PWD, 'audioVoice')
        const file: any = await bot.downloadFile(msg.voice.file_id, filePath, {
            mime_type: 'audio/ogg'
        });
        params.append('topic', 'general');
        params.append('folderId', FOLDER_ID)
        // params.append('profanityFilter', true);
        params.append('lang', 'ru-RU');
        // params.append('file', file)
        params.append('format', 'oggopus')

        try {
            const ftp = await fetch('https://stt.api.cloud.yandex.net/speech/v1/stt:recognize', {
                method: 'POST',        
                body: params,
                headers: {
                    'Authorization': `Bearer ${IAM_TOKEN}`,
                },
            })
            console.log(ftp);
        } catch(e) {
            console.log(e);
        }
    })
})
/*
// const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
// const { IamAuthenticator } = require('ibm-watson/auth');

// const speechToText = new SpeechToTextV1({
//     authenticator: new IamAuthenticator({
//       apikey: 'ha6gom_jxzAHgFgc3zUV_MGRhgAQFEnK5BgzIqCLYmIy',
//     }),
//     url: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/1cc158d3-a8fe-460d-ab56-0aef20bfac5b',
//   });
 // console.log(file)
        // let params = {
        //     objectMode: true,
        //     contentType: 'audio/ogg',
        //     model: 'en-US_BroadbandModel',
        //     keywords: ['colorado', 'tornado', 'tornadoes'],
        //     keywordsThreshold: 0.5,
        //     maxAlternatives: 3
        //   };
        // const recognizeStream = speechToText.recognizeUsingWebSocket(params);
        // fs.createReadStream(file).pipe(recognizeStream);
        // recognizeStream.on('data', function(event: any) { onEvent('Data:', event); });
        // recognizeStream.on('error', function(event: any) { onEvent('Error:', event); });
        // recognizeStream.on('close', function(event: any) { onEvent('Close:', event); });

        // // Display events on the console.
        // function onEvent(name: any, event: any) {
        //     console.log(name, JSON.stringify(event, null, 2));
        // };
        */