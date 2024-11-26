import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'

const html = htm.bind(h)

/**
 * Page header with dynamic background
 */
export default class PageHeader extends Component {
    render(props, state, context) {
        let classes = ''
        if (props.class) {
            classes = props.class
        }

        return html`
            <div class=${"page-header dynamic-bg " + classes}>
                <div class="container">
                    ${props.children}
                </div>
            </div>
        `
    }
}
