import { Command } from './Command';
const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')

export class Start extends Command {
    readonly type: string = 'start';
    public constructor(bot: any, state: any, collection: any, chat:any) {
        super(bot, collection, state, chat)

        this.sendGreetingsMessage()
    }

    private sendGreetingsMessage() : void {
        this.sendMessage(bot_answer.starting_command_message_md, 'md');
    }
}