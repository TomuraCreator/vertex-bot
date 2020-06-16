interface dates {
    shift: number, // смена
    date: number, // день
    month: number, // месяц
    year: number, // день недели
    tmstp: number, // timestamp даты
    dayOfTheWeek: number, // день недели
    timeHour: number,
    fullYear: string,
    isNight: boolean
}

function daysInMonth(date: any): number {
    const now = date;
    return 32 - new Date(now.getFullYear(), now.getMonth(), 32).getDate();
}
function getMonthListArray(startYear: number, countMonth: number): Array<any> {
    if(!(countMonth > 0)) {
        throw 'число месяцев меньше нуля'
    }
    let years: number = startYear;
    const month: Array<any> = [];
    let counterMonth: number = 0;
    for( let i = 0; i < countMonth; i++) {
        let m: string = '0';

        if(i > 0 && i < 9) {
            m += `${counterMonth + 1}`;
        } else {
            m = `${counterMonth + 1}`
        }

        const date: any = new Date(`${years}-${m}-01`);

        if(counterMonth === 11) {
            counterMonth = 0;
        } else {
            counterMonth++
        }
        month.push({
            year: years,
            countMonth: daysInMonth(date),
            month: date.getMonth()
        })
        if(date.getMonth() === 11) {
            years++
        }
        
    }
    return month
}


function getDateString(index: number, chooseYear: number, indexMonth: number) : string { // преобразует строку для Date конструктора 
    let year: number | string = chooseYear,
        month: number | string = indexMonth + 1,
        day: number | string = index,
        time: string = '23:00:00';
    
    if(month > 0 && month < 10) {
        month = `0${month}`
    }
    if(Number.isInteger(index)) { // если целое 
        if(index > 0 && index < 10) {
            day = `0${index}`
        }
        time = '08:00:00'
    } else {
        if(index > 0 && index < 9) {
            day = `0${day + 0.5}`;
        } else {
            day = index + 0.5
        }
    }
    return `${year}-${month}-${day}T${time}`
}

function getArrayShift(endOfYear: number, year: number): Array<Array<Array<number>>> {
    const dayInMonth: Array<any> = getMonthListArray(year, 50); // генерация массива объектов с количеством дней в месяца. 50 кол-во месяцев
    const algorithm: Array<number> = [0, 1, 0, 1, 2, 3, 2, 3, 1, 0, 1, 0, 3, 2, 3, 2];
    const arrayOfShift: any = [[], [], [], []]
    let counAlg: number = 0; // счётчик индексов алгоритма
    let indexDaysInMonth: number = 0; // счётчик индексов кол-ва дней в месяце

    for (let i = 0.5; i < endOfYear; i = i + 0.5) {
        let date: any;

        if (counAlg === algorithm.length) { // начинает с нуля если алгоритм закончился
            counAlg = 0;
        };
        
        if (i >= dayInMonth[indexDaysInMonth].countMonth + 0.5) {

            i = 0.5;
            if (indexDaysInMonth < dayInMonth.length - 1) { // месяц ++ если меньше количества месяцев
                indexDaysInMonth++
            } else {
                break
            }
            
        }
        let dateStr: string = getDateString(
            i, 
            dayInMonth[indexDaysInMonth].year,
            dayInMonth[indexDaysInMonth].month
        ) // генерация строки даты

        date = new Date(dateStr);

        // console.log(date)
        const objectDate: dates = {
            shift: algorithm[counAlg] + 1, // смена
            date: date.getDate(), // день
            month: date.getMonth(), // месяц
            year: date.getFullYear(), // день недели
            tmstp: date.getTime(), // timestamp даты
            dayOfTheWeek: date.getDay(), // день недели
            timeHour: date.getHours(),
            fullYear: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            isNight: true
        };
        if(!(date.getHours() > 8)) {
            objectDate.isNight = false;
        }
        arrayOfShift[algorithm[counAlg]].push(objectDate);
        counAlg++;
    }

    return arrayOfShift;
}

module.exports = getArrayShift;