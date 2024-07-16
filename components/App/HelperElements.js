import {h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h);

/**
 * Various helper elements
 */
export default class HelperElements {
    /**
     * Make links clickable (returns html element)
     *
     * Set props escape="false" to prevent HTML escaping in string
     * Set props nl2br="true" to add auto line breaks
     *
     * @param props
     * @returns {*}
     */
    static clickableLinks = (props) => {
        let content = props.children
        if (!content) {
            return html`<span></span>`
        }
        if (props.escape !== "false") {
            content = this.escapeHtml(content)
        }
        if (props.nl2br === "true") {
            content = content.replaceAll("\n", "<br />")
        }

        // Make links clickable
        content = content.replaceAll(/(http:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
        content = content.replaceAll(/(https:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")

        return html`<span innerHTML=${content}/>`
    }

    /**
     * Escape HTMl in a string
     *
     * @see https://stackoverflow.com/a/6234804/6026136
     * @param unsafe
     * @returns {*}
     */
    static escapeHtml = (unsafe) => {
        return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    static zipEntry = (props, state, context) => {
        let el = props.el
        return html`
            <strong class="me-2">${el.zip}</strong> ${el.city} <br/>
            <span class="small text-muted">${el.area} • ${el.state}</span>
        `
    }
}