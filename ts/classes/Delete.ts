import {Command} from './Command';
import {TextTransform as Text} from './static/TextTransform';

/**
 * @class
 * Отклик на команду /delete.
 * Производит удаление из базы по данным от пользователя 
 * @extends Command
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 */

export class Delete extends Command {
    readonly type: string = 'delete'

    public constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat)

        this.findPersonSendMessage();
    }

    /**
     * Находит сотрудника в базе и выводит сообщение подтверждения удаления
     * @return {void}
     */

    private findPersonSendMessage() : void {
        try {

            this.collection.find(this.match_list).toArray((err: string, result: any) => { 
               
                const translate_card = Text.translateFieldstoRus(result[0], "Удаление сотрудника"); 
                    
                this.sendMessage(translate_card, {
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
    }
}