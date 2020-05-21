import { Command } from './Command';
const bot_answer: any = require(process.env.PWD + '/doc_models/bot_answer.js')

/**
 * @class
 * Отклик на команду /start.
 * Выводит приветственное сообщение в чат
 * @extends Command
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 */
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