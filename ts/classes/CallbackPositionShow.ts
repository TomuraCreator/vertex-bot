import {MainCallbackQuery as Main} from './MainCallbackQuery';

/**
 * @class
 * Отклик по нажатию на кнопку после результа вывода /info
 * При нажатии на кнопку инлайн клавиатуры показывает список подсчитанных сотрудников
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата 
 * @extends MainCallbackQuery
 */
export class CallbackPositionShow extends Main {
    readonly type: string = 'position-show';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
        this.showPositionList();
        console.log(this.type)
    }

    /**
     * Выводит список сотрудников в чат в виде инлайн клавиатуры
     */
    private showPositionList() : void {
        this.getPositionList().toArray((err: string, element: any) => {
            this.sendMessage(`**${this.callback_array[1]}**`, this.parseRequestPosition(element));
        })
    }

    /**
     *  Возвращает объект поиска по должности 
     */
    private getPositionList() : any {
        return this.collection.find({position: this.callback_array[1], is_absent: this.callback_array[2]})
    }

    /**
     * Формирует инлайн клавиатуру на основе данных из бд
     * @param {Array} array массив параметров
     * @param {String} parse тип форматирования
     */
    private parseRequestPosition( array: any, parse = 'Markdown' ) : any {
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