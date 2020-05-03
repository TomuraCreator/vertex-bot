const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')
const person: any = require(process.env.PWD + '/doc_models/person.js')

import {TextTransform as Text} from './static/TextTransform';

import {MainCallbackQuery as Main} from './MainCallbackQuery';

export class CallbackSetChanges extends Main {
    readonly type: string = 'CallbackSetChanges';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
        this.setChanges()
    }


    private setChanges() : void {
        try {
            const array = this.chat.text.split(' ');
            const text_replace = Text.getTranslateKey(array);
            const number = array[0]
            this.state.findOne({message_id: Number(number)}).then( (result: any) => {
                if(!result) {
                    this.sendMessage(bot_answer.command_error_md, 'md')
                    throw new Error(`Parameter result is empty`)
                } else {
                    this.collection.findOne({_id: this.ObjectId(result.id)})
                    .then((data:any) => {
                        let replacees: any;
                        let translate: any;
                        
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
                    }
                })
            
        } catch (e) {
            console.log({
                'ErrorName': e.name,
                'ErrorDirection':  this.type,
                'ErrorMessage': e.message
            })
        }
        
    }
    private changePropertyOnDefault(key: string, num: number) {
        this.state({message_id: num}).then( (data: any) => {
            console.log(data)
        })
    }
}
