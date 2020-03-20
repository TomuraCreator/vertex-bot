import {Command} from './Command';
import {TextTransform as Text} from './static/TextTrasform';


export class Find extends Command {
    readonly type: string = 'find'

    public constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat)
    }

    private getFindList() : any {
        const match: string[] = this.getArray( this.chat.text);
        return this.collection.find(Text.getTranslateKey( match ))
    }

    public sendPersonList() : void {
        this.getFindList().toArray((err: string, elem: any) => {
            this.sendMessage('**Список сотрудников**', this.parseRequestforFind(elem));
        })
    }
}