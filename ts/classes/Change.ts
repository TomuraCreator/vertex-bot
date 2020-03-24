import {Command} from './Command';
import {TextTransform as Text} from './static/TextTrasform';

/**
 * Класс для обработки команды /change
 */
export class Change extends Command {
    readonly type: string = 'change'

    public constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat);

        this.getFindOneForChange();
    }

    /**
     * Найти в базе одного сотрудника и вывести в чат сообщение в виде карточки
     */
    private getFindOneForChange() : void {
        try {
            
            if(!this.match_list) {
                this.sendMessage(`Команда [ _${this.type}_ ] не может быть вызвана без параметров.
                - Пример: /change фамилия-Гогин`);
                return
            } 
            const query_for_base = Text.getTranslateKey( this.match_list );
            this.collection.findOne(query_for_base).then((data: any) => {
                const translate_key: any = this.parseRequestforFind(data);
                this.sendMessage('**По запросу был найден сотрудник**', translate_key);
            })
        } catch(e) {
            console.log(e)
        }
    }
}