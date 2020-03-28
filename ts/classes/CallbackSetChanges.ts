const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')
import {TextTransform as Text} from './static/TextTransform';

import {MainCallbackQuery as Main} from './MainCallbackQuery';
import { debuglog } from 'util';

export class CallbackSetChanges extends Main {
    readonly type: string = 'yes-change';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
        // console.log(this.chat)
        this.setChanges()
    }


    private setChanges() : void {
        try{
        const array = this.chat.text.split(' ');
        const text_replace = Text.getTranslateKey(array);
        const number = array[0]
        this.state.findOne({message_id: Number(number)}).then( (result: any) => {
            if(!result) {
                this.sendMessage(bot_answer.command_error_md, 'md')
                return
            } else {
                this.collection.findOne({_id: this.ObjectId(result.id)})
                .then((data:any) => {
                    const replacees = Text.getReplaseFields(data, text_replace);
                    const translate = Text.translateFieldstoRus(replacees,
                        '_Подтвердите изменение_')
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
            console.log(e)
        }
        
    }
}