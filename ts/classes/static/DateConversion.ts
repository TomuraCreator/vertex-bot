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
                } else {
                    // 1 <= day | month <= 12
                    if(element <= 12 && element >= 1) { 
                        return true 
                    } 
                }
                return false
                
            })
        if(mapValidate) return date;
        throw TypeError('Числа даты больше или меньше реальных чисел. ');
    } 


    /**
     * возвращает имя класса 
     */
    private static getName() {
        return this.name;
    }
}