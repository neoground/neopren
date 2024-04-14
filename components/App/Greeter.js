import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Format from "./Format.js"

const html = htm.bind(h)

/**
 * Greetings, buddy!
 *
 * Currently only in German, soon multilingual...
 */
export default class Greeter {
    static Greet = (props, state, context) => {

        let d = Format.Today()
        let greeting = 'Guten Abend'

        // Time specific
        if (d.hour() >= 0 && d.hour() < 12) {
            greeting = 'Guten Morgen'
        } else if (d.hour() >= 12 && d.hour() < 18) {
            greeting = 'Guten Tag'
        }

        // Christmas override (months are starting with 0)
        if (d.month() === 11 && (d.date() === 24 || d.date() === 25 || d.date() === 26)) {
            greeting = 'Frohe Weihnachten'
        }

        // New year
        if (d.month() === 11 && d.date() >= 30) {
            greeting = 'Guten Rutsch'
        }
        if (d.month() === 0 && d.date() < 3) {
            greeting = 'Frohes Neues'
        }

        // Easter dates for the next few years
        // We really miss the easter_date method of PHP in here... meh.
        if (d.month() === 2 || d.month() === 3) {
            let easter_dates = {
                2024: '2024-03-31',
                2025: '2025-04-20',
                2026: '2026-04-05',
                2027: '2027-03-28',
                2028: '2028-04-16',
                2029: '2029-04-01',
                2030: '2030-04-21',
                2031: '2031-04-13',
                2032: '2032-03-28',
                2033: '2033-04-17',
            }
            let easter_date_this_year = Format.Day(easter_dates[d.year()])

            // Date is sunday -> if between thursday and monday it's easter time
            let easter_date_start = easter_date_this_year.subtract(3, 'day')
            let easter_date_end = easter_date_this_year.add(1, 'day')

            if (d.isSame(easter_date_start, 'day') || d.isSame(easter_date_end, 'day') ||
                (d.isAfter(easter_date_start, 'day') && d.isBefore(easter_date_end, 'day'))) {
                greeting = 'Frohe Ostern'
            }
        }

        // Add birthday
        if (window.neopren.user && window.neopren.user.birthday) {
            let birthday = Format.Day(window.neopren.user.birthday)
            birthday = birthday.year(d.year())
            if (d.isSame(birthday, 'day')) {
                // It's your birthday!
                greeting = 'Alles Gute zum Geburtstag'
            }
        }

        return html`
            ${greeting}, ${props.name}!
        `
    }

    static Subline = (props, state, context) => {
        let d = Format.Today()
        let sub = "Heute ist " + d.format('dddd, [der] DD. MMMM YYYY')

        if (d.day() === 0 || d.day() === 6) {
            sub += ". Genieße das Wochenende!"
        } else if (d.day() === 1) {
            sub += ". Starte gut in die Woche!"
        } else if (d.day() === 5) {
            sub += ". Starte gut ins Wochenende!"
        }

        return html`
            ${sub}
        `
    }

}