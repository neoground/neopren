import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import '../../node_modules/dayjs/locale/de.js'
import '../../node_modules/dayjs/plugin/isoWeek.js'
import '../../node_modules/dayjs/plugin/weekOfYear.js'
import '../../node_modules/dayjs/plugin/isToday.js'
import MonthGrid from "./MonthGrid.js"

dayjs.extend(window.dayjs_plugin_isoWeek)
dayjs.extend(window.dayjs_plugin_weekOfYear)
dayjs.extend(window.dayjs_plugin_isToday)

const html = htm.bind(h)

/**
 * Display a single month calendar
 */
export default class Calendar extends Component {

    state = {
        currentDate: dayjs().locale('de')
    }

    moveMonth = (direction) => {
        this.setState({
            ...this.state,
            currentDate: this.state.currentDate.add(direction, 'month'),
        })
    }

    setToToday = () => {
        this.setState({
            ...this.state,
            currentDate: dayjs().locale('de')
        })
    }

    render(props, state, context) {
        const { currentDate } = this.state

        return html`
            <div class="row">
                <${MonthGrid} date=${currentDate} controls="1" calWeekHeading="KW"
                              today=${dayjs().locale('de')}
                              moveMonth=${this.moveMonth} setToToday=${this.setToToday} />
            </div>
        `
    }

}