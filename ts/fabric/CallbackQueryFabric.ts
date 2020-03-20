import {CallbackPerson as Person} from '../classes/CallbackPerson';


/**
 * Фабрика классов для обработки ответо инлайн клавиатуры
 */

export class CallbackQueryFabric{

    private arr_query: any = {
        'person': (bot: any, collection: any, state: any, chat:any) => {
            return new Person(bot, collection, state, chat);
        }
    }

    constructor(protected bot: any, protected state: any, protected collection: any, protected chat: any) {

        this.bot = bot;
        this.collection = collection;
        this.state = state;
        this.chat = chat;

        const query: Array<string> = this.chat.data.split(',');

        return this.arr_query[query[0]](
            this.bot, 
            this.collection, 
            this.state,
            this.chat
            )
        
    }


}