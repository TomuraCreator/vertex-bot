/**
 * Класс планировщика 
 */

const shedule: any = require('node-schedule');

export class DateSchedule  {
    /**
     * Конструктор класса планирования, принимает на вход объект коллекции монго и объект бота
     * @param {Object} collection 
     * @param {Object} bot
     */


    public constructor(private collection: any, private bot: any) {

        if(!this.collection && !this.bot) throw Error('Collection or Bot object undefined');

        this.collection = collection;
        this.bot = bot;
    }

    /**
     * Задаёт планировщик на соответствие дня рождения
     * @param {Object | Array<object>} param_obj
     */
    public sheduleDateOfBirth( param_obj: any | Array<any> ) : void {
        if(!param_obj) throw Error('Params not found');

        if(Array.isArray(param_obj)) {
            param_obj.forEach(element => {
                this.installSchedule(element);
            });
        } else if(typeof param_obj === "object") {
            this.installSchedule(param_obj);
        }
    }


    /**
     * Устанавливает планировщик 
     * @param param_obj 
     */
    private installSchedule(param_obj: any | Array<any>) : void {
        const bot_answer: any = require('../../doc_models/bot_answer.js');

        shedule.scheduleJob(param_obj, (data: any) => {
            const date = new Date();
            const reg = new RegExp(`^${date.getMonth()+1}\/${date.getDate()}`)

            this.collection.find({date_of_birth: reg}).toArray((err: string, data: any) => {
                if(!data[0]) {
                    console.log(`No one was born today`);
                    return
                }
                
                this.bot.sendMessage(397416881, bot_answer.bot_answer_birth_md(data[0]))
            })
        })
    }
 }