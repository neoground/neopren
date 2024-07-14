import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * A select with options as a dropdown
 *
 * Props:
 *
 * - options (object with key-value-pairs of options)
 * - active (key of the active option)
 * - change (callback which gets the key of the selected option passed)
 */
export default class DropdownSelect extends Component {
    onInput = (ev, key) => {
        ev.preventDefault()
        this.props.change(key)
    }

    render(props, state, context) {
        return html`
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                    ${props.options[props.active]}
                </button>
                <ul class="dropdown-menu">
                    ${Object.keys(props.options).map(key => html`
                        <li>
                            <a class="dropdown-item ${key === props.active ? 'active' : ''}"
                               href="#"
                               onClick=${this.onInput}>
                                ${props.options[key]}
                            </a>
                        </li>
                    `)}
                </ul>
            </div>
        `;
    }
}