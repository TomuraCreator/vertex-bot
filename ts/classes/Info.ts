import { Command } from './Command'

export class Info extends Command {
    readonly type: string = 'info';
    public constructor(bot: any, state: any, collection: any, chat:any) {
        super(bot, collection, state, chat)

        this.getInfoObject();
    }

    /**
     * Формирует объект с количеством сотрудников на смене
     * отправляет инлайн-клаввиатуру в чат с количеством сотрудников 
     *  
     */
    private getInfoObject() : void {
        try {       
            this.collection.find().toArray((err: any, data: any)=> {
                if(data.lenght === 0) throw Error('Was returned empty array')

                let arrayPosition: Array<string> = [
                    "мастер", "аппаратчик", "гранулировщик", "онфл", "обработчик", "фасовщик", "технолог", "уборщик", "обработчик/тары"
                ]

                this.collection.countDocuments({"shift": "2", "is_absent": false}).then( (data: any ) => { // всего присутствует 
                    this.collection.countDocuments({"shift": "2", "is_absent": true}).then( (data_not: any ) => { // всего отсутствует
                        this.sendMessage(`Всего на смене = ${data}. Отсутствует = ${data_not}`)
                    })
                }).then(
                    ()=> {
                        arrayPosition.forEach((element: string) => {

                            this.collection.countDocuments({"position": String(element), "is_absent": false}).then( (absent: any) =>  { // на смене 
                                this.collection.countDocuments({"position": String(element), "is_absent": true}).then( (not_absent: any) => { // отсутствуют
                                    const text: string = `на смене - ${absent}. Отсутствует -${not_absent}`; // построение строки клавиатуры 
                                    const markup_keyboard: any = {
                                        parse_mode: `Markdown`,
                                        reply_markup: {
                                            inline_keyboard: [
                                                [
                                                    {
                                                        text: text,
                                                        callback_data: String(['position-show', element])
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                    this.sendMessage(element, markup_keyboard);
                                })
                            }) 
                        });
                    }
                )          
            })
            
        } catch (err) {
            console.log(err) 
        }
    }

}
