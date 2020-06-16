import { Command } from './Command'

/**
 * @class
 * Отклик на команду /info.
 * Подсчитывает и выводит количество сотрудников в виде списка кнопок
 * @extends Command
 * @constructor bot: any - объект бота, state: any - объект временной коллекции, 
 * collection: any - объект основной коллекции, chat: any - объект текущего чата
 */

export class Info extends Command {
    readonly type: string = 'info';
    public constructor(bot: any, state: any, collection: any, chat:any) {
        super(bot, collection, state, chat)

        this.getInfoObject();
    }

    /**
     * Формирует объект с количеством сотрудников на смене
     * отправляет инлайн-клавиатуру в чат с количеством сотрудников 
     *  
     */
    private getInfoObject() : void {
        try {
            /**
             * создание объект текущей даты. Поиск в базе объекта графика по текущей дате
             * 
             */
            const dates: any = new Date();
            const dateString: string = `${dates.getFullYear()}-${dates.getMonth()}-${dates.getDate()}`
            let hour: number = 23
            if(dates.getHours() > 8 && dates.getHours() < 20) {
                hour = 8
            }

            this.state.findOne({fullYear: dateString, timeHour: hour})
            .then((data: any, err: any) => { // забираем объект текущего графика смен.
                
                if(err) throw {
                    name: "Error mongo",
                    message: "В базе данных нет объекта расписания с параметрами ",
                    data: {fullYear: dateString, timeHour: hour}
                }
                const {shift, date, month, year, dayOfTheWeek, isNight} = data;
                console.log( data )
                this.sendMessage(this.createMessageDate(data)); // мета сообщение с информацией по дню 
                this.collection.find().toArray((err: any, data: any)=> {
                    if(data.lenght === 0) throw Error('Was returned empty array')

                    let arrayPosition: Array<string> = [
                        "мастер", "аппаратчик", "гранулировщик", "онфл", "обработчик",
                        "фасовщик", "технолог", "уборщик", "обработчик/тары"
                    ];

                    this.collection.countDocuments({"shift": shift, "is_absent": "нет", workInTheNight: isNight})
                    .then( (data: any ) => { // всего присутствует 
                        this.collection.countDocuments({"shift": shift, "is_absent": "да"})
                        .then( (data_not: any ) => { // всего отсутствует
                            this.sendMessage(`Всего на смене = ${data}. Отсутствует = ${data_not}`)
                        })
                    }).then(
                        ()=> {
                            arrayPosition.forEach((element: string) => {
                                
                                this.collection.countDocuments({"position": String(element), "is_absent": "нет", "shift": shift,})
                                .then( (absent: any) =>  { // на смене 
                                    this.collection.countDocuments({"position": String(element), "is_absent": "да", "shift": shift,})
                                    .then( (not_absent: any) => { // отсутствуют
                                        const textOn: string = `На смене - ${absent}` 
                                        const textOff: string = `Отсутствует - ${not_absent}`; // построение строки клавиатуры 
                                        const markup_keyboard: any = {
                                            parse_mode: `Markdown`,
                                            reply_markup: {
                                                inline_keyboard: [
                                                    [
                                                            {
                                                                text: textOn,
                                                                callback_data: String(['position-show', element, 'нет'])
                                                            },
                                                            {
                                                                text: textOff,
                                                                callback_data: String(['position-show', element, 'да'])
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

            }).catch((e: any)=> {
                console.log(e)
            })
        } catch (err) {
            console.log(err) 
        }
    }

    private toUpper( word : string ) {
        if (!word) return word;

        return word[0].toUpperCase() + word.slice(1);
    }


    /**
     * формирует строку с информацией на основе объека даты из базы данных.
     * @param arrayParams 
     */
    private createMessageDate(arrayParams: any) : string {
        const {shift, date, month, year, dayOfTheWeek, isNight} = arrayParams; 
        let datestr: string = `${date}`;
        let monthstr: string = '';
        let weekstr: string = '';
        let workANightstr: string = isNight ? 'ночь' : 'день'
        
        if(date > 0 && date < 10) datestr = `0${date}`;

        switch (dayOfTheWeek) {
            case 0: weekstr = 'Воскресенье'; break;
            case 1: weekstr = 'Понедельник'; break; 
            case 2: weekstr = 'Вторник'; break;
            case 3: weekstr = 'Среда'; break;
            case 4: weekstr = 'Четверг'; break;
            case 5: weekstr = 'Пятница'; break;
            case 6: weekstr = 'Суббота'; break;
        }
        switch (month) {
            case 0: monthstr = 'Января'; break;
            case 1: monthstr = 'Февраля'; break;
            case 2: monthstr = 'Марта'; break;
            case 3: monthstr = 'Апреля'; break;
            case 4: monthstr = 'Мая'; break;
            case 5: monthstr = 'Июня'; break;
            case 6: monthstr = 'Июля'; break;
            case 7: monthstr = 'Августа'; break;
            case 8: monthstr = 'Сентября'; break;
            case 9: monthstr = 'Октября'; break;
            case 10: monthstr = 'Ноября'; break;
            case 11: monthstr = 'Декабря'; break;
        }
        return `Сегодня ${weekstr}, ${date} ${monthstr} ${year}
на работе смена №${shift} в ${workANightstr}`
    }

}
