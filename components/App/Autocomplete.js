import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Api from "./Api.js"

const html = htm.bind(h)

/**
 * Pagination component
 *
 * Example usage:
 *
 * <${Autocomplete} entries=${ {foo: 'bar', duke: 'nukem'} } or entriesApi=${"https..."} (object of entries or URL to API endpoint)
 *                  onSelect=${this.handleSelection} (on selection this will be called, has a parameter "el" with object from api)
 *                  renderEntry=${this.renderEntry} (render entry in autocomplete list, has "props.el" with object from api)
 *                  value=${this.state.customValue} (update this value to update it in input as well)
 *                  updateInputValue=${(el) => el.zip} (el is object from API. Return display value for input)
 *                  onCustomInput=${(val) => console.log(val)} (on input this is fired, so input can be handled even if no selection is done)
 *                  name="DukeNukemExample" (name of fields, including input name)
 *                  allowCustom="1" (if non-false it will allow a custom entry based on the input and prepend it to the autocomplete list)
 *                  amount="10" (if you want other amount of results than 10, set empty to use API default)
 * />
 *
 * See AutocompleteDemo.js for a concrete example, including live data via API.
 *
 * Entry:
 * {
 *     key: 123,
 *     value: { zip: '60318', city: 'Frankfurt am Main' },
 * }
 *
 */
export default class Autocomplete extends Component {
    // Initial state
    state = {
        q: '',
        entries: [],
        entries_filtered: [],
        selected: false
    }

    onInput = ev => {
        if (this.props.onCustomInput) {
            this.props.onCustomInput(ev.target.value)
        }

        this.setState({...this.state, q: ev.target.value}, () => {
            this.filterEntries()
        })
    }

    getValue = () => {
        if (this.props.value || this.props.value == '') {
            return this.props.value
        }

        return this.state.q
    }

    filterEntries = () => {
        let amount = this.props.amount
        if (!amount) {
            amount = 10
        }

        if (this.props.entries) {
            let entries_filtered = []

            if (this.props.allowCustom) {
                entries_filtered.push({
                    key: this.getValue(),
                    value: this.getValue(),
                })
            }

            for (const [key, value] of Object.entries(this.props.entries)) {
                if (value.value.toLowerCase().includes(this.getValue().toLowerCase())) {
                    entries_filtered.push(value)
                }

                if (entries_filtered.length >= amount) {
                    break
                }
            }

            this.setState({
                ...this.state,
                entries_filtered: entries_filtered
            })
        } else if (this.props.entriesApi) {
            // Fetch filtered entries from API
            Api.get(this.props.entriesApi + "?q=" + this.getValue() + "&amount=" + amount)
                .then(data => {
                    let entries = data.entries

                    if (this.props.allowCustom) {
                        entries = [
                            {
                                key: this.getValue(),
                                value: this.getValue(),
                            },
                            ...entries
                        ]
                    }

                    this.setState({
                        ...this.state,
                        entries_filtered: entries
                    })
                })
        }
        this.showDropdown()
    }

    showDropdown = () => {
        if (this.state.entries_filtered.length > 0) {
            let dropdownEl = document.getElementById('autocomplete-dropdown-' + this.props.name)
            let dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownEl, {
                autoClose: 'inside'
            })
            if (dropdown) {
                dropdown.show()
            }
        }
    }

    onSelect = (ev) => {
        ev.preventDefault()
        let key = ev.currentTarget.dataset.key
        if (key) {
            for (const [intkey, el] of Object.entries(this.state.entries_filtered)) {
                if (el && el.key && el.key == key) {
                    // Found it!
                    this.props.onSelect(el.value)

                    // Update entered term if implemented
                    let q = this.getValue()
                    if (this.props.updateInputValue) {
                        q = this.props.updateInputValue(el.value)
                    }

                    this.setState({
                        ...this.state,
                        selected: key,
                        q: q
                    })
                    break
                }
            }
        }
    }

    render(props, state, context) {
        let params = {}
        if (props.params) {
            params = props.params
        }

        let value = this.getValue()

        return html`
            <div class="d-flex dropdown">
                <button type="button" class="dropdown-toggle position-absolute invisible h-100" style="z-index: 40"
                        data-bs-toggle="dropdown" id=${"autocomplete-dropdown-" + this.props.name}></button>
                <input type="text" class="form-control dropdown-toggle"
                       style="z-index: 50" id=${"autocomplete-" + this.props.name} name=${this.props.name}
                       value=${value}
                       onInput=${this.onInput} onFocus=${this.showDropdown} ...${params}/>
                <ul class=${this.state.entries_filtered.length < 1 ? 'dropdown-menu invisible' : 'dropdown-menu'}
                    style="max-height: 40vh; overflow-y: auto;">
                    ${state.entries_filtered && state.entries_filtered.length > 0
                    && Object.entries(state.entries_filtered).map(([k, el]) => html`
                        <li>
                            <button class=${el.key == this.state.selected ? "dropdown-item d-block active" : "dropdown-item d-block"}
                                    type="button" data-key=${el.key} onClick=${this.onSelect}>
                                <${props.renderEntry} el=${el.value}/>
                            </button>
                        </li>
                    `)}
                </ul>
            </div>
        `
    }

}
