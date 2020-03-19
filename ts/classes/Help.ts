import { Command } from './Command';

export class Help extends Command {
    readonly type: string = '/help';
    constructor(bot: any, state: object, collection: object) {
        super(bot, collection, state)
    }

}