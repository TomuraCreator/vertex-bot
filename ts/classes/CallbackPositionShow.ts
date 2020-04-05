import {MainCallbackQuery as Main} from './MainCallbackQuery';


export class CallbackPositionShow extends Main {
    readonly type: string = 'position-show';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
        this.showPositionList();
    }

    private showPositionList() : void {
        this.getPositionList().toArray((err: string, element: any) => {
            this.sendMessage(`**${this.callback_array[1]}**`, this.parseRequestPosition(element));
        })
    }


    /**
     *  Возвращает объект поиска по должности 
     */
    private getPositionList() : any {
        return this.collection.find({position: this.callback_array[1]})
    }

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