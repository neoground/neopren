import {h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import '../../node_modules/dayjs/locale/de.js'

const html = htm.bind(h)

/**
 * Dynamic components handling (e.g. bootstrap modals)
 */
export default class DynamicComponent {

    static showModal = (id) => {
        return this.changeModal('show', id)
    }

    static toggleModal = (id) => {
        return this.changeModal('toggle', id)
    }

    static hideModal = (id) => {
        return this.changeModal('hide', id)
    }

    static changeModal = (action, id) => {
        let modal = document.getElementById(id)
        if (modal) {
            let bsModal = bootstrap.Modal.getOrCreateInstance(modal)

            if (action == 'show') {
                bsModal.show()
            } else if (action == 'hide') {
                bsModal.hide()
            } else if (action == 'toggle') {
                bsModal.toggle()
            }

            return bsModal
        }

        return false
    }

    static showToast = (id) => {
        let el = document.getElementById(id)
        if (el !== null) {
            let toast = bootstrap.Toast.getOrCreateInstance(el)
            if (toast !== null) {
                toast.show()
                return toast
            }
        }

        return false
    }

    static hideToast = (id) => {
        let el = document.getElementById(id)
        if (el !== null) {
            let toast = bootstrap.Toast.getOrCreateInstance(el)
            if (toast !== null) {
                toast.hide()
                return toast
            }
        }

        return false
    }

}