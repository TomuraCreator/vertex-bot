
export class MainCallbackQuery {
    protected ObjectId: any = require("mongodb").ObjectID;
    readonly type: string = 'main';
    protected callback_array: any;


    public constructor(protected bot: any, protected state: any, protected collection: any, protected chat: any) {
        this.bot = bot;
        this.collection = collection;
        this.state = state;
        this.chat = chat;

        this.callback_array = this.chat.data.split(','); // data ответа от инлайн-клавиатуры
    }

    /**
     * 
     * @param message 
     * @param {String} mode Markdown (md)
     * @return void
     */
    public sendMessage(message: string, mode?: any) : void {
        const {id} = this.chat.message.chat;
        if(mode === 'md') {
            this.bot.sendMessage(id, message, {
                parse_mode: 'Markdown'
            });
        } else {
            this.bot.sendMessage(id, message, mode);
        }
        
    }

    public getType() : string {
        return this.type;
    }
}