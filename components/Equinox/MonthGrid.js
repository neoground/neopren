import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import '../../node_modules/dayjs/locale/de.js'
import '../../node_modules/dayjs/plugin/isoWeek.js'
import '../../node_modules/dayjs/plugin/weekOfYear.js'
import '../../node_modules/dayjs/plugin/isToday.js'

dayjs.extend(window.dayjs_plugin_isoWeek)
dayjs.extend(window.dayjs_plugin_weekOfYear)
dayjs.extend(window.dayjs_plugin_isToday)

const html = htm.bind(h)

/**
 * Display a single month as grid
 *
 * Contains a bunch of "cols", so wrap this inside a row.
 *
 * Props:
 *
 * - date: the dayjs date instance
 * - showLeapDays: boolean if leap days should be shown at the beginning / end of month (e.g. 31st before 1st)
 * - controls: boolean if controls should be shown besides month name
 * - moveMonth: method which accepts an integer and changes the month this amount (+1 -> next month, -2 -> 2 months ago)
 * - setToToday: method which sets the date to today
 * - calWeekHeading: string which is displayed as heading of calendar week column (default: "#")
 * - headingFormat: string which contains the format of the heading to display (default: "dd", see dayjs formatting)
 * - events: array of events from API (sub-arrays by date)
 * - showEvents: bool, show events in month grid? Default: false
 * - today: optional dayjs date instance of date which should be highlighted as today
 */
export default class MonthGrid extends Component {
    render(props, state, context) {
        // Dayjs instance of wanted date
        let currentDate = props.date

        // Show leap days at beginning / end of weeks of month (e.g. 31st before 1st)
        let showLeapDays = Boolean(props.showLeapDays)

        // Date calculation
        const startOfMonth = currentDate.clone().startOf('month')
        const endOfMonth = currentDate.clone().endOf('month')
        const start = startOfMonth.startOf('week').isoWeekday(1)
        const end = endOfMonth.endOf('week').isoWeekday(7)

        let date = start
        const weeks = []

        // First catch the heading
        let calweekheading = props.calWeekHeading || '#'
        let headingformat = props.headingFormat || 'dd'
        let headings = [calweekheading]
        for (let i = 1; i <= 7; i++) {
            let day = date.clone().isoWeekday(i)
            headings.push(day.format(headingformat))
        }

        // Go through all weeks in this date span
        while (date.isBefore(end) || date.isSame(end)) {
            const days = []

            // Go through all days in this week
            for (let i = 1; i <= 7; i++) {
                let day = date.isoWeekday(i)

                let classes = 'col calendar-day'

                if(day.isBefore(startOfMonth) || day.isAfter(endOfMonth)) {
                    classes += ' other-month'
                    if(!showLeapDays) {
                        classes += ' is-hidden'
                    }
                }

                let events_of_today = props.events?.[day.format('YYYY-MM-DD')] || []
                let isHoliday = false
                let title = ''
                events_of_today.forEach(el => {
                    if(el.type && el.type == 'holidays') {
                        isHoliday = true
                        title = el.title
                    }
                })

                let today = this.props.today
                if(today && day.isSame(today, 'day')) {
                    classes += ' is-today'
                }

                // Holidays / sundays
                if(isHoliday || day.format('d') === '0') {
                    classes += ' is-holiday'
                }

                days.push(
                    html`<div class=${classes} title=${title}>
                        <div class="calendar-no">${day.date()}</div>
                        ${events_of_today.length > 0 && props.showEvents && html`
                            <div class="list-group calendar-events">
                                ${Object.entries(events_of_today).map(([k, v]) => html`
                                    <div class="list-group-item calendar-event" 
                                         style=${{ "backgroundColor": v.backgroundColor || '#ccc' }}>
                                        ${v.icon && html`<span class="material-symbols-outlined icon-1x me-2">${v.icon}</span>`}
                                        ${v.title}
                                    </div>
                                `)}
                            </div>
                        `}
                        
                        ${this.props.onDayClick && html`
                            <a href="#" class="stretched-link" onClick=${ev => { ev.preventDefault(); this.props.onDayClick(day) }}></a>
                        `}
                    </div>`
                )
            }
            weeks.push(html`<div class="row"><div class="col week-number">
                <div class="calendar-no">${date.week()}</a></div>${days}</div>`)
            date = date.add(1, 'week')
        }

        return html`
            <div class="col-12 d-flex justify-content-between align-items-center">
                <div>
                    <div class="h4 m-0">${currentDate.format('MMMM YYYY')}</div>
                </div>

                ${Boolean(props.controls) && html`
                    <div class="btn-group">
                        <button class="btn btn-secondary btn-icon" onClick=${props.setToToday} title="Today">
                            <span class="material-symbols-outlined icon-1-5x">event</span>
                        </button>
                        <button class="btn btn-secondary btn-icon" onClick=${(e) => { e.preventDefault(); props.moveMonth(-1)}}
                                title="Last Month">
                            <span class="material-symbols-outlined icon-1-5x">expand_less</span>
                        </button>
                        <button class="btn btn-secondary btn-icon" onClick=${(e) => { e.preventDefault(); props.moveMonth(1)}}
                                title="Next month">
                            <span class="material-symbols-outlined icon-1-5x">expand_more</span>
                        </button>
                    </div>
                `}
            </div>
            <div class="col-12 mb-3">
                <div class="calendar-month">
                    <div class="row calendar-heading">
                        ${headings.map((title) => html`<div class="col">${title}</div>`)}
                    </div>

                    ${weeks}
                </div>
            </div>
        `
    }

}