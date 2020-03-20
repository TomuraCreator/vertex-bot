/**
 * Класс для манипулирования текстом и переводом полей
 */

export class TextTransform {

    static keys = require(process.env.PWD + '/doc_models/translate_key');
    static person_pattern = require(process.env.PWD + '/doc_models/person');
    
    static available = ["child", "is_ill", "is_vacation", "auto"];

    /**
     * Переводит поля объекта на русский
     * @param {object} json
     * @param {string}  substring
     * @return {string} 
     */
    static translateFieldstoRus( 
        json: any, 
        substring = 'Подтвердите правильность введённых данных' 
        ) : string {
        
        let str = `*${substring}* \n`;

            for(let value in json ) {
                if(TextTransform.keys.to_eng[value]) {
                    str += `_${TextTransform.keys.to_eng[value]}_ : ${(!TextTransform.available.includes(value)) ? json[value] : ''} \n`
                    
                    if(TextTransform.available.includes(value)) {
                        let substring_available = '';
                        for(let deep_value in json[value]) {
                            if(deep_value === 'available') continue;

                            substring_available += `_\t\t\t\t\t\t\t\t${
                                TextTransform.keys.
                                to_eng[deep_value]
                            }_ : ${json[value][deep_value]} \n`
                        }
                        str += substring_available;
                    }
                } else {
                    
                    if(json[value] === TextTransform.keys.to_eng) {
                        str += `_${TextTransform.keys.to_eng[value]}_ : ${
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
     * переводит запрос на русском в запрос на английском
     * и возвращает объект c параметрами запроса к базе
     * @static
     * @param {string || array} строка из телеграма 
     * @return {object} параметры запроса
     * @memberof TextTransform
     */
    static getTranslateKey( key: any ) : any {
        if (!key) return false;
        if (typeof key === 'string' ) { // если строка преобразовать в массив 
            key = key.split(" ");
        }
        const replace_obj: any = {};
        
        key.forEach((substring: any) => {
            if(substring.indexOf("-") !== -1) {
                const arr_str = substring.trim().split('-');
                if(arr_str[0] in TextTransform.keys.to_rus) {
                    replace_obj[TextTransform.keys.to_rus[arr_str[0]]] = arr_str[1];
                }   
            }
        })

        return replace_obj
    }


    static translateFieldstoEng( matches: any) :any{
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
     *Заменяет поля в объекте на "object" на поля в объекте "obj_fields"
     * @param {*} object 
     * @param {*} obj_fields 
     */
    static getReplaseFields( object: any, obj_fields: any ) {
        
        try {
            if(object && obj_fields) {
                let replaces = Object.assign({}, object);
                for(let value in obj_fields) {
                    replaces[value] = obj_fields[value];
                    
                }
                return replaces;
            } else {
                return false
            }
            
        } catch(e) {
            console.log(e)
        }
        
    }
}