import {Command} from './Command';
import {TextTransform as Text} from './static/TextTransform';
import {totalValidate} from './static/totalValidate';

/**
 * @class
 * Отклик на команду /add
 * Создаёт карточку сотрудника
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 * @extends Command
 */
export class Add extends Command {
    readonly type: string = 'add';
    private match: Array<string>;
    public constructor(bot: any, state: any, collection: any, chat:any) {
        super(bot, collection, state, chat)
        console.log(this.chat.text)
        this.match = this.getArray(this.chat.text).splice(1, 10);
        this.insertToState()
    }

    private requireFieldToAdd( match: Array<string> ) : boolean {
        const person_generate = Text.translateFieldstoEng(this.match);
        
        try { // Если дата и номер телефона невалидны 
            totalValidate(person_generate)
        } catch (e) {
            this.sendMessage(e.message);
            throw {
                name: e.name,
                message: e.message
            }
        }
        if(person_generate.surname 
            && person_generate.shift 
            && person_generate.position) {
          return true;
        } else {
          return false;
        }
    }

    private insertToState() : void {
        const error_created: any = require(process.env.PWD + '/doc_models/bot_answer.js')

        if( !this.requireFieldToAdd(this.match) ) {
            this.sendMessage(error_created.generate_persone_error_md, 'md');
            return
        }
        const empoyee: any = Text.translateFieldstoEng(this.match);
        console.log(empoyee)
        this.state.insertOne(empoyee).then((data: any) => {
            
            this.sendMessage(Text.translateFieldstoRus(empoyee), {
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
}
