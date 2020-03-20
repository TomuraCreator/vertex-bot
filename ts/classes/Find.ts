import {Command} from './Command';
import {TextTransform as Text} from './static/TextTrasform';


export class Find extends Command {
    readonly type: string = 'find'

    public constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat)
    }

    private getFindList() : any {
        return this.collection.find(this.match_list)
    }

    public sendPersonList() : void {
        this.getFindList().toArray((err: string, elem: any) => {
            this.sendMessage('**Список сотрудников**', this.parseRequestforFind(elem));
        })
    }
}