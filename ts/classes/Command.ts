import {TextTransform as Text} from './static/TextTransform';
/**
 * Класс для описания наследования классов команд
 */
export class Command {

    /**
     * @param {Object} bot
     * @param {Object} state объект коллекции для промежуточных данных
     * @param {Object} collection объект коллекции для постоянных данных
     */
    protected type: string = 'command';
    protected match_list: any; // объект для отправки запроса 


    constructor(protected bot: any, protected state: any, protected collection: any, protected chat: any) {
        if(!state && !collection) {
            throw Error('params is empty');
        }

        this.bot = bot;
        this.collection = collection;
        this.state = state;
        this.chat = chat;

        this.match_list = Text.getTranslateKey(this.getArray( this.chat.text));
    }

    /**
     * 
     * @param message 
     * @param {String} mode Markdown (md)
     * @return void
     */
    public sendMessage(message: string, mode?: any) : void {
        if(mode === 'md') {
            this.bot.sendMessage(this.chat.chat.id, message, {
                parse_mode: 'Markdown'
            });
        } else {
            this.bot.sendMessage(this.chat.chat.id, message, mode);
        }
        
    }
    protected getType() : string {
        return this.type;
    }

    protected getArray( text: string ): Array<string> {
        return text.split(' ');
    }

    /**
     * парсит ответ от базы для формирования списка сотрудников 
     * для вывода в инлайн клавиатуру
     * @param {Array} array 
     */
    protected parseRequestforFind( array: any, parse = 'Markdown' ) : Array<any> {
        array.sort(( a: any, b:any )=> {
            if (a.surname < b.surname) return -1
            else if (a.surname > b.surname) return 1
            else return 0
        }) // сортировка по алфавиту
        let object: any = {
            parse_mode: parse,
            reply_markup: {
                inline_keyboard: []
            }
        } // макет объекта опций
        array.forEach((elem: any)=> {
            let str = `${elem.surname} ${elem.first_name} ${elem.second_name}`
            object.reply_markup.inline_keyboard.push([
                {
                    text: str,
                    callback_data: String(['person', elem._id])
                }
            ])
        })
        return object
    }


}