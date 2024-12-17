import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'

const html = htm.bind(h)

/**
 * The task progress for aside
 *
 * Props: activetasks / statictasks (both from app)
 */
export default class AsideTasks extends Component {
    // Initial state
    state = {
        active_tasks: [],
        static_tasks: []
    }

    componentDidMount() {
        this.fetch_count = 0
        this.activity_timer = setInterval(
            () => this.fetchProgress(),
            2000,
        )
        window.addEventListener('storage', this.onStorageChange)
        this.fetchProgress(true)
    }

    componentWillUnmount() {
        clearInterval(this.activity_timer)
        window.removeEventListener('storage', this.onStorageChange)
    }

    /**
     * Detect changes in local storage
     */
    onStorageChange = () => {
        let data = localStorage.getItem('app_data')
        if(data) {
            data = JSON.parse(data)
            if(data.tasks) {
                // Got valid and newer data
                this.setState({
                    ...this.state,
                    active_tasks: data.tasks,
                    static_tasks: data.app.static_tasks
                })
            }
        }
    }

    fetchProgress = (force_fetch = false) => {
        this.fetch_count++;
        if(this.fetch_count > 15) {
            this.fetch_count = 0
            force_fetch = true
        }

        if((this.state.active_tasks && this.state.active_tasks.length > 0) || force_fetch) {
            fetch(window.neopren.baseUrl + '/api/taskprogress?with_tasks=1')
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        ...this.state,
                        progress_tasks: data.progress,
                        active_tasks: data.running,
                        static_tasks: data.static
                    })

                    if(window.neoapi && data.avg) {
                        this.last_avg = data.avg
                        window.neoapi.setProgress(data.avg)
                    }
                })
        } else if(this.state.static_tasks && this.state.static_tasks.length > 0) {
            // Got active task, so refresh in any case
            this.setState({
                ...this.state
            })
        }

        if(this.state.active_tasks.length === 0 && window.neoapi) {
            // No tasks but recent avg -> clear progress bar
            window.neoapi.setProgress(-1)
        }
    }

    renderTaskProgress = (props) => {
        // Don't ask me why, but it's a weird array, and we need index #1
        let task = props.task[1]

        let progress = false
        if(this.state.progress_tasks[task.id]) {
            progress = this.state.progress_tasks[task.id]

        }

        return html`
            <a href=${window.neopren.baseUrl + '/backend/controlpanel?setpage=tasklog'} class="h6 m-0 text-white text-decoration-none d-flex align-items-center" 
               title=${task.description + ", Job ID: " + task.id}>
                ${task.icon && html`<span class="material-symbols-outlined icon-1-25x me-2">${task.icon}</span>`}
                ${task.name}</a>

            ${task.status == 1 && html`
                <span class="d-block text-white opacity-75 small"
                      style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;">Erfolgreich beendet</span>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-success"
                         role="progressbar" style="width: 100%;"
                         aria-valuenow="100" aria-valuemin="0"
                         aria-valuemax="100">100%</div>
                </div>
            `}

            ${task.status == 2 && html`
                <span class="d-block text-white opacity-75 small"
                      style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;">Error</span>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger"
                         role="progressbar" style="width: 100%;"
                         aria-valuenow="100" aria-valuemin="0"
                         aria-valuemax="100">100%</div>
                </div>
            `}

            ${task.status == 3 && html`
                <span class="d-block text-white opacity-75 small"
                      style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;">Abgebrochen</span>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger"
                         role="progressbar" style="width: 100%;"
                         aria-valuenow="100" aria-valuemin="0"
                         aria-valuemax="100">100%</div>
                </div>
            `}

            ${task.status == 0 && html`
                ${progress && html`
                    <span class="d-block text-white opacity-75 small"
                          style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;" title=${progress.description}>${progress.description}</span>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                             role="progressbar" style=${'width: ' + progress.progress + '%;'}
                             aria-valuenow=${progress.progress} aria-valuemin="0"
                             aria-valuemax="100">${progress.progress}%</div>
                    </div>
                `}
                ${!progress && html`
                    <span class="d-block text-white opacity-75 small"
                          style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;">${'\u00A0'}</span>
                    
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-secondary" role="progressbar" style="width: 100%"
                             aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                `}
            `}
        `
    }

    renderStaticTaskProgress = (props) => {
        let task = props.task[1]

        let now = dayjs()
        let start = dayjs(task.start)
        let end = dayjs(task.end)

        if(end.isAfter(now)) {
            // Duration in seconds
            let duration = end.unix() - start.unix()
            let passed = now.unix() - start.unix()

            if(duration > 0 && passed <= duration) {
                let percentage = Math.round(passed / duration * 100)
                return html`
                    <span class="h6 m-0 text-white text-decoration-none d-flex align-items-center"
                       title=${"Static Job ID: " + task.id}>
                        ${task.icon && html`<span class="material-symbols-outlined icon-1-25x me-2">${task.icon}</span>`}
                        ${task.title}</span>
                    
                    <span class="d-block text-white opacity-75 small"
                          style="overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;" title=${task.description}>${task.description}</span>
                    
                    ${percentage >= 0 && percentage < 100 && html`
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated"
                                 role="progressbar" style=${'width: ' + percentage + '%;'}
                                 aria-valuenow=${percentage} aria-valuemin="0"
                                 aria-valuemax="100">${percentage}%</div>
                        </div>
                    `}
                    ${percentage == 100 && html`
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped bg-success"
                                 role="progressbar" style="width: 100%;"
                                 aria-valuenow="100" aria-valuemin="0"
                                 aria-valuemax="100">100%</div>
                        </div>
                    `}
                `
            }
        }

        return html``
    }

    render(props, state, context) {
        return html`
            ${this.state.active_tasks && this.state.active_tasks.length > 0 && html`
                <hr />
                <div class="row activity-data">
                    ${this.state.active_tasks && Object.entries(this.state.active_tasks).map(task => html`
                        <div class="col-12">
                            <${this.renderTaskProgress} task=${task} />
                        </div>
                    `)}
                </div>
            `}
            
            ${this.state.static_tasks && this.state.static_tasks.length > 0 && html`
                <hr />
                <div class="row activity-data">
                    ${this.state.static_tasks && Object.entries(this.state.static_tasks).map(task => html`
                        <div class="col-12">
                            <${this.renderStaticTaskProgress} task=${task} />
                        </div>
                    `)}
                </div>
            `}
        `
    }

}
