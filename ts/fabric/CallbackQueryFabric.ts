import {CallbackPerson as Person} from '../classes/CallbackPerson';
import {CallbackAllow as Allow} from '../classes/CallbackAllow';
import {CallbackDenied as Denied} from '../classes/CallbackDenied';
import {CallbackChange as Change} from '../classes/CallbackChange';
import {CallbackSetChanges as SetChanges} from '../classes/CallbackSetChanges';
import {CallbackPositionShow as PositionShow} from '../classes/CallbackPositionShow';



/**
 * Фабрика классов для обработки ответо инлайн клавиатуры
 */

export class CallbackQueryFabric {

    private arr_query: any = {
        'person': (bot: any, collection: any, state: any, chat:any) => {
            return new Person(bot, collection, state, chat);
        },
        'change': (bot: any, collection: any, state: any, chat:any) => {
            return new Change(bot, collection, state, chat);
        },
        'no': (bot: any, collection: any, state: any, chat:any) => {
            return new Denied(bot, collection, state, chat);
        },
        'no-change': (bot: any, collection: any, state: any, chat:any) => {
            return new Denied(bot, collection, state, chat);
        },
        'yes': (bot: any, collection: any, state: any, chat:any) => {
            return new Allow(bot, collection, state, chat);
        },
        'yes-change': (bot: any, collection: any, state: any, chat:any) => {
            return new Allow(bot, collection, state, chat);
        },
        'delete': (bot: any, collection: any, state: any, chat:any) => {
            return new Denied(bot, collection, state, chat);
        },
        'set': (bot: any, collection: any, state: any, chat:any) => {
            return new SetChanges(bot, collection, state, chat);
        },
        'position-show': (bot: any, collection: any, state: any, chat:any) => {
            return new PositionShow(bot, collection, state, chat);
        }
    }
    constructor(protected bot: any, protected state: any, protected collection: any, protected chat: any) {

        this.bot = bot;
        this.collection = collection;
        
        this.state = state;
        this.chat = chat;
        if(this.chat.data) {
            const query: Array<string> = this.chat.data.split(',');
            return this.arr_query[query[0]](
                this.bot, 
                this.collection, 
                this.state,
                this.chat
                )
        } else {
            return this.arr_query['set'](
                this.bot, 
                this.collection, 
                this.state,
                this.chat
                )
        }
            
    }


}