import { Command } from './Command'

export class Info extends Command {
    readonly type: string = 'info';
    public constructor(bot: any, state: any, collection: any, chat:any) {
        super(bot, collection, state, chat)

        this.getInfoObject();
    }

    /**
     * Формирует объект с количеством сотрудников на смене
     *  
     */
    private getInfoObject() : void {
        try {       
            this.collection.find().toArray((err: any, data: any)=> {
                if(data.lenght === 0) throw Error('Was returned empty array')

                const arrAvailable: Array<string> = ['auto', 'child', 'is_ill', 'is_vacation']
                let object: any = {
                    "мастер": [],
                    "аппаратчик": [],
                    "гранулировщик": [],
                    "онфл": [],
                    "обработчик": [],
                    "фасовщик": [],
                    "технолог": [],
                    "уборщик": [],
                    "обработчик/тары": []
                }
                data.forEach((value: any) => {
                    if(value.position in object) {
                        if(value[arrAvailable[0]].available || 
                            value[arrAvailable[1]].available ||
                            value[arrAvailable[2]].available ||
                            value[arrAvailable[3]].available) {
                            return
                        }
                        object[value.position].push(value);
                    }
                })
                let counter = 0
                for(let value in object) {
                    object[value] = object[value].length;
                    counter += object[value];
                }
                object["итого"] = counter;
                
                this.sendMessage(JSON.stringify(object, null, 2))               
            })
        } catch (err) {
            console.log(err) 
        }
    }
}
