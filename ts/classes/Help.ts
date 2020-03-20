import { Command } from './Command';

export class Help extends Command {
    readonly type: string = 'help';

    constructor(bot: any, state: object, collection: object, chat: any) {
        super(bot, collection, state, chat)
    }

    readHelpMessage() : void {
        const answer = require('../../doc_models/bot_answer.js');
        this.sendMessage(answer.command_help_md, 'md')
    }
}