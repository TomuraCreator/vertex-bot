interface dates {
    shift: number, // смена
    date: number, // день
    month: number, // месяц
    year: number, // день недели
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
        const date: any = new Date(years, i, 1);

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
// console.log(getMonthListArray(2020, 15))

function getDateString(index: number, chooseYear: number, indexMonth: number) : any { // преобразует строку для Date конструктора 
    let year: number = chooseYear,
        month: number = indexMonth,
        day: number = index,
        time: number = 11;
    if(Number.isInteger(index)) { // если целое 
        time = 8
    }
    return new Date(year, month, day, time, 0, 0);
}

function getArrayShift(endOfYear: number, year: number, howMuchMonth: number): Array<Array<Array<number>>> {
    const dayInMonth: Array<any> = getMonthListArray(year, howMuchMonth); // генерация массива объектов с количеством дней в месяца. 50 кол-во месяцев
    const algorithm: Array<number> = [0, 1, 0, 1, 2, 3, 2, 3, 1, 0, 1, 0, 3, 2, 3, 2];
    const arrayOfShift: any = [[], [], [], []]
    let counAlg: number = 0; // счётчик индексов алгоритма
    let indexDaysInMonth: number = 0; // счётчик индексов кол-ва дней в месяце

    for (let i = 0.5; i < endOfYear; i = i + 0.5) {
        let date: any;


        if (counAlg === algorithm.length) { // начинает с нуля если алгоритм закончился
            counAlg = 0;
        }
        
        date = getDateString(
            i, 
            dayInMonth[indexDaysInMonth].year,
            dayInMonth[indexDaysInMonth].month
        ) // генерация строки даты

        const objectDate: dates = {
            shift: algorithm[counAlg] + 1, // смена
            date: date.getDate(), // день
            month: date.getMonth(), // месяц
            year: date.getFullYear(), // день недели
            dayOfTheWeek: date.getDay(), // день недели
            timeHour: date.getHours(),
            fullYear: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            isNight: true
        };
        if(!(date.getHours() > 8)) {
            objectDate.isNight = false;
        }
    
        arrayOfShift[algorithm[counAlg++]].push(objectDate);
        if (i == dayInMonth[indexDaysInMonth].countMonth) {
            i = 0;
            if (indexDaysInMonth < dayInMonth.length - 1) { // месяц ++ если меньше количества месяцев
                indexDaysInMonth++
            } else {
                break
            } 
        }
    }
    return arrayOfShift;
}
module.exports = getArrayShift;