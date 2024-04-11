import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * Pagination component
 *
 * Example usage:
 *
 * <${Pagination} total=${this.state.total}
 *  per_page=${this.state.per_page}
 *  current_page=${this.state.current_page}
 *  last_page=${this.state.last_page}
 *  onPageChange=${this.handlePageChange} />
 *
 *  handlePageChange is a method which accepts the new wanted page number
 */
export default class Pagination extends Component {
    // Initial state
    state = {}

    constructor(props) {
        super(props)
        this.onpagechangehandler = props.onPageChange
        this.renderPaginationItem = this.renderPaginationItem.bind(this)
    }

    goToNextPage = (ev) => {
        ev.preventDefault()
        this.onpagechangehandler(this.next_page)
    }

    goToPreviousPage = (ev) => {
        ev.preventDefault()
        this.onpagechangehandler(this.before_page)
    }

    goToPage = (ev) => {
        ev.preventDefault()
        this.onpagechangehandler(ev.target.dataset.page)
    }

    renderPaginationItem = (props, state, context) => {
        let classname = 'page-item'
        if(props.current_page == props.page) {
            classname = 'page-item active'
        }

        return html`
            <li class=${classname}><a class="page-link" href="#" data-page=${props.page} onclick=${this.goToPage}>${props.page}</a></li>
        `
    }

    renderPaginationDropup = (props, state, context) => {
        let last_page = props.last_page
        let current_page = props.current_page
        return html`
            <li class="page-item">
                <div class="dropup">
                    <a href="#" class="dropdown-toggle no-indicator page-link"
                       data-bs-toggle="dropdown">...</a>
                    <div class="dropdown-menu">
                        <div class="px-4 py-3">
                            <input type="number" min="0" max=${last_page} step="1" value=${current_page}
                                   class="form-control" onkeydown=${e => {
                                       let val = parseInt(e.target.value)
                                if(e.keyCode == 13 && val <= last_page && val > 0) {
                                    // Enter pressed
                                    // Close dropdown
                                    let dropdownMenuElement = e.target.parentElement.parentElement
                                    let dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownMenuElement)
                                    dropdown.hide()

                                    this.onpagechangehandler(val)
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </li>
        `
    }

    render(props, state, context) {
        return html`
            <ul class="pagination justify-content-center">
                <${this.PaginationItems} current_page=${props.current_page} last_page=${props.last_page} />
            </ul>
        `
    }

    PaginationItems = (props, state, context) => {
        let current_page = props.current_page
        let last_page = props.last_page
        let first_page = 1

        this.before_page = current_page - 1
        let before_page_item = 'page-item'
        if(current_page === 1) {
            before_page_item = 'page-item disabled'
            this.before_page = 1
        }

        this.next_page = current_page + 1
        let next_page_item = 'page-item'
        if(current_page === last_page) {
            next_page_item = 'page-item disabled'
            this.next_page = last_page
        }

        // No nav if no page
        if(last_page < 1) {
            return html`
                <li class="page-item disabled"><a class="page-link" href="#">
                    <span class="material-symbols-outlined">navigate_before</span></a>
                </li>
                <li class="page-item disabled">
                    <a class="page-link" href="#">0</a>
                </li>
                <li class="page-item disabled"><a class="page-link" href="#">
                    <span class="material-symbols-outlined">navigate_next</span></a>
                </li>
            `
        }

        // Handle short nav where duplicates would appear (less than 10 pages in total)!
        if(last_page < 10) {
            return html`
                <li class=${before_page_item}><a class="page-link" href="#" onclick=${this.goToPreviousPage}>
                    <span class="material-symbols-outlined">navigate_before</span></a>
                </li>
                
                ${last_page >= 1 && html`<${this.renderPaginationItem} page="1" current_page=${current_page} />`}
                ${last_page >= 2 && html`<${this.renderPaginationItem} page="2" current_page=${current_page} />`}
                ${last_page >= 3 && html`<${this.renderPaginationItem} page="3" current_page=${current_page} />`}
                ${last_page >= 4 && html`<${this.renderPaginationItem} page="4" current_page=${current_page} />`}
                ${last_page >= 5 && html`<${this.renderPaginationItem} page="5" current_page=${current_page} />`}
                ${last_page >= 6 && html`<${this.renderPaginationItem} page="6" current_page=${current_page} />`}
                ${last_page >= 7 && html`<${this.renderPaginationItem} page="7" current_page=${current_page} />`}
                ${last_page >= 8 && html`<${this.renderPaginationItem} page="8" current_page=${current_page} />`}
                ${last_page >= 9 && html`<${this.renderPaginationItem} page="9" current_page=${current_page} />`}
                
                <li class=${next_page_item}><a class="page-link" href="#" onclick=${this.goToNextPage}>
                    <span class="material-symbols-outlined">navigate_next</span></a>
                </li>
            `
        }

        // First 4 + last 4 elements if current page is first +0 ~ +3 or last -0 ~ -3
        if(current_page <= (first_page + 3) || current_page >= (last_page - 3)) {

            // First 5 + last 5 elements if current page is 4th first or last element
            let show_additional = false
            if(current_page === first_page + 3 || current_page === last_page - 3) {
                // Show one additional element
                show_additional = true
            }

            return html`
                <li class=${before_page_item}><a class="page-link" href="#" onclick=${this.goToPreviousPage}>
                    <span class="material-symbols-outlined">navigate_before</span></a>
                </li>
                
                <${this.renderPaginationItem} page="1" current_page=${current_page} />
                <${this.renderPaginationItem} page="2" current_page=${current_page} />
                <${this.renderPaginationItem} page="3" current_page=${current_page} />
                <${this.renderPaginationItem} page="4" current_page=${current_page} />
                ${show_additional && html`<${this.renderPaginationItem} page="5" current_page=${current_page} />`}

                <${this.renderPaginationDropup} current_page=${current_page} last_page=${last_page} />

                ${show_additional && html`<${this.renderPaginationItem} page=${last_page-4} current_page=${current_page} />`}
                <${this.renderPaginationItem} page=${last_page-3} current_page=${current_page} />
                <${this.renderPaginationItem} page=${last_page-2} current_page=${current_page} />
                <${this.renderPaginationItem} page=${last_page-1} current_page=${current_page} />
                <${this.renderPaginationItem} page=${last_page} current_page=${current_page} />
                
                <li class=${next_page_item}><a class="page-link" href="#" onclick=${this.goToNextPage}>
                    <span class="material-symbols-outlined">navigate_next</span></a>
                </li>
            `
        }

        // Any other case
        // Middle nav with 1 ... current-2 ~ current + 2 ... last

        return html`
            <li class=${before_page_item}><a class="page-link" href="#" onclick=${this.goToPreviousPage}>
                <span class="material-symbols-outlined">navigate_before</span></a>
            </li>
            
            <${this.renderPaginationItem} page="1" current_page=${current_page} />

            <${this.renderPaginationDropup} current_page=${current_page} last_page=${last_page} />
            
            <${this.renderPaginationItem} page=${current_page-3} current_page=${current_page} />
            <${this.renderPaginationItem} page=${current_page-2} current_page=${current_page} />
            <${this.renderPaginationItem} page=${current_page-1} current_page=${current_page} />
            <${this.renderPaginationItem} page=${current_page} current_page=${current_page} />
            <${this.renderPaginationItem} page=${current_page+1} current_page=${current_page} />
            <${this.renderPaginationItem} page=${current_page+2} current_page=${current_page} />
            <${this.renderPaginationItem} page=${current_page+3} current_page=${current_page} />

            <${this.renderPaginationDropup} current_page=${current_page} last_page=${last_page} />
            
            <${this.renderPaginationItem} page=${last_page} current_page=${current_page} />
            
            <li class=${next_page_item}><a class="page-link" href="#" onclick=${this.goToNextPage}>
                <span class="material-symbols-outlined">navigate_next</span></a>
            </li>
        `
    }

}
