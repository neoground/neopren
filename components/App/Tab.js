import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * Tab components
 */
export default class Tab {
    /**
     * Nav component for rendering a navigation bar with buttons.
     *
     * Props:
     * - items (array which contains an object per nav item. Each nav item has: id, label (html), active (bool)
     * - onClick (event trigger for onClick events on each button)
     *
     * @param {Object} props - The properties for the Nav component.
     * @param {Object} state - The state for the Nav component.
     * @param {Object} context - The context for the Nav component.
     * @returns {Object} - The navigation bar component.
     */
    static Nav = (props, state, context) => {
        return html`
            <nav>
                <div class="nav nav-pills nav-fill" id="nav-tab" role="tablist">
                    ${Object.entries(props.items).map(([k, v]) => html`
                        <button class=${v.active ? "nav-link active btn-icon justify-content-center white-on-dark" 
                                : "nav-link btn-icon justify-content-center white-on-dark"} 
                                id=${v.id + "-tab"}
                                data-bs-toggle="tab"
                                data-bs-target=${"#" + v.id} 
                                type="button" 
                                role="tab" 
                                onClick=${props.onClick}
                                aria-selected=${v.active ? "true" : "false"}>${v.label}</button>
                    `)}
                </div>
            </nav>
        `
    }

    /**
     * Represents a Tab Pane component.
     *
     * @param {Object} props - The properties for the Pane component.
     * @param {boolean} props.active - Indicates whether the pane is active or not.
     * @param {string} props.id - The unique identifier for the pane (same id as in nav item).
     * @param {Object} props.children - The content inside the pane.
     *
     * @param {Object} state - The state of the component.
     * @param {Object} context - The context of the component.
     * @returns {Object} - The rendered Pane component.
     */
    static Pane = (props, state, context) => {
        return html`
            <div class=${props.active ? "tab-pane fade show active" : "tab-pane fade"}
                 id=${props.id} role="tabpanel"
                 aria-labelledby=${props.id + "-tab"}>
                ${props.children}
            </div>
        `
    }

}

