import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Form from "../App/Form.js"

const html = htm.bind(h)

/**
 * A select with an option to add a custom value
 *
 * Props:
 *
 * - options (object with key-value-pairs of options)
 * - onChange (callback which gets the key of the selected option passed or the custom value string)
 * - all props which should be passed to input / label (e.g. name, label, value, orderby, ...)
 */
export default class CustomSelect extends Component {
    onInput = (ev, key) => {
        ev.preventDefault()
        this.props.change(key)
    }

    onChange = (ev) => {
        const value = ev.target.value

        if (value === '__custom') {
            // Show input for custom value, which is empty by default
            this.props.onChange("")
            this.setState({isCustomizing: true})
        } else {
            // Pass normal value change to parent handler
            this.props.onChange(value)
        }
    }

    onCustomChange = (ev) => {
        ev.preventDefault()
        // Pass the custom value to the parent handler
        this.props.onChange(ev.target.value)
    }

    render(props, state, context) {
        return html`
            ${state.isCustomizing ? html`
                <${Form.Input} ...${props} type="text" value=${props.value} change=${this.onCustomChange} />
            ` : html`
                <${Form.Select}
                        ...${props}
                        options=${{ ...props.options, __custom: '+ Neu' }}
                        change=${this.onChange}
                />
            `}
        `;
    }
}