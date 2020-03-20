/**
 * Суперкласс для коллбэк ответов инлайн клавиатуры
 */

export class CallbackQueryFabric{

    constructor(protected bot: any, protected state: any, protected collection: any, protected chat: any) {

        this.bot = bot;
        this.collection = collection;
        this.state = state;
        this.chat = chat;
    }


}