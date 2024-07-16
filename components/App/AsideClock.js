import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import Calendar3M from "../Equinox/Calendar3M.js"

const html = htm.bind(h)

/**
 * The clock (local + utc + sunrise/set) for aside
 */
export default class AsideClock extends Component {
    // Initial state
    state = {
        date: '',
        time: '',
        date_utc: '',
        time_utc: '',
        seconds_utc: '00',
        timezone: 'CET',
        world: {
            SFO: {
                timezone: 'America/Los_Angeles',
                date: '',
                time: ''
            },
            NYC: {
                timezone: 'America/New_York',
                date: '',
                time: ''
            },
            TYO: {
                timezone: 'Asia/Tokyo',
                date: '',
                time: ''
            },
            AKL: {
                timezone: 'Pacific/Auckland',
                date: '',
                time: ''
            }
        },
        active: 'clock'
    }

    componentDidMount() {
        this.setTime(true)
        this.clock_timer = setInterval(
            () => this.setTime(),
            1000,
        )

    }

    componentWillUnmount() {
        clearInterval(this.clock_timer)
        clearInterval(this.app_timer)
    }

    setActive = val => {
        this.setState({
            ...this.state,
            active: val
        })
    }

    setTime(full_reload = false) {
        let jsdate = new Date()
        let offset = jsdate.getTimezoneOffset()
        let date = dayjs(jsdate)
        let utc_date = dayjs().add(offset, 'minute')

        let timezone = 'CET'
        if (offset < -60) {
            // -120 -> CEST
            timezone = 'CEST'
        }

        let world = this.state.world
        // Update world time each minute (or if forced)
        if (date.second() === 0 || full_reload) {
            const options = {
                dateStyle: 'medium',
                timeStyle: 'short',
                hour12: false
            };

            for (const key in world) {
                if (world.hasOwnProperty(key)) {
                    const timezone = world[key].timezone;
                    const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {...options, timeZone: timezone});
                    const now = new Date();
                    const [date, time] = dateTimeFormat.format(now).split(', ');
                    world[key].date = date;
                    world[key].time = time;
                }
            }
        }

        this.setState({
            ...this.state,
            date: date.format('DD.MM.YYYY'),
            time: date.format('HH:mm:ss'),
            date_utc: utc_date.format('DD.MM.YYYY'),
            time_utc: utc_date.format('HH:mm:ss'),
            seconds_utc: utc_date.format('ss'),
            timezone: timezone,
            world: world
        })
    }

    NavItem = (props, state, context) => {
        let linkclasses = 'nav-link pb-0 pt-1'
        if (this.state.active == props.name) {
            linkclasses += ' active'
        }
        return html`
            <li class="nav-item">
                <a class=${linkclasses} href="#" onClick=${ev => {
                    ev.preventDefault();
                    this.setActive(props.name)
                }}>
                    <span class="material-symbols-outlined icon-1x">${props.icon}</span>
                </a>
            </li>
        `
    }

    WorldTime = (props, state, context) => {
        return html`
            ${Object.entries(this.state.world).map(([k, v]) => html`
                <span class="d-block">${k} ${v.date} ${v.time}:${this.state.seconds_utc}</span>
            `)}
        `
    }

    render(props, state) {
        let sunrise = dayjs.unix(props.astro.sun.sunrise)
        let sunset = dayjs.unix(props.astro.sun.sunset)

        let spacer = ''
        if (this.state.timezone === 'CEST') {
            spacer = '\u00A0'
        }

        return html`
            <ul class="nav nav-fill times-nav">
                <${this.NavItem} name="clock" icon="schedule"/>
                <${this.NavItem} name="world" icon="public"/>
                <${this.NavItem} name="cal" icon="calendar_today"/>
            </ul>

            ${this.state.active == 'clock' && html`
                <div class="current-times times-section">
                    <span class="d-block">${this.state.timezone} ${this.state.date} ${this.state.time}</span>
                    <span class="d-block">${spacer}UTC ${this.state.date_utc} ${this.state.time_utc}</span>
                    <span class="d-block">${spacer}SUN ${sunrise.format('HH:mm:ss')} - ${sunset.format('HH:mm:ss')}
                    </span>
                </div>
            `}
            ${this.state.active == 'world' && html`
                <div class="current-times times-section">
                    <${this.WorldTime}/>
                </div>
            `}
            ${this.state.active == 'cal' && html`
                <div class="times-section">
                    <${Calendar3M} controls="above"/>
                </div>
            `}
        `
    }

}
