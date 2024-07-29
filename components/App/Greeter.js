import {h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Format from "./Format.js"

const html = htm.bind(h)

/**
 * Greetings, buddy!
 */
export default class Greeter {
    static TimeOfDay = () => {
        let d = Format.Today()
        if (d.hour() >= 5 && d.hour() < 12) {
            return 'm'
        } else if (d.hour() >= 12 && d.hour() < 18) {
            return 'd'
        } else if (d.hour() < 5 || d.hour() === 23) {
            return 'n'
        }

        return 'e'
    }

    static Greet = (props, state, context) => {

        let d = Format.Today()
        let greeting = 'Guten Abend'

        // Time specific
        switch (this.TimeOfDay()) {
            case 'm':
                greeting = 'Guten Morgen'
                break
            case 'd':
                greeting = 'Guten Tag'
                break
            case 'n':
                greeting = 'Gute Nacht'
                break
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
        let texts = {
            0: {
                m: 'Ein entspannter Sonntag beginnt.',
                d: 'Hoffentlich hast du einen erholsamen Sonntag.',
                e: 'Bereite dich in Ruhe auf die neue Woche vor',
                n: 'Nutze die Ruhe vor dem Wochenstart.'
            },
            1: {
                m: 'Bereit für eine erfolgreiche Woche?',
                d: 'Lass uns diese Woche großartig starten!',
                e: 'Zeit, den Tag ausklingen zu lassen.',
                n: 'Die Nacht ist jung, lass uns aktiv sein.'
            },
            2: {
                m: 'Der zweite Tag der Woche wartet.',
                d: 'Ein guter Tag für neue Herausforderungen.',
                e: 'Gute Arbeit, Zeit zum entspannen.',
                n: 'Ein weiterer Abend für großartige Ideen.'
            },
            3: {
                m: 'Wir sind schon in der Mitte der Woche.',
                d: 'Das Wochenende ist nicht mehr weit.',
                e: 'Ein erfolgreicher Tag liegt hinter dir.',
                n: 'Halte durch, die Woche ist bald geschafft.'
            },
            4: {
                m: 'Bald geschafft, morgen ist schon Freitag.',
                d: 'Heute ist ein guter Tag für Fortschritt.',
                e: 'Nur noch ein Tag bis zum Wochenende.',
                n: 'Noch ein letzter Push vor dem Wochenende.'
            },
            5: {
                m: 'Der Freitag ist da, das Wochenende naht.',
                d: 'Starte gut ins Wochenende!',
                e: 'Das Wochenende ist da, genieße es!',
                n: 'Das Wochenende hat begonnen!'
            },
            6: {
                m: 'Ein schöner Samstag liegt vor dir.',
                d: 'Genieße deinen Samstag!',
                e: 'Entspanne dich und lade deine Batterien auf.',
                n: 'Habe eine entspannte Samstagnacht!'
            }
        }

        return html`
            Heute ist ${d.format('dddd, [der] DD. MMMM YYYY')}. ${texts[d.day()][this.TimeOfDay()]}
        `
    }

}