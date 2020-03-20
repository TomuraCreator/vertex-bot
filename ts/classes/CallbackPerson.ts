import {TextTransform as Text} from './static/TextTrasform';

export class CallbackPerson{
    protected ObjectId: any = require("mongodb").ObjectID;
    readonly type: string = 'person';

    public constructor(private bot: any, private state: any, private collection: any, private chat: any) {
        this.bot = bot;
        this.collection = collection;
        this.state = state;
        this.chat = chat;
    }

    public getPreviewPerson() : void {
        try {
            const callback_array = this.chat.data.split(',');
            this.collection.find({ _id: this.ObjectId(callback_array[1])}).toArray((err: string, result: any)=> {
                this.bot.sendMessage(this.chat.message.chat.id,
                    Text.translateFieldstoRus(result[0], ''),
                    {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "изменить",
                                    callback_data: String(['change', callback_array[1]]) 
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

    /**
     * Возвращает тип объекта
     */
    public getType() : string {
        return this.type;
    }
}