import { Info } from '../classes/Info'
import { Help } from '../classes/Help'

export class Fabric {

    private arr_command: any = {
        '/info': (bot: any, collection: object, state: object) => {
            return new Info(bot, collection, state);
        },
        '/help': (bot: any, collection: object, state: object) => {
            return new Help(bot, collection, state);
        },
    } 
    constructor(private command: string, private bot: any, 
        private collection: any, private state: any) {
            this.bot = bot;
            this.command = command;
            this.collection = collection;
            this.state = state;

            
            if(!this.arr_command[command]) throw Error('Command not found//');
            
            return this.arr_command[command](
                this.bot, 
                this.collection, 
                this.state
                )
    }

    
}