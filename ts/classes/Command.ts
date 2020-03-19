
/**
 * Класс для описания наследования классов команд
 */
export class Command {

    /**
     * @param {Object} bot
     * @param {Object} state объект коллекции для промежуточных данных
     * @param {Object} collection объект коллекции для постоянных данных
     */
    protected type: string = 'Command'

    constructor(protected bot: any, protected state: object, protected collection: object) {
        if(!state && !collection) {
            throw Error('params is empty');
        }
        // this.TOKEN = process.env.TOKEN;
        this.bot = bot;
        this.collection = collection;
        this.state = state;
    }
    sendMessage(message: string, mode?: string) : void {
        if(mode === 'md') {
            this.bot.on('message', (chat: any)=> {
                this.bot.sendMessage(chat.chat.id, message, {
                    parse_mode: 'Markdown'
                });
            })
        } else {
            this.bot.on('message', (chat: any)=> {
                this.bot.sendMessage(chat.chat.id, message);
            })
        }
        
    }
    getType() : void {
        console.log(this.type);
    }

}