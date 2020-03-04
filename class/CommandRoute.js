const TextTransform = require('./TextTransform');
const Commands = require('./Commands');
const bot_answer = require('../doc_models/bot_answer');
const fs = require('fs');

/**
 * @class CommandRoute 
 * описывает перенаправление в зависимости от команд пользователя 
 * @param {object} bot_return объект от бота
 * @param {object} bot_object конструктор бота
 * @param {object} collection объект с коллекцией базы
 */

module.exports = class CommandRoute {
    constructor( bot_return, bot, collection, state_collection ) {
        this.collection = collection;
        this.state_collection = state_collection;
        this.id = bot_return.chat.id;
        this.path_array = './state/find_state.js';
        this.command_index = ['/add', '/remove', '/change', '/find', '/filter', '/help', '/info'];
        
        this.command_string = bot_return.text;
        this.key_string = TextTransform.getArray(this.command_string).splice(1, 10);

        this.command = TextTransform.getArray(this.command_string)[0];
        if(!this.isValidateComand(this.command)) { //если не найдена
            bot.sendMessage(this.id, 
                bot_answer.command_not_available_md, {
                parse_mode: 'Markdown'
            })
            return
        }

        if( this.command === this.command_index[3] ) { // find
            try {
               
                this.toFind(this.key_string, this.collection).toArray((err, result) => {                  
                    bot.sendMessage(this.id, '_Список сотрудников_', this.parseRequestforFind(result));
                })             
                
            } catch(e) {
                console.log(e);
            }
            
        } else if (this.command === this.command_index[0]) { // add

            try {
                const empoyee = this.toAdd(this.key_string, this.collection);
                
                if(!empoyee) {
                    bot.sendMessage(this.id, bot_answer.generate_persone_error_md, {
                        parse_mode: 'Markdown'
                    })
                } else {
                    const translate_employee = TextTransform.translateFieldstoRus(empoyee); 
                    this.state_collection.insertOne(empoyee).then((data) => {
                        console.log(data.insertedId)
                        
                        bot.sendMessage(this.id, translate_employee, {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: "отменить",
                                            callback_data: String(['no', data.insertedId])
                                        }
                                    ],
                                    [
                                        {
                                            text: "подтвердить",
                                            callback_data: String(['yes', data.insertedId])
                                        }
                                    ],
                                    [
                                        {
                                            text: "изменить",
                                            callback_data: String(['change', data.insertedId]) 
                                        }
                                    ]
                                ]
                            }
                        })
                    })                
                }
            } catch(e) {
                console.log(e);
            }

        } else if (this.command === this.command_index[1]) { // remove
            try {
                this.toFind(this.key_string, this.collection).toArray((err, result) => { 
                    if(!this.key_string) throw Error("Всё очень плохо")                 
                    const translate_employee = TextTransform.translateFieldstoRus(result[0], "Удаление сотрудника"); 

                    console.log(result[0])
                        
                    bot.sendMessage(this.id, translate_employee, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "отменить",
                                        callback_data: String(['no-delete', null])
                                    }
                                ],
                                [
                                    {
                                        text: "подтвердить",
                                        callback_data: String(['delete', result[0]._id])
                                    }
                                ],
                            ]
                        }
                    })
                }) 
            } catch(e) {
                console.log(e);
            }
             
        } else if (this.command === this.command_index[5]) { // help
            bot.sendMessage(this.id, bot_answer.command_help_md, {
                parse_mode: 'Markdown'
            });

        } else if(this.command === this.command_index[2]) { //change
            try {
               
                this.toFindOne(this.key_string, this.collection).toArray((err, result) => {                  
                    bot.sendMessage(this.id, '_Список сотрудников_', this.parseRequestforFind(result));
                })             
                
            } catch(e) {
                console.log(e);
            }
        } else {
            bot.sendMessage(this.id, bot_answer.command_error_not_found_md, {
                parse_mode: 'Markdown'
            });
        }
    }

    isValidateComand( command ) {
        if(!command) return false 
        if(this.command_index.includes( command )) {
            return true
        } else {
            return false
        }
    }
    /**
     * Обращается к коллекции и возвращает 
     * первое совпадение с запросом 
     * @param {string} key_string 
     * @param {special mongo object} collection 
     */
    toFindOne(key_string, collection) {
        return Commands.findOne( key_string, collection )
    }

    /**
     * Обращается к методу связи с бд и возвращает 
     * ответ в обработанном виде
     * @param {string} key_string 
     * @param {special mongo object} collection 
     */
    toFind(key_string, collection) {
        return Commands.find( key_string, collection )
    }

    /**
     * Генерирует форму для сотрудника и создаёт новый 
     * документ в бд
     * @param {string} key_string 
     * @param {special mongo object} collection 
     */
    toAdd(key_string) {
        
        return Commands.add( key_string)
    }

    /**
     * парсит ответ от базы для формирования списка сотрудников 
     * для вывода в инлайн клавиатуру
     * @param {Array} array 
     */
    parseRequestforFind( array, parse = 'Markdown' ) {
        if(!array) return null;
        array.sort(( a, b )=> {
            if (a.surname < b.surname) return -1
            else if (a.surname > b.surname) return 1
            else return 0
        }) // сортировка по алфавиту
        let object = {
            parse_mode: parse,
            reply_markup: {
                inline_keyboard: []
            }
        } // макет объекта опций
        array.forEach((elem)=> {
            let str = `${elem.surname} ${elem.first_name} ${elem.second_name}`
            object.reply_markup.inline_keyboard.push([
                {
                    text: str,
                    callback_data: String(['person', elem._id])
                }
            ])
        })
        return object
    }

}