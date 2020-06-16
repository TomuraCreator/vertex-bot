import {DateConversion} from './DateConversion';
import {phoneValid} from './phoneValid'

/**
 * вызывает функции валидации для сущности карточки сотрудника 
 * или объекта запроса   
 */

export function totalValidate( object: any ) : any {

    const phone: string = 'phone_number',
        isIll: Array<string> = ['date_ill_start', 'date_ill_end'],
        isVacation: string = 'date_of_vacation',
        dateOfBirth: string = 'date_of_birth';
        console.log(object)
    if(object.hasOwnProperty(phone) && Boolean(object[phone])) {
        phoneValid(object[phone]);
    } else if(object.hasOwnProperty("is_ill" ) &&
         (Boolean(object.is_ill[isIll[0]]) || object.is_ill[isIll[1]]) ) {
        if(object.is_ill[isIll[0]]) {
            DateConversion.validateDate(object.is_ill[isIll[0]])
        } else {
            DateConversion.validateDate(object.is_ill[isIll[1]])
        }
    } else if(object.hasOwnProperty("is_vacation") && Boolean(object.is_vacation[isVacation])) {
        DateConversion.validateDate(object.is_vacation[isVacation])
    } else if(object.hasOwnProperty(dateOfBirth) && Boolean(object[dateOfBirth])) {
        DateConversion.validateDate(object[dateOfBirth])
    }
}