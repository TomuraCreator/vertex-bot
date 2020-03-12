/**
 * Класс планировщика 
 */
const shedule = require('node-schedule');
const bot_answer = require('../doc_models/bot_answer')
module.exports = class DateShedule {
     /**
      * Конструктор класса планирования, принимает на вход объект коллекции монго и объект бота
      * @param {Object} data_collection 
      * @param {Object} bot_object 
      */
    constructor(data_collection, bot_object) {
        this.collection = data_collection;
        this.bot = bot_object;
        if(!this.collection && !this.bot) throw Error('collection or bot object undefined');

        
        
    }

    /**
     * Задаёт планировщик на соответствие дня рождения
     * @param {Object} param_obj
     */
    sheduleDateOfBirth( param_obj ) {
        if(!param_obj) throw Error('Params not found');

        shedule.scheduleJob(param_obj, (data) => {
            const date = new Date();
            const reg = new RegExp(`^${date.getMonth()+1}\/${date.getDate()}`)

            this.collection.find({date_of_birth: reg}).toArray((err, data) => {
                if(!data[0]) {
                    console.log(`No one was born today`);
                    return
                }
                
                this.bot.sendMessage(397416881, bot_answer.bot_answer_birth_md(data[0]))
            })
        })   
    }
 }