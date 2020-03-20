import {MainCallbackQuery as Main} from './MainCallbackQuery';

export class CallbackAllow extends Main {
    readonly type: string = 'yes';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
    }

    /**
     * Подтверждение добавления в базу данных
     * очистка стейт-базы, добавление в основную базу
     */

     public insertToBaseAllow() : void {
        try{
            this.state.findOneAndDelete({_id: this.ObjectId(this.callback_array[1])}).then((data: any) => {
                this.collection.insertOne(data.value).then(() => {
                    this.sendMessage('Сотрудник успешно добавлен в базу данных');
                    console.log('Карточка создана, сотрудник добавлен, стейт-база очищена')
                })
            }) 
        } catch(e) {
            console.log(`Class CallbackAllow: ${e}`)
        }

    }
        
}