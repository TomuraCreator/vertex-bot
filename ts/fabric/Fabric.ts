import { Info } from '../classes/Info'
import { Help } from '../classes/Help'
import { Find } from '../classes/Find'
import { Add } from '../classes/Add'
import { Delete } from '../classes/Delete'
import { Change } from '../classes/Change'




export class Fabric {

    private arr_command: any = {
        '/info': (bot: any, collection: any, state: any, chat:any) => {
            return new Info(bot, collection, state, chat);
        },
        '/help': (bot: any, collection: any, state: any, chat: any) => {
            return new Help(bot, collection, state, chat);
        },
        '/find': (bot: any, collection: any, state: any, chat: any) => {
            return new Find(bot, collection, state, chat);
        },
        '/add': (bot: any, collection: any, state: any, chat: any) => {
            return new Add(bot, collection, state, chat);
        },
        '/remove': (bot: any, collection: any, state: any, chat: any) => {
            return new Delete(bot, collection, state, chat);
        },
        '/change': (bot: any, collection: any, state: any, chat: any) => {
            return new Change(bot, collection, state, chat);
        }
    }

    public constructor(private bot: any, private collection: any, private state: any, private chat: any) {
            const bot_command: any = new RegExp(/^\/\w+/).exec(chat.text);
            this.bot = bot;
            this.collection = collection;
            this.state = state;
            this.chat = chat

            
            if(!this.arr_command[bot_command]) throw Error('Command not found//');

            return this.arr_command[bot_command](
                this.bot, 
                this.collection, 
                this.state,
                this.chat
                )
    }   
}