import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import '../../node_modules/dayjs/locale/de.js'
import '../../node_modules/dayjs/plugin/isoWeek.js'
import '../../node_modules/dayjs/plugin/weekOfYear.js'
import '../../node_modules/dayjs/plugin/isToday.js'
import MonthGrid from "./MonthGrid.js"
import Api from "../App/Api.js"
import Format from "../App/Format.js"

dayjs.extend(window.dayjs_plugin_isoWeek)
dayjs.extend(window.dayjs_plugin_weekOfYear)
dayjs.extend(window.dayjs_plugin_isToday)

const html = htm.bind(h)

/**
 * Display a 3-months-calendar
 *
 * Props:
 * - controls: opt. string of controls position: top, middle (default), bottom, above
 */
export default class Calendar3M extends Component {

    state = {
        delta: 1,
        currentDate: dayjs().locale('de'),
        events: [],
        apiUrl: 'api/equinox/events/'
    }

    componentDidMount() {
        this.fetchEvents(this.state.delta)
    }

    moveMonth = (direction) => {
        this.setState({
            ...this.state,
            currentDate: this.state.currentDate.add(direction, 'month'),
        }, () => {
            this.fetchEvents(this.state.delta)
        })
    }

    setToToday = () => {
        this.setState({
            ...this.state,
            currentDate: dayjs().locale('de')
        }, () => {
            this.fetchEvents(this.state.delta)
        })
    }

    fetchEvents = (delta) => {
        // Default: Single month
        let startDate = this.state.currentDate.clone()
        let endDate = this.state.currentDate.clone()

        // Delta is amount of months to fetch before / after state.currentDate
        if(delta >= 1) {
            // Multi month
            startDate = startDate.add(delta * -1, 'month')
            endDate = endDate.add(delta, 'month')
        }

        Api.get(this.state.apiUrl + '?type=month&start=' + startDate.format('YYYY-MM-DD') + '&end=' + endDate.format('YYYY-MM-DD'))
            .then(data => {
                this.setState({
                    ...this.state,
                    events: data.events
                })
            })
    }

    render(props, state, context) {
        const { currentDate } = this.state

        // Controls position: top, middle, bottom, above
        let controls = props.controls
        if(!controls) {
            controls = 'middle'
        }

        return html`
            <div class="row">
                ${controls == 'above' && html`
                    <div class="col-12 mb-3 text-center">
                        <div class="btn-group">
                            <button class="btn btn-secondary btn-icon" onClick=${this.setToToday} title="Today">
                                <span class="material-symbols-outlined icon-1-5x">event</span>
                            </button>
                            <button class="btn btn-secondary btn-icon" onClick=${() => this.moveMonth(-1)}
                                    title="Last Month">
                                <span class="material-symbols-outlined icon-1-5x">expand_less</span>
                            </button>
                            <button class="btn btn-secondary btn-icon" onClick=${() => this.moveMonth(1)}
                                    title="Next month">
                                <span class="material-symbols-outlined icon-1-5x">expand_more</span>
                            </button>
                        </div>
                    </div>
                `}
                
                <${MonthGrid} date=${currentDate.clone().add(-1, 'month')} calWeekHeading="KW" events=${this.state.events}
                              moveMonth=${this.moveMonth} setToToday=${this.setToToday} today=${Format.Today()}
                              controls=${controls == 'top' ? 1 : 0} />

                <${MonthGrid} date=${currentDate} controls="1" calWeekHeading="KW" events=${this.state.events}
                              moveMonth=${this.moveMonth} setToToday=${this.setToToday} today=${Format.Today()}
                              controls=${controls == 'middle' ? 1 : 0} />

                <${MonthGrid} date=${currentDate.clone().add(1, 'month')} calWeekHeading="KW" events=${this.state.events}
                              moveMonth=${this.moveMonth} setToToday=${this.setToToday} today=${Format.Today()}
                              controls=${controls == 'bottom' ? 1 : 0} />
            </div>
        `
    }

}