import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'

const html = htm.bind(h)

/**
 * Page header with dynamic background
 *
 * Props:
 *
 * - backgroundImage (optional URL to background image. Keep empty to use dynamic one)
 * - style (optional CSS style parameters)
 */
export default class PageHeader extends Component {
    render(props, state, context) {
        let classes = ''
        if (props.class) {
            classes = props.class
        }

        let style = ''
        if (props.backgroundImage) {
            style = 'background-image: url("' + props.backgroundImage + '"); background-size: cover;'
        } else {
            classes += ' dynamic-bg'
        }

        if (props.style) {
            style += props.style
        }

        return html`
            <div class=${"page-header " + classes} style=${style}>
                <div class="container">
                    ${props.children}
                </div>
            </div>
        `
    }
}
