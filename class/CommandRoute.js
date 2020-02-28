const TextTransform = require('./TextTransform');
const Commands = require('./Commands');
const BaseManipulate = require('./BaseManipulate');
const bot_answer = require('../doc_models/bot_answer');

/**
 * @class CommandRoute 
 * описывает перенаправление в зависимости от команд пользователя 
 * @param {object} bot_return объект от бота
 * @param {object} bot_object конструктор бота
 * @param {object} collection объект с коллекцией базы
 */

module.exports = class CommandRoute {
    constructor( bot_return, bot, collection ) {

        this.status = null;

        this.collection = collection;
        this.id = bot_return.chat.id;
        this.command_index = ['/add', '/remove', '/change', '/find', '/filter'];
       
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
            try{

                this.toFind(this.key_string, this.collection).forEach(elem => {
                    const pretty = TextTransform.translateFieldstoRus(elem, 'Вы искали:');
                    bot.sendMessage(this.id, pretty, {
                        parse_mode: 'Markdown'
                    });
                });
            } catch(e) {
                console.log(e);
            }
            
        } else if (this.command === this.command_index[0]) { // add
            try {
                this.generate_empoyee = this.toAdd(this.key_string, this.collection);
                if(!this.generate_empoyee) {
                    bot.sendMessage(this.id, bot_answer.generate_persone_error_md, {
                        parse_mode: 'Markdown'
                    })
                } else {
                    // bot.sendMessage(this.id, bot_answer.generate_persone_error_md, {
                    //     parse_mode: 'Markdown'
                    // })
                }
            } catch(e) {
                console.log(e);
            }
        } else {
            
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
    toAdd(key_string, collection) {
        
        return Commands.add( key_string, collection )
    }


}