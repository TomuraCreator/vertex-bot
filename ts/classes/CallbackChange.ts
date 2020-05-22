const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')
import {MainCallbackQuery as Main} from './MainCallbackQuery';
/**
 * Отклик на 
 */
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
}