import {Command} from './Command';

/**
 * @class
 * Отклик на команду /find
 * выводит инлайн клавиатуру с найденными сотрудниками
 * @extends Command
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 */
export class Find extends Command {
    readonly type: string = 'find'

    public constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat)
        this.sendPersonList();
    }

    /**
     * Обращается к базе данных с параметрами от пользователя
     * @returns {Object}: any объект коллекции с результатами запроса
     */
    private getFindList() : any {
        return this.collection.find(this.match_list)
    }

    /**
     * Выводит клавиатуру инлайн списком в чат по результатам поиска
     * @returns {void}
     */
    private sendPersonList() : void {
        this.getFindList().toArray((err: string, elem: any) => {
            this.sendMessage('**Список сотрудников**', this.parseRequestforFind(elem));
        })
    }
}