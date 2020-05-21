import {MainCallbackQuery as Main} from './MainCallbackQuery';
import {TextTransform as Text} from './static/TextTransform';

/**
 * @class
 * При нажатии на кнопку инлайн клавиатуры показывает карточку сотрудника
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 * @extends MainCallbackQuery
 */

export class CallbackPerson extends Main {
    readonly type: string = 'person';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)

        this.getPreviewPerson()
    }

    private getPreviewPerson() : void {
        try {
            this.collection.find({ _id: this.ObjectId(
                    this.callback_array[1])})
                    .toArray((err: string, result: any) => {
                this.sendMessage(Text.translateFieldstoRus(result[0], ''),
                    {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "изменить",
                                    callback_data: String(['change', this.callback_array[1]]) 
                                }
                            ]
                        ]
                    }
                })
            })
        } catch(e) {
            console.log(e);
        }
    }

}