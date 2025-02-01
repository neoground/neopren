import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import DynamicComponent from "./DynamicComponent.js"

const html = htm.bind(h);

/**
 * Modal
 *
 * Props (only id + children required):
 *
 * - size: lg|xl|initial (wanted modal size)
 * - title: string|html
 * - id: string (id of modal)
 * - onClose: optional event handler when close button is pressed (instead of bootstrap's modal hiding)
 * - hideHeader: optional bool if header should be hidden (title + close button)
 * - children: modal content (will be put inside .modal-content)
 * - isstatic: (bool) show static backdrop?
 * - nobackdrop: (bool) show no backdrop?
 */
export default class Modal extends Component {
    state = {}

    static ShowConfirmationModal = (config) => {
        config = {
            confirmText: 'Ok',
            cancelText: 'Abbrechen',
            title: '',
            description: '',
            onConfirm: () => {
            },
            onCancel: (ev) => {
                ev.preventDefault()
                DynamicComponent.hideModal(ev.currentTarget.dataset.modalid)
            },
            style: 'primary',
            id: 'confirm-modal-' + Math.floor(Math.random() * 10000),
            ...config,
        }

        let render_element = document.createElement('div')
        document.body.appendChild(render_element)

        if (render_element !== null) {
            render(html`
                <${Modal.Confirmation}
                        id=${config.id}
                        confirmtext=${config.confirmText}
                        canceltext=${config.cancelText}
                        title=${config.title}
                        onconfirm=${config.onConfirm}
                        oncancel=${config.onCancel}
                        style=${config.style}
                >
                    <span innerHTML=${config.description}/>
                </EXTERNAL_FRAGMENT>
            `, render_element)

            let modalel = document.getElementById(config.id)
            if (modalel) {
                let modal = bootstrap.Modal.getOrCreateInstance(modalel)
                modal.show()
            }
        }
    }

    static Confirmation = (props, state, context) => {
        let cancel_text = 'Abbrechen'
        let confirm_text = 'Ok'

        if (props.confirmtext) {
            confirm_text = props.confirmtext
        }
        if (props.canceltext) {
            cancel_text = props.canceltext
        }

        let style = 'primary'
        if (props.style) {
            style = props.style
        }

        return html`
            <div class="modal fade" tabindex="-1" id=${props.id}>
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><span innerHTML=${props.title}></span></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${props.children}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onClick=${(e) => {
                                props.oncancel(e, props.id)
                            }}
                                    data-modalid=${props.id}>
                                <span class="d-flex" innerHTML=${cancel_text}/></button>
                            <button type="button" class=${"btn text-white btn-" + style} onClick=${(e) => {
                                props.onconfirm(e, props.id)
                            }}
                                    data-modalid=${props.id}>
                                <span class="d-flex" innerHTML=${confirm_text}/></button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    render(props, state, context) {
        let dialog_classes = 'modal-dialog modal-dialog-centered'
        if (props.size && props.size != "initial") {
            dialog_classes += ' modal-' + props.size
        }

        let backdrop = 'true'
        if (props.isstatic) {
            backdrop = 'static'
        }
        if (props.nobackdrop) {
            backdrop = 'false'
        }

        let classes = 'modal fade'
        if (props.show) {
            classes += ' show d-block'
        }

        return html`
            <div class=${classes} tabindex="-1" id=${props.id} data-bs-backdrop=${backdrop}>
                <div class=${dialog_classes}>
                    <div class="modal-content">
                        ${!this.props.hideHeader && html`
                            <div class="modal-header">
                                <h5 class="modal-title"><span innerHTML=${props.title}></span></h5>
                                ${props.onClose ? html`
                                    <button type="button" class="btn-close" onClick=${props.onClose}
                                            aria-label="Close"></button>
                                ` : html`
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                `}
                            </div>`}
                        ${props.children}
                    </div>
                </div>
            </div>
        `
    }

}

