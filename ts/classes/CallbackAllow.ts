import {MainCallbackQuery as Main} from './MainCallbackQuery';
import {DateConversion} from './static/DateConversion';

export class CallbackAllow extends Main {
    readonly type: string = 'yes';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)

        this.insertToBaseAllow()
    }

    /**
     * Подтверждение добавления в базу данных
     * очистка стейт-базы, добавление в основную базу
     */

     private insertToBaseAllow() : void {
        try {
            console.log(this.callback_array[1])
            this.state.findOneAndDelete({_id: this.ObjectId(this.callback_array[1])}).then((data: any) => {
                this.state.findOneAndDelete({id: this.callback_array[1]});
                const invert: any = DateConversion.invertDate(data.value); // инвертируем дату 

                this.collection.updateOne(
                    {_id: this.ObjectId(this.callback_array[1])}, 
                    {$set: invert }, 
                    {upsert: true})
                        .then(() => {
                        this.sendMessage('Данные обновлены');
                        console.log('Карточка создана, сотрудник добавлен, стейт-база очищена')
                })
            })
            
        } catch(e) {
            console.log(`Class CallbackAllow: ${e}`)
        }
    }
}