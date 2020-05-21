/**
 * @class
 * суперкласс для наследования на отклик от инлайн клавиатуры
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата 
 */
export class MainCallbackQuery {
    protected ObjectId: any = require("mongodb").ObjectID;
    readonly type: string = 'main';
    protected callback_array: any;


    public constructor(protected bot: any, protected state: any, protected collection: any, protected chat: any) {
        this.bot = bot;
        this.collection = collection;
        this.state = state;
        this.chat = chat;

        if(!!this.chat.data) { // если сообщение не дата инлайн клавиатуры
            this.callback_array = this.chat.data.split(','); // data ответа от инлайн-клавиатуры
        }
    }

    /**
     * выводит сообщение в чат
     * @param message 
     * @param {String} mode Markdown (md)
     * @return void
     */
    protected sendMessage(message: string, mode?: any) : any {
        const id = (!!this.chat.message) ?  this.chat.message.chat.id :  this.chat.chat.id;

        if(mode === 'md') {
            return this.bot.sendMessage(id, message, {
                parse_mode: 'Markdown'
            });
        } else {
            return this.bot.sendMessage(id, message, mode);
        }
        
    }

    public getType() : string {
        return this.type;
    }
}