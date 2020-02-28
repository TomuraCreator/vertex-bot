module.exports = class TextTransform {

    static keys = require('../doc_models/translate_key');



    /**
     * 
     * @param {string} string_matches строка с командами 
     * @return {array} 
     */
    static getArray( string_matches ) {
        if (string_matches) {
            if(typeof string_matches !== 'string') {
                return false
            }
            return string_matches.split(' ');
        }
    }
    /**
     * Переводит поля объекта на русский
     * @param {object} json
     * @param {string}  substring
     * @return {string} 
     */
    static translateFieldstoRus( 
        json, 
        substring = 'Подтвердите правильность введённых данных' 
        ) {
        
        let str = `*${substring}* \n`

        if(substring === 'Вы искали:') {
            for(let value in json ) {
                if(TextTransform.keys.to_eng[value]) {
                    str += `_${TextTransform.keys.to_eng[value]}_ : ${json[value]} \n`
                } else {
                    if(json[value] === TextTransform.keys.to_eng) {
                        str += `_${TextTransform.keys.to_eng[value]}_ : ${
                            (json[value] === null || json[value].available === false)
                                ? "нет" 
                                : json[value]
                        } \n`
                        if(json[value] in available) {
                            let substring_available = '';
                            for(let deep_value in json[value]) {
                                substring_available += `_${TextTransform.keys.to_eng[json[value][deep_value]]}_ : ${json[value][deep_value]} \n`
                            }
                            str += substring_available;
                        }
                    }
                } 
            }     
        return str;
        }
    }

    /**
     * переводит запрос на русском в запрос на английском
     * и возвращает объект c параметрами запроса к базе
     * @static
     * @param {string || array} строка из телеграма 
     * @return {object} параметры запроса
     * @memberof TextTransform
     */
    static getTranslateKey( key ) {
        if (!key) return false;
        if (typeof key === 'string' ) { // если строка преобразовать в массив 
            key = key.split(" ");
        }
        const replace_obj = {};
        
        key.forEach((substring) => {
            if(substring.indexOf("-") !== -1) {
                const arr_str = substring.trim().split('-');
                if(arr_str[0] in TextTransform.keys.to_rus) {
                    replace_obj[TextTransform.keys.to_rus[arr_str[0]]] = arr_str[1];
                }   
            }
        })

        return replace_obj
    }
}