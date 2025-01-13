import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'

const html = htm.bind(h)

/**
 * The nav part of aside
 *
 * Props:
 * - active (key of active nav element)
 */
export default class AsideNav extends Component {
    // Initial state
    state = {
        nav_elements: [
            {
                name: 'Home',
                icon: 'home',
                url: '/',
                active: 'index'
            }
        ]
    }

    Subnav = (props, state, context) => {
        let el = props.el
        let sub = el.sub

        let classes = 'w-100 collapse ps-3 small'
        if(props.active) {
            classes += ' show'
        }



        return html`
            <li class=${classes} id=${'nav-subsection-' + el.active}>
                <ul class="list-unstyled">
                    ${sub && sub.map(el => html`
                        <${this.SubnavEntry} sub=${el} />
                    `)}
                </ul>
            </li>
        `
    }

    SubnavEntry = (props, state, context) => {
        let sub = props.sub

        let linkclasses = 'nav-link d-flex align-items-center text-white'
        if(this.props.toolbar_active && this.props.toolbar_active === sub.active) {
            linkclasses += ' active'
        }

        return html`
            <li class="nav-item">
                <a href=${window.neopren.baseUrl + sub.url} class=${linkclasses}>
                    <span class="material-symbols-outlined mi-icon me-3">${sub.icon}</span> ${sub.name}
                    <div class="ms-auto d-flex">
                        <a href=${window.neopren.baseUrl + sub.url} target="_blank"
                           class="btn btn-icon ext-btn" onClick=${this.openLinkInNewWindow}>
                            <span class="material-symbols-outlined icon-1x text-white">open_in_new</span>
                        </a>
                        ${sub.badge && html`<span class="badge bg-primary">${sub.badge}</span>`}
                    </div>
                </a>
            </li>
        `
    }

    toggleSubnav = ev => {
        ev.preventDefault()
        let collapse = bootstrap.Collapse.getOrCreateInstance(ev.currentTarget.dataset.target)
        collapse.toggle()
    }

    NavDropdownToggle = (props, state, context) => {
        let el = props.el
        return html`
            <button class="btn btn-icon p-0" type="button" data-target=${'#nav-subsection-' + el.active} 
                    onClick=${this.toggleSubnav}>
                <span class="material-symbols-outlined mi-icon opacity-25">expand_more</span>
            </button>
        `
    }

    openLinkInNewWindow = ev => {
        // Get href from clicked link
        let href = ev.currentTarget.getAttribute('href')
        if(href && window.neoapi) {
            ev.preventDefault()
            window.neoapi.send("newWindow", href)
        }
        // No electron -> classic style, just follow the link...
    }

    /**
     * Render a single nav element
     *
     * @param props
     * @returns {*}
     */
    renderNavElement = (props) => {
        let el = props.el
        let active = false

        let classes = 'nav-link d-flex align-items-center text-white'
        if(this.props.active && this.props.active === el.active) {
            active = true
            classes += ' active'
        }

        if(el.type && el.type === 'subheader') {
            return html`
                <li class="subheader px-3">
                    <span>${el.name}</span>
                </li>
            `
        }

        return html`
            <li class="nav-item">
                <a href=${window.neopren.baseUrl + el.url} class=${classes}>
                    <span class="material-symbols-outlined mi-icon me-3">${el.icon}</span> ${el.name}
                    <div class="ms-auto d-flex">
                        <a href=${window.neopren.baseUrl + el.url} target="_blank"
                           class="btn btn-icon ext-btn" onClick=${this.openLinkInNewWindow}>
                            <span class="material-symbols-outlined icon-1x text-white">open_in_new</span>
                        </a>
                        ${el.badge && html`<span class="badge bg-primary">${el.badge}</span>`}
                        ${el.sub && html`<${this.NavDropdownToggle} el=${el} />`}
                    </div>
                </a>
            </li>

            ${el.sub && html`<${this.Subnav} el=${el} active=${active} />`}
        `
    }

    render(props, state, context) {
        return html`
            <ul class="nav nav-pills mb-auto" style="overflow-y: auto" data-simplebar>
                ${this.state.nav_elements && this.state.nav_elements.map(el => html`
                    <${this.renderNavElement} el=${el} />
                `)}
            </ul>
        `
    }

}
