import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * The main toolbar component for all apps (top / bottom bar)
 *
 * Provide menu items via "menu" props or via "window.toolbar_nav". Element keys: name, icon, url, active
 */
export default class Toolbar extends Component {
    state = {
        first_run: false
    }

    renderNavElement(props) {
        let classname = ''
        if (window.toolbar_active && window.toolbar_active === props.el.active) {
            classname = 'active'
        }

        if (props.el.type && props.el.type === 'modal') {
            // Display modal toggle
            return html`
                <li class=${classname}>
                    <a href="#" class="nav-link text-white" data-bs-toggle="modal" data-bs-target=${props.el.url}>
                        <span class="material-symbols-sharp mi-icon mx-auto d-block">${props.el.icon}</span>
                        ${props.el.name}
                    </a>
                </li>
            `
        }

        if (props.el.sub && props.el.sub.length > 0) {
            // Got sub menu

            // Active?
            let is_active = props.el.sub.filter(function (obj) {
                return obj.active === window.toolbar_active
            })
            if (is_active.length > 0) {
                classname += ' active'
            }

            return html`
                <li class=${classname + " dropdown"}>
                    <a href="#" class="nav-link text-white dropdown-toggle" data-bs-toggle="dropdown">
                        <span class="material-symbols-sharp mi-icon mx-auto d-block">${props.el.icon}</span>
                        ${props.el.name}
                    </a>
                    <ul class="dropdown-menu">
                        ${props.el.sub.map(subel => html`
                            <li>
                                <a href=${window.neopren.baseUrl + subel.url}
                                   class=${(window.toolbar_active && window.toolbar_active === subel.active) ? 'dropdown-item active' : 'dropdown-item'}>
                                    <span class="material-symbols-sharp mi-icon me-2">${subel.icon}</span>
                                    ${subel.name}
                                </a>
                            </li>
                        `)}
                    </ul>
                </li>
            `
        }

        let url = window.neopren.baseUrl + props.el.url
        let target = '_self'
        if (props.el.type && props.el.type == 'external') {
            url = props.el.url
            target = '_blank'
        }

        return html`
            <li class=${classname}>
                <a href=${url} class="nav-link text-white" target=${target}>
                    <span class="material-symbols-sharp mi-icon mx-auto d-block">${props.el.icon}</span>
                    ${props.el.name}
                </a>
            </li>
        `
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            first_run: true
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.first_run) {
            let active_item = document.querySelector('.toolbar-nav li.active')
            if (active_item) {
                // Horizontally scroll to element + space so it's in center
                let offset = document.querySelector('.toolbar-container').clientWidth / 2
                document.querySelector('.toolbar-container').scroll(active_item.offsetLeft - offset, 0)
            }

            this.setState({
                ...this.state,
                first_run: false
            })
        }
    }

    render(props, state, context) {
        let menu_elements = []
        if (props.menu) {
            menu_elements = props.menu
        } else if (window.toolbar_nav) {
            menu_elements = window.toolbar_nav
        }

        return html`
            <div class="toolbar-container">
                <ul class="nav my-0 text-small toolbar-nav">
                    <li>
                        <a href="#" class="nav-link text-white neopren-menu-toggle"
                           onclick=${window.neoprenMenuToggle}>
                            <span class="material-symbols-outlined mi-icon mx-auto d-block">menu</span>
                            Menu
                        </a>
                    </li>

                    ${props.contentNav && html`
                        <li>
                            <a href="#" class="nav-link text-white neopren-content-nav-toggle"
                               onclick=${() => window.neoprenContentMenuToggle()}>
                                <span class="material-symbols-outlined mi-icon mx-auto d-block">workspaces</span>
                                ${props.contentNav}
                            </a>
                        </li>
                    `}

                    ${menu_elements.map(el => html`
                        <${this.renderNavElement} el=${el}/>
                    `)}
                </ul>
            </div>
        `
    }
}