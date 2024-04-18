import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h);

/**
 * Changelog button + modal
 *
 * Simple stand-alone usage: `<span id="changelog" data-model="App\Models\Rocket" data-id="420"></span>`
 * Or in other modules:      `<${Changelog} model="App\\Models\\Rocket" modelid="420" />`
 */
export default class Changelog extends Component {
    state = {
        model: '',
        id: 0,
        count: 0,
        changes: [],
        shown: false
    }

    buttonClickEvent = (event) => {
        event.preventDefault()
        let element = event.target.closest('a')
        if (!element) return

        let modal = document.getElementById('changelogModal')
        this.modal = bootstrap.Modal.getOrCreateInstance(modal, {})
        this.modal.show()
    }

    initChangelogFor(model, id)
    {
        // Fetch all data via API
        fetch(window.neopren.baseUrl + '/api/changes?model=' + model + '&id=' + id)
            .then(response => response.json())
            .then(data => {
                if(data.changes) {
                    this.setState({
                        ...this.state,
                        model: model,
                        id: id,
                        count: data.count,
                        changes: data.changes
                    })
                }
            })
    }

    componentDidMount() {
        // Modal init will be done on button click, so only fetch data for counter
        this.initChangelogFor(this.props.model, this.props.modelid)
    }

    closeModal = () => {
        this.setState({
            ...this.state,
            shown: false
        })

        this.modal.hide()
    }

    render(props, state, context) {
        return html`
            <a href="#" class="btn btn-primary btn-icon position-relative me-2 mb-3" 
               style="overflow: initial" onClick=${this.buttonClickEvent}>
                <span class="material-symbols-outlined">history</span> Änderungen
                ${state.count > 0 && html`
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    ${state.count}
                </span>
                `}
            </a>

            <div class="modal lightbox-modal fade" tabindex="-1" id="changelogModal">
                <div class="modal-dialog modal-lg" id="changelog-modal">

                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${props.count} Änderungen</h5>
                            <button type="button" class="btn-close" onClick=${this.closeModal} aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <div id="accordion" class="accordion">

                                ${state.changes && state.changes.map(change => html`
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id=${"heading-" + change.id}>
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target=${"#collapse-" + change.id} aria-expanded="false" aria-controls=${"collapse-" + change.id}>
                                                <div class="row w-100">
                                                    <div class="col-3">
                                                        <span class="badge bg-primary">${change.id}</span>
                                                    </div>
                                                    <div class="col-3">
                                                        von ${change.changed_by}
                                                    </div>
                                                    <div class="col-3" title=${change.date_full}>
                                                        ${change.date}
                                                    </div>
                                                    <div class="col-3 pe-3">${Object.keys(change.diff).length} Änderung${Object.keys(change.diff).length != 1 && html`en`}</div>
                                                </div>
                                            </button>
                                        </h2>
                                        <div id=${"collapse-" + change.id} class="accordion-collapse collapse" aria-labelledby=${"heading-" + change.id} data-bs-parent="#accordion">
                                            <div class="accordion-body">
                                                ${change.comment && html`<p>${change.comment}</p>`}
                                                <table class="table table-striped changelog-table">
                                                    <tbody>
                                                    ${change.diff && Object.entries(change.diff).map(([name, change]) => html`
                                                        <tr>
                                                            <td>${name}</td>
                                                            <td innerHTML=${change.html}></td>
                                                        </tr>
                                                    `)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                `)}

                            </div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        `
    }

}

let render_element = document.getElementById("changelog");
if(render_element !== null) {
    render(html`<${Changelog} model=${render_element.dataset.model} modelid=${render_element.dataset.id} />`, render_element);
}
