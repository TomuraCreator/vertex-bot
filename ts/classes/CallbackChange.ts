const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')
import {MainCallbackQuery as Main} from './MainCallbackQuery';

export class CallbackChange extends Main {
    readonly type: string = 'change';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)

        this.setChanges()
    }

    /**
     * Находит сотрудника в базе, создаёт изменённый документ в промежуточной базе, оповещает пользователя об изменениях
     */
    private setChanges() : void {
        try {
            const state_data = {
                id: this.callback_array[1],
                message_id: this.chat.message.message_id
            }	

            this.sendMessage(bot_answer.bot_answer_alert_change_md, 'md').then((data: any)=> { //объект с данными по изменяемой карточке 
                this.state.findOne({id: this.callback_array[1]}).then((result: any) => {
                    if(!result) {
                        console.log(data)
                        this.state.insertOne(state_data).then((data: any)=> {
                            this.sendMessage(bot_answer.bot_answer_alert_text_md
                                (data.ops[0].message_id), 'md');
                        })
                    } else {
                        state_data.message_id = data.message_id;
                        this.state.replaceOne({id: this.callback_array[1]}, state_data)
                        this.sendMessage(bot_answer.bot_answer_alert_text_md(data.message_id), 'md')
                    }
                })
            })
        } catch(e) {
            console.log(e);
        }
    }

    private allowChanges() : void {
        try {
            this.state.findOne({_id: this.ObjectId(this.callback_array[1])}).then((result: any)=> {
                if(!result) {
                    this.sendMessage("срок действия команды истёк");
                    return
                } // если во временной базе не найден сотрудник
                console.log(11, result)
                this.collection.findOneAndReplace({_id: this.ObjectId(this.callback_array[1])}, result).then((result: any) => {
                    if(result) {
                        this.state.findOneAndDelete({_id: this.ObjectId(this.callback_array[1])}, (err: string, result: any)=> {
                            this.state.findOneAndDelete({id: this.callback_array[1]})
                            this.sendMessage("Промежуточные данные очищены. Карточка сотрудника сохранена");
                            console.log(`Промежуточные данные очищены. 
                            Карточка сотрудника сохранена`)
                        })
                    } 
                })
            })

        } catch(e) {
            console.log(e)
        }
    }
}