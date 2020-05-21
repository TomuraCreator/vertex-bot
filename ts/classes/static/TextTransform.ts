import { DateConversion } from "./DateConversion";

/**
 * Класс для манипулирования текстом и переводом полей
 */

export class TextTransform {
    static type: string = "TextTransform"
    static keys = require(process.env.PWD + '/doc_models/translate_key');
    static person_pattern = require(process.env.PWD + '/doc_models/person');

    static available = ["child", "is_ill", "is_vacation", "auto"]; // имена свойств с вложением

    /**
     * Переводит поля объекта на русский и возвращает строку для вывода в чат 
     * 
     * @param {object} json // объект для раскодирования свойств на русский язык
     * @param {string}  substring // строка для вывода в чат после формирования строки
     * @return {string} 
     */
    static translateFieldstoRus( 
        json: any, 
        substring = 'Подтвердите правильность введённых данных' 
        ) : string {
        const keys_toEng: any = TextTransform.keys.to_eng; // шаблоны для перевода на русский по ключам на англ
        let str = `*${substring}* \n`;

				for(let value in json ) { // value поля карточки на англ
                if(keys_toEng[value]) { 
                    str += `_${keys_toEng[value]}_ : ${
                        (!TextTransform.available.includes(value)) ? json[value] : ''
                    } \n`
                    
					if(TextTransform.available.includes(value)) { // если поле состоит в списке полей имеющих вложения  
                        let substring_available = '';
                        for(let deep_value in json[value]) {
                            if(deep_value === 'available') continue;
                            substring_available += `_\t\t\t\t\t\t\t\t${
                                keys_toEng[deep_value]
                            }_ : ${json[value][deep_value]} \n`
                        }
                        str += substring_available;
                    }
                } else {
                    
                    if(json[value] === keys_toEng) {
                        str += `_${keys_toEng[value]}_ : ${
                            (typeof json[value] == "object"
                            || json[value] === null)
                                ? "нет" 
                                : json[value]
                        } \n`
                    }
                } 
            }
                
        return str;
    }

    /**
     * переводит данные запроса из телеграмм на русском в объект запроса к БД на английском
     * @static
     * @param {array} массив с запросом 
     * @return {object} возвращает объект запроса
     * @memberof TextTransform 
     */

    static getTranslateKey( key: any ) : any {
        // if (!key || key.length === 1) throw new Error(`Key is not defined`);
        const translate_obj = TextTransform.keys.to_rus; // объект с данными для перевода полей запроса
        const array_map = key.slice(1).map((element: any) => { // данные запроса переводит в вид [['', '', ''], ['', '']]
            return element.trim().split('-');                   // исключая элемент команды 
        })
        const paramDelimeter = array_map.find((element: Array<string>) => element[0].includes(':'))

        
        let result: any = {}
        array_map.forEach((element: any) => { // обходит многомерный массив запроса если есть вложение оборачивает в мап
                if(element[0] in translate_obj) {
                    let key = translate_obj[element[0]]
                    let propertyIn: string = translate_obj[element[1]]
                    
                    if(element.length === 3 && element[1] in translate_obj) {   // если есть вложенный объект

                        if(key in result) { // если свойство добавлено
                            let obj: any = {
                                available: true
                            }
                            obj[propertyIn] = element[2]
                            let copy = Object.assign(result[key], obj)
                            result[key] = copy
                        } else { // если свойства нет 
                            let obj: any = {
                                available: true
                            }
                            obj[propertyIn] = element[2]
                            result[key] = obj
                        }
                    } else { // если прямое присвоение в свойство
                        result[key] = element[1]
                    }
                }
            })
        if(paramDelimeter && !isNaN(Number(key[0]))) { // если есть строка-параметр делим её и добавляем свойство с 
            // данными для обработки 
            const valueParam = paramDelimeter[0].trim().split(':')
            result.params = [translate_obj[valueParam[0]], valueParam[1]];
        }
        return result
                
    }

    /**
     * переводит данные из базы на английском в информацию на 
     * и возвращает объект c параметрами запроса к базе 
     * @param matches 
     * @returns {Object} 
     * @memberof TextTransform
     */
    static translateFieldstoEng( matches: any) :any {
        if(!matches) throw Error('not matches')
        const configure_person = Object.assign({}, TextTransform.person_pattern);
        const rus = TextTransform.keys.to_rus;
        matches.forEach((substring: any) => {
            if(substring.indexOf("-") !== -1) {
                const arr_str = substring.trim().split('-');
                if(TextTransform.available.includes(rus[arr_str[0]])) {
                    configure_person[rus[arr_str[0]]][rus[arr_str[1]]] = arr_str[2];
                } else {
                    configure_person[rus[arr_str[0]]] = arr_str[1];
                }
            }
        })
        return configure_person;
    }

    /**
     *Заменяет поля в объекте "object" на поля в объекте "obj_fields"
     * для отправки изменений свойств объекта в БД после внесения пользователем
     * @param {*} object объект-карточка пользователя в котором планируется замена свойств
     * @param {*} obj_fields свойства для замены 
     * @return 
     */
    static getReplaseFields( object: any, obj_fields: any, param?: any ) : any {
        const available: Array<string> = TextTransform.available;

        if(object && obj_fields) {
            let replaces = Object.assign({}, object);
            if(param) {
                
                replaces[param[0]] = Object.assign(
                    object[param[0]],
                    obj_fields
                    )
            } else {
                for(let value in obj_fields) {
                    if(available.includes(value)) {
                        replaces[value] = Object.assign(replaces[value], obj_fields[value]) // 
                        continue
                    } else {
                        replaces[value] = obj_fields[value];
                    } 
                }
            }
            return replaces;
        } else {
            throw new Error(`Parameters is empty`)
        }
    }
}
