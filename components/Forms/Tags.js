import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Autocomplete from "../App/Autocomplete.js"

const html = htm.bind(h)

/**
 * A tags component
 *
 * Props:
 *
 * - entries (all available entries, must be an array of objects, each object having: key, value)
 * - label (label string)
 * - noCustom (set to disallow custom entries)
 * - tags (array of tags which are set / active)
 * - handleInput (input handler callback, e.g. onInput, props.handleInput)
 * - name (name of model column which contains the tags, will be passed to handleInput)
 *
 * Input handler is compatible with entity grid, passing 3 parameters: handleInput(false, name, tags).
 *
 * Example:
 *
 * <${Tags} entries=${this.state.filters.tags} label="Tags" name="tags"
 *          tags=${this.state.element.tags} handleInput=${this.onInput} />
 */
export default class Tags extends Component {
    state = {
        id: 'tags',
        custom_value: '',
    }

    componentDidMount() {

        this.setState({
            id: 'tags-' + Math.random().toString(36).slice(-8),
        })
    }

    addTag = (el) => {
        let tags = this.props.tags
        let field = this.props.name
        let handler = this.props.handleInput

        if (!tags || tags == null) {
            tags = []
        }

        if (!tags.includes(el)) {
            tags.push(el)
            handler(false, field, tags)
            this.setState({
                custom_value: ''
            })
        }
    }

    removeTag = (ev) => {
        ev.preventDefault()
        let tag = ev.currentTarget.dataset.tag
        let tags = this.props.tags
        let field = this.props.name
        let handler = this.props.handleInput

        if (!tags || tags == null) {
            tags = []
        }

        let index = tags.indexOf(tag)
        if (index !== -1) {
            tags.splice(index, 1)
        }

        handler(false, field, tags)
    }

    autocompleteTag = (props, state, context) => {
        return html`<span>${props.el}</span>`
    }

    render(props, state, context) {
        return html`
            <label for=${"autocomplete-" + this.state.id} class="form-label">${props.label}</label>
            <${Autocomplete} entries=${props.entries}
                             name=${this.state.id}
                             onSelect=${(el) => this.addTag(el)}
                             onCustomInput=${(val) => this.setState({custom_value: val})}
                             value=${this.state.custom_value}
                             renderEntry=${this.autocompleteTag}
                             updateInputValue=${(el) => el.value}
                             allowCustom=${props.noCustom ? "0" : "1"}
            />

            <div class="mt-2">
                ${props.tags && Object.entries(props.tags).map(([k, tag]) => html`
                    <span class="badge bg-primary me-3 mb-2" style="font-weight: normal; font-size: 1rem">${tag}
                        <button class="btn btn-sm p-0 d-inline-flex ms-1" data-tag=${tag}
                                onClick=${(ev) => this.removeTag(ev)}>
                            <span class="material-symbols-outlined" style="font-size: 1rem">close</span>
                        </button>
                    </span>
                `)}
            </div>
        `;
    }
}