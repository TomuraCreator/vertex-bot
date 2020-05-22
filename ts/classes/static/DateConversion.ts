/**
 * @static
 *  преобразует дату из строки формата хх.хх.хххх 
 *  в timestamp и обратно
 * @method conversionToString переводит timestamp представление даты в строковое 
 * @method conversionToTimestamp переводит строковое представление даты в timestamp
 * @method validateDate валидирует дату
 */ 
export class DateConversion {
    private static type: string = DateConversion.getName(); 
    /**
     * @static
     * переводит timestamp представление даты в строковое 
     * формата хх.хх.хххх
     * @param {Number} t_stamp 
     * @returns {String}
     * @memberof DateConversion
     */
    public static conversionToString(t_stamp: number) : string {
        if(isNaN(Number(t_stamp))) throw TypeError('Invalid parameter data type');
        
        let dateObject: any = new Date(t_stamp);

        // Здесь и далее формирование строки даты. 
        // Если день и месяц менее 10 добавляем вначале 0

        let dateDay: any = dateObject.getDate(); // день
        let dateMonth: any = dateObject.getMonth() + 1; // месяц 
        let dateFullYear: any = dateObject.getFullYear(); // год
        dateDay = (dateDay < 10) ? 
            `0${dateDay}` : dateDay; 
        dateMonth = (dateMonth < 10) ? 
            `0${dateMonth}` : dateMonth; 

        return `${dateDay}.${dateMonth}.${dateFullYear}`;
    }

    /**
     * @static
     * переводит строковое представление даты в timestamp 
     * @param {String} date_string строка даты от пользователя 
     * @returns {Number} else 0
     * @memberof DateConversion
     */
    public static conversionToTimestamp( date_string: string) : number {
        if(!DateConversion.validateDate(date_string)) return 0
        
        let date: Array<string> = date_string.split('.');
        let to_parsing: string = `${date[1]}/${date[0]}/${date[2]}`;

        return Date.parse(to_parsing)
        
    }

    /**
     * @static
     * валидирует дату 
     * @param {String} date строка даты 
     * @returns {Boolean}
     * @memberof DateConversion
     */
    public static validateDate( date: string) : Boolean | any {
        const regexp = new RegExp(/^\d{2}.\d{2}.\d{4}/)
        if(!isNaN(Number(date))) throw TypeError(`Параметр даты имеет тип данных: ${typeof date}, ожидается string`);
        if(!regexp.test(date)) throw TypeError(`Параметр даты не соответствует формату дд.мм.гггг`);

        // валидация чисел строки даты от пользователя 
        let mapValidate: Boolean = date.split('.') // ['xx', 'xx', 'xxxx']
            .map((element: string)=> { // [xx, xx, xxxx]
                return Number(element)
            }).every((element: number, index: number) => {  
                // 1920 <= FullYear >= now() + 1
                if(index === 2) {
                    let year = new Date(Date.now()).getFullYear();
                    if(element >= 1920 && element <= year + 1) {
                        return true;
                    } 
                } else if( index === 1 ) {
                    // 1 <= month <= 12
                    if(element <= 12 && element >= 1) { 
                        return true 
                    } 
                } else if( index === 0 ) {
                    if(element <= 31 && element >= 1) { 
                        return true 
                    }
                }
                return false
            })
        if(mapValidate) return date;
        throw TypeError('Числа даты больше или меньше реальных чисел. ');
    } 

    /**
     * @static
     * Конвертирует значения даты в объекте карточки в timestamp и обратно 
     * @param {Object} j объект для конвертации значений 
     * @return {Object} 
     * @memberof DateConversion
     */

    public static invertDate( object: any) : any {
        const toTimeStamp: any = DateConversion.conversionToTimestamp; // to timestamp
        const toStringTime: any = DateConversion.conversionToString; // to string

        const isIll: Array<string> = ['date_ill_start', 'date_ill_end'],
            isVacation: string = 'date_of_vacation',
            dateOfBirth: string = 'date_of_birth';
        /**
         * TODO переписать как дойдут руки 
         */
        if(object["is_ill"][isIll[0]]) {
            if(isNaN(Number(object["is_ill"][isIll[0]]))) { // true = string
                object["is_ill"][isIll[0]] = toTimeStamp(object["is_ill"][isIll[0]])
            } else { // false = timestamp
                object["is_ill"][isIll[0]] = toStringTime(object["is_ill"][isIll[0]])
            }     
        } 
        if(object["is_ill"][isIll[1]]) {
            if(isNaN(Number(object["is_ill"][isIll[1]]))) { // true = string
                object["is_ill"][isIll[1]] = toTimeStamp(object["is_ill"][isIll[1]])
            } else { // false = timestamp
                object["is_ill"][isIll[1]] = toStringTime(object["is_ill"][isIll[1]])
            }
        } 
        if(object["is_vacation"][isVacation]) {
            if(isNaN(Number(object["is_vacation"][isVacation]))) { // true = string
                object["is_vacation"][isVacation] = toTimeStamp(object["is_vacation"][isVacation])
            } else { // false = timestamp
                object["is_vacation"][isVacation] = toStringTime(object["is_vacation"][isVacation])
            }
        } 
        if(object[dateOfBirth]) {
            if(isNaN(Number(object[dateOfBirth]))) { // true = string
                object[dateOfBirth] = toTimeStamp(object[dateOfBirth])
            } else { // false = timestamp
                object[dateOfBirth] = toStringTime(object[dateOfBirth])
            }
        }
        return object;
    }
    /**
     * возвращает имя класса 
     */
    private static getName() {
        return this.name;
    }
}