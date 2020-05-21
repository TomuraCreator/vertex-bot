/**
 * проверяет валидность номера телефона 
 * через регулярное выражение 
 * @param {String} номер телефона 
 * поддерживаемые форматы +7хххххххххх ; 8хххххххххх
 * @returns string
 */
export function phoneValid( value: string ) : string {
    const regexp: any = new RegExp(/^((8|\+7|7))(\(?\d{3}\)?[\d]?)?[\d]{10}$/);
    if(!regexp.test(value)) {
        throw new TypeError('Номер телефона введён некорректно. Возможные варианты записи: \n+79991112233\n79991112233\n89991112233\n')
    }
    return value;
}