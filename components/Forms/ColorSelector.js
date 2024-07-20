import {Component, createRef, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Form from "../App/Form.js"

const html = htm.bind(h)

/**
 * Color selector element
 *
 * Props:
 *
 * - onSelect (callback with color name OR custom hex code as parameter + optional fields list as string)
 * - color (selected color)
 * - custom_color (custom color hex code if color is 'custom')
 */
export default class ColorSelector extends Component {
    state = {
        colors: ['blue-grey', 'red', 'pink', 'purple', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'amber', 'orange'],
        color_shades: [200, 400, 600, 800],
    }

    dropdownRef = createRef()

    onColorSelect = ev => {
        ev.preventDefault()
        let color = ev.currentTarget.dataset.color
        this.props.onSelect(color, this.props.fields)
        if (color != 'custom') {
            let dropdown = bootstrap.Dropdown.getOrCreateInstance(this.dropdownRef.current)
            dropdown.hide()
        }
    }

    onCustomInput = ev => {
        ev.preventDefault()
        this.props.onSelect(ev.target.value, this.props.fields)
    }

    ColorButton = (props, state, context) => {
        let btnclass = 'btn btn-outline-primary color-select-btn'
        if (props.selected == props.color || (props.color == 'default' && props.selected == '')) {
            btnclass = 'btn btn-primary color-select-btn'
        }

        // Special case: Default entry
        if (props.color == 'default') {
            return html`
                <div class="mb-2">
                    <button type="button" class=${btnclass} onClick=${this.onColorSelect} data-color="">
                        <span class="material-symbols-outlined text-black white-on-dark"
                              style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">circle</span>
                    </button>
                </div>
            `
        }

        return html`
            <div class="mb-2">
                <button type="button" class=${btnclass} onClick=${this.onColorSelect} data-color=${props.color}>
                    <span class=${"material-symbols-outlined text-" + props.color}
                          style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">circle</span>
                </button>
            </div>
        `
    }

    SelectedColorIcon = (props, state, context) => {
        if (props.color == 'custom') {
            return html`
                <span class="material-symbols-outlined" 
                      style=${"font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; color: " + props.custom_color}>circle</span>
            `
        }

        if (!props.color || props.color == '') {
            return html`
                <span class="material-symbols-outlined text-black white-on-dark"
                      style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">circle</span>
            `
        }

        return html`
            <span class=${"material-symbols-outlined text-" + props.color}
                  style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">circle</span>
        `
    }

    render(props, state, context) {
        return html`
            <div class="dropdown">
                <button class="btn btn-secondary btn-icon dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        data-bs-auto-close="outside" aria-expanded="false" ref=${this.dropdownRef}>
                    <${this.SelectedColorIcon} color=${this.props.color} custom_color=${this.props.custom_color}/>
                </button>
                <div class="dropdown-menu" style="width: 300px; max-height: 300px; overflow-y: auto">
                    <div class="row m-0">

                        <div class="col-3 text-center">
                            <${this.ColorButton} color="default" selected=${this.props.color}/>
                        </div>
                        <div class="col-9"></div>

                        ${Object.entries(this.state.colors).map(([k, color]) => html`
                            ${Object.entries(this.state.color_shades).map(([ka, shade]) => html`
                                <div class="col-3 text-center">
                                    <${this.ColorButton} color=${color + "-" + shade} selected=${this.props.color}/>
                                </div>
                            `)}
                        `)}
                        <div class="col-6">
                            <div>
                                <button type="button"
                                        class=${this.props.color == 'custom' ? 'btn btn-primary w-100' : 'btn btn-outline-primary w-100'}
                                        onClick=${this.onColorSelect} data-color="custom">
                                    Eigene
                                </button>
                            </div>
                        </div>
                        <div class="col-6 d-flex align-items-center">
                            ${this.props.color == 'custom' && html`
                                <${Form.Input} type="color" name="custom_color" value=${this.props.custom_color}
                                               change=${this.onCustomInput}
                                               params=${JSON.stringify({style: 'height: 100%;'})}/>
                            `}
                        </div>

                    </div>
                </div>
            </div>
        `
    }

}