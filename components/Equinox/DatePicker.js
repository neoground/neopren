import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import '../../node_modules/dayjs/locale/de.js'
import '../../node_modules/dayjs/plugin/isoWeek.js'
import '../../node_modules/dayjs/plugin/weekOfYear.js'
import '../../node_modules/dayjs/plugin/isToday.js'
import Format from "../App/Format.js"
import MonthGrid from "./MonthGrid.js"

dayjs.extend(window.dayjs_plugin_isoWeek)
dayjs.extend(window.dayjs_plugin_weekOfYear)
dayjs.extend(window.dayjs_plugin_isToday)

const html = htm.bind(h)

/**
 * Display a date picker
 */
export default class DatePicker extends Component {

    state = {
        ready: false
    }

    componentDidMount() {
        let now = dayjs().locale('de')
        let date = this.props.date
        if(!date) {
            date = now
        }

        // We also allow date as strings, e.g. from form inputs
        if(typeof date != 'object') {
            date = dayjs(date).locale('de')
        }

        this.setState({
            today: now,
            tomorrow: now.clone().add(1, 'day'),
            weekend: now.clone().add(1, 'day').day(6),
            nextweek: now.clone().add(7, 'day').day(1),
            displayFormat: 'dd, DD. MMM',
            calendarDate: date,
            ready: true
        })
    }

    /**
     * Sets the date using the provided value.
     *
     * @param {string|null} date - The datetime value to be set as ISO8601 or null for no date.
     */
    setDate = date => {
        this.props.setDate(date)
        this.setState({
            ...this.state,
            calendarDate: date
        })
    }

    removeDate = () => {
        this.props.setDate(null)
        this.setState({
            ...this.state,
            calendarDate: Format.Today()
        })
    }

    moveMonth = (direction) => {
        this.setState({
            ...this.state,
            calendarDate: this.state.calendarDate.add(direction, 'month')
        })
    }

    onDayClick = date => {
        this.setDate(date)
    }

    render(props, state, context) {
        return html`
            <div class="dropdown datePickerDropdown">
                <button class="btn btn-secondary btn-icon dropdown-toggle flex-column w-100" type="button" data-bs-toggle="dropdown"
                        data-bs-auto-close="outside" aria-expanded="false">
                    ${this.props.date ? html`
                        ${Format.DateForHumans(this.props.date)}
                    ` : html`Auswählen...`}
                </button>
                <div class="dropdown-menu" style="width: 350px; overflow-y: auto">
                    ${this.state.ready && html`
                        <div class="dropdown-item">${this.props.date ? html`${Format.DateLong(this.props.date)}` : html`Kein Datum`}</div>
                        <button class="dropdown-item" onClick=${ev => { ev.preventDefault(); this.setDate(this.state.today) }}>
                            <span class="material-symbols-outlined me-3">event</span>
                            Heute <span class="ms-auto">${this.state.today.format(this.state.displayFormat)}</span>
                        </button>
                        <button class="dropdown-item" onClick=${ev => { ev.preventDefault(); this.setDate(this.state.tomorrow) }}>
                            <span class="material-symbols-outlined me-3">wb_sunny</span>
                            Morgen <span class="ms-auto">${this.state.tomorrow.format(this.state.displayFormat)}</span>
                        </button>
                        <button class="dropdown-item" onClick=${ev => { ev.preventDefault(); this.setDate(this.state.weekend) }}>
                            <span class="material-symbols-outlined me-3">weekend</span>
                            Nächstes Wochenende <span class="ms-auto">${this.state.weekend.format(this.state.displayFormat)}</span>
                        </button>
                        <button class="dropdown-item" onClick=${ev => { ev.preventDefault(); this.setDate(this.state.nextweek) }}>
                            <span class="material-symbols-outlined me-3">next_week</span>
                            Nächste Woche <span class="ms-auto">${this.state.nextweek.format(this.state.displayFormat)}</span>
                        </button>
    
                        <button class="dropdown-item" onClick=${ev => { ev.preventDefault(); this.removeDate() }}>
                            <span class="material-symbols-outlined me-3">cancel</span>
                            Kein Datum
                        </button>
    
                        <div class="px-3 mt-2">
                            <div class="row">
                                <${MonthGrid} date=${this.state.calendarDate} controls="1" calWeekHeading="KW" 
                                              today=${this.props.date}
                                              moveMonth=${this.moveMonth} 
                                              setToToday=${() => this.setDate(this.state.today)}
                                              onDayClick=${this.onDayClick} />
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `
    }

}