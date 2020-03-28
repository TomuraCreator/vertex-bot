import { Command } from './Command';

export class Help extends Command {
    readonly type: string = 'help';

    constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat)
        this.readHelpMessage()
    }

    /**
     * Выводит сообщение с текстом для помощи в чат 
     */
    private readHelpMessage() : void {
        const answer = require('../../doc_models/bot_answer.js');
        this.sendMessage(answer.command_help_md, 'md')
    }
}