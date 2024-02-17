import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h);

/**
 * Toast
 *
 * Show it via DynamicComponent.showToast(id)
 *
 * Props:
 *
 * - title: string
 * - icon: string (optional)
 * - id: string (id of toast)
 * - date: string (small date below title, optional)
 * - children: toast content (will be put inside .toast-content)
 */
export default class Toast extends Component {
    render(props, state, context) {
        let dialog_classes = 'modal-dialog modal-dialog-centered'
        if(props.size && props.size != "initial") {
            dialog_classes += ' modal-' + props.size
        }

        return html`
            <div class="toast fade" role="alert" aria-live="assertive" aria-atomic="true" id=${props.id}>
                <div class="toast-header">
                    ${props.icon && html`<span class="material-icons-outlined me-2">${props.icon}</span>`}
                    <strong class="me-auto">${props.title}</strong>
                    ${props.date && html`<small>${props.date}</small>`}
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${props.children}
                </div>
            </div>
        `
    }

}

