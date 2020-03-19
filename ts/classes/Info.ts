import { Command } from './Command'

export class Info extends Command {
    readonly type: string = '/info';
    constructor(bot: any, state: object, collection: object) {
        super(bot, collection, state)
    }
}
