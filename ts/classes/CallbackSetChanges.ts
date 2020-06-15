const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')
const person: any = require(process.env.PWD + '/doc_models/person.js')

import {TextTransform as Text} from './static/TextTransform';
import {MainCallbackQuery as Main} from './MainCallbackQuery';
import {totalValidate} from './static/totalValidate';
import {DateConversion} from './static/DateConversion'

/**
 * @class
 * Отклик на инлайн кнопку "изменить"
 * Меняет данные в базе на пользовательские по запросу
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 * @extends MainCallbackQuery
 */

export class CallbackSetChanges extends Main {
    readonly type: string = 'CallbackSetChanges';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
        const request = this.chat.text.split(' ')[0]
        if(this.checkMessNumberInState(request)) { 
            // проверяем есть ли в промежуточной базе такой идентификатор
            const ErrorMessage = `Карточки с номером ${request} не существует! или запрос числа не требуется.`
            this.sendMessage(ErrorMessage)    
            throw new Error(ErrorMessage)
        }
        this.setChanges();
    }


    private setChanges() : void {
        try {
            const array = this.chat.text.split(' ');
            const text_replace = Text.getTranslateKey(array);
            try {
                totalValidate(text_replace);
            } catch(e) {
                this.sendMessage(e.message);
                throw {
                    name: e.name,
                    message: e.message
                }
            }
            const number = array[0]
            this.state.findOne({message_id: Number(number)}).then( (result: any) => {
                this.collection.findOne({_id: this.ObjectId(result.id)})
                .then((data:any) => {
                    let replacees: any;
                    let translate: any;
                    DateConversion.invertDate(data) // инвертирование даты 
                    if(text_replace.params) {
                        if(text_replace.params[1] === 'очистить') {
                            let array_params: Array<string> = [text_replace.params[0], text_replace.params[1]]
                            
                            replacees = Text.getReplaseFields(data, person[text_replace.params[0]], array_params);
                            console.log('replace', text_replace)
                            translate = Text.translateFieldstoRus(replacees, '_Подтвердите изменение_')
                            console.log(replacees)
                        }
                    } else {
                        replacees = Text.getReplaseFields(data, text_replace);
                        translate = Text.translateFieldstoRus(replacees,
                        '_Подтвердите изменение_')
                    }
                    this.sendMessage(translate, {
                            parse_mode: `Markdown`,
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: "отменить",
                                            callback_data: String(['no-change', result.id])
                                        }
                                    ],
                                    [
                                        {
                                            text: "подтвердить",
                                            callback_data: String(['yes-change', result.id])
                                        }
                                    ]
                                ]
                            }
                        })
                    this.state.insertOne(replacees).then().catch((e:any) => console.log(e))
                    })
                })
            
        } catch (e) {
            console.log({
                'ErrorName': e.name,
                'ErrorMessage': e.message
            })
        }
        
    }
    private changePropertyOnDefault(key: string, num: number) {
        this.state({message_id: num}).then( (data: any) => {
            console.log(data)
        })
    }
    private async checkMessNumberInState( message_number: number ) {
        const check = await this.state.findOne({message_id: Number(message_number)});
        if(!check) {
            return false
        }
        return true

    }
}
