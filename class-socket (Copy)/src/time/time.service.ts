import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TimeService {
    obj = new Date()
    date
    hours
    mins
    months
    numb
    year
    totaltime
    totalDate
    constructor() {
        let date = this.obj.toLocaleDateString()
        let mins = this.obj.getMinutes()
        let hours = this.obj.getHours()

        this.date = date
        let dates = this.date.split("/")
        this.hours = hours
        let months = parseInt(dates[0])
        let num = parseInt(dates[1])
        let years = parseInt(dates[2])
        this.mins = mins
        this.months = months
        this.numb = num
        this.year = years
        this.totaltime = this.obj.toLocaleTimeString()
        this.totalDate = `${months}/${num}/${years}`
    }
    async getTime(): Promise<any> {
        try {
            return { date: this.date, hours: this.hours, mins: this.mins }
        } catch (err) {

        }
    }

    async getOnlyTime(): Promise<any> {
        try {
            return `${this.hours}:${this.mins}`
        } catch (err) {
            console.error(err.message);
        }
    }
    async getTImeFormatSQL(): Promise<any> {
        try {
            const all = `${this.year}-${this.months}-${this.date}`
            return all
        } catch (err) {
            console.error(err.message);
        }
    }

    async splittedTime(input: any): Promise<any> {
        try {
            console.log("prepare debug", input)
            let splitted = input.split(",")
            const day = splitted[0].split("/")
            let month = parseInt(day[0])
            let date = parseInt(day[1])
            let year = parseInt(day[2])
            const time = splitted[1].split(":")
            let hours = parseInt(time[0])
            let mins = parseInt(time[1])

            return { month: month, date: date, year: year, hours: hours, mins: mins }
        } catch (error) {
            Logger.error(error.message)
        }
    }
    async comparsionTime(time: any, month, numb, year): Promise<any> {
        try {
            let hours = time[0]
            let mins = time[1]

            const monthCondition = this.months <= month ? true : false
            const numCondition = this.numb <= numb ? true : false
            const yearCondition = this.year <= year ? true : false
            const hoursCondition = this.hours <= hours ? true : false
            const minsCondition = this.mins <= mins ? true : false

            console.log(month, this.months)
            if (year > this.year) {
                console.log("year true")
                return true
            }


            if (year === this.year && month > this.months) {
                console.log("month true")
                return true
            }

            else if (year === this.year && this.months === month) {
                if (hours > this.hours) {
                    console.log("hours true")
                    return true
                } else if (hours === this.hours) {
                    if (this.mins < mins) {
                        console.log("true mins")
                        return true
                    } else {
                        console.log("false minss")
                        return false
                    }
                }
            } else if (year < this.year) {
                console.log("year false")
                return false
            } else if (month < this.months) {
                console.log("month false")
                return false
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    async prepareDeadline(deadline: string): Promise<any> {
        try {
            let splittedTime = deadline.split(",")[1]
            const splittedTimeTwo = splittedTime.split(":")
            let hours = parseInt(splittedTimeTwo[0])
            let mins = parseInt(splittedTimeTwo[1])

            if (hours > this.hours) {
                return true
            } else {
                return false
            }

        } catch (error) {
            throw new error
        }
    }
    async offlineAgain(date: string, hours: number, mins: number): Promise<any> {
        try {
            console.debug("date debug", this.totalDate, date, this.totalDate === date)
            if (this.totalDate === date) {
                const vali = this.hours === hours && this.mins === mins
                return "online"
            }
            return "offline"


        } catch (error) {
            Logger.error(error)
        }
    }
}
