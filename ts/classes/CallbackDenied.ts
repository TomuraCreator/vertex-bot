import {MainCallbackQuery as Main} from './MainCallbackQuery';

export class CallbackDenied extends Main {
    readonly type: string = 'no';

    public constructor(bot: any, state: any, collection: any, chat: any) {
        super(bot, state, collection, chat)
        console.log(this.callback_array)
        if(this.callback_array[0] === 'delete') {
            this.deletePersonFromBase()
        } else if(this.callback_array[0] === 'no') {
            this.clearStateBase();
        } else if(this.callback_array[0] === 'no-change') {
            this.clearStateBase();
            this.clearStatePerson();
        }
    }

    private clearStateBase() : void {
        try {
            this.state.findOneAndDelete({_id: this.ObjectId(this.callback_array[1])}).then((data: any) => {
                if(data.length === 0) {
                    this.sendMessage('**_Такого сотрудника не существует_**', 'md')
                    return
                }
                this.sendMessage('**_Операция отменена_**', 'md')
            })
        } catch(e) {
            console.log(e)
        }
    }

    private deletePersonFromBase() : void {
        try {
            this.collection.findOneAndDelete({_id: this.ObjectId(this.callback_array[1])}).then((data: any) => {
                if(data.length === 0) {
                    this.sendMessage('**_Такого сотрудника не существует_**', 'md')
                    return
                }
                this.sendMessage('**_Сотрудник удалён_**', 'md')
            })
        } catch(e) {
            console.log(e)
        }
    }

    private clearStatePerson() :void {
        console.log(this.callback_array[1])
        try {
            this.state.findOneAndDelete({id: this.callback_array[1]}).then( () => {
                this.sendMessage('_Данные сотрундинка очищены_', 'md')
            })
        } catch(e) {
            console.log(e)
        }
    }
}