import {Component, createRef, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * Material icons selector element
 *
 * Props:
 *
 * - onSelect (callback with icon name as parameter)
 * - icon (selected icon)
 */
export default class IconSelector extends Component {
    state = {
        icons: {
            common: [
                'info', 'schedule', 'help', 'language', 'lock', 'warning', 'error', 'verified', 'build',
                'celebration', 'notifications', 'campaign', 'circle', 'category', 'pending'
            ],
            business: [
                'shopping_cart', 'shopping_bag', 'credit_card', 'storefront',
                'work', 'analytics', 'insights', 'calculate', 'savings', 'receipt',
                'shopping_basket', 'leaderboard', 'wallet', 'euro', 'meeting_room', 'paid', 'schema', 'cases',
                'store', 'redeem'
            ],
            communication: [
                'mail', 'call', 'chat', 'forum', 'hub', 'contacts'
            ],
            maps: [
                'pin_drop', 'map', 'local_mall', 'business_center', 'restaurant_menu', 'factory', 'medical_services',
                'local_activity', 'emergency', 'layers', 'navigation', 'local_police'
            ],
            travel: [
                'spa', 'cottage', 'hotel', 'local_cafe', 'apartment', 'pool', 'local_bar', 'local_dining',
                'icecream', 'bakery_dining', 'casino', 'attractions', 'golf_course', 'nightlife', 'fitness_center'
            ],
            transportation: [
                'flight', 'directions_bus', 'directions_bike', 'sailing', 'tram', 'local_shipping', 'rocket'
            ],
            activities: [
                'school', 'science', 'water', 'construction', 'storm'
            ],
            photos: [
                'photo_camera', 'filter_alt', 'image', 'tune', 'timer', 'palette', 'brush', 'nature', 'camera',
                'landscape', 'adjust', 'flash_on'
            ],
            audiovideo: [
                'mic', 'videocam', 'music_note', 'replay', 'stop', 'repeat', 'shuffle', 'radio', 'movie', 'speed'
            ],
            security: [
                'badge', 'verified_user', 'report', 'security', 'shield', 'key'
            ],
            social: [
                'person', 'group', 'public', 'handshake', 'face', 'rocket_launch', 'psychology',
                'eco', 'pets', 'water_drop', 'mood', 'diamond', 'forest', 'sentiment_very_satisfied',
                'sentiment_satisfied', 'group_work', 'recommend', 'quiz', 'favorite', 'star', 'check_circle',
            ],
            text: [
                'apps', 'folder', 'article', 'fact_check', 'feed', 'newspaper', 'cloud', 'menu_book', 'book'
            ],
            hardware: [
                'save', 'smartphone', 'print', 'computer', 'devices', 'dns', 'memory', 'tv', 'power', 'scale',
                'router', 'headphones'
            ],
            household: [
                'house', 'bed', 'chair', 'coffee', 'sensors', 'child_care', 'grass', 'shower', 'kitchen',
                'bathtub', 'yard', 'light', 'window', 'dining', 'coffee_maker', 'outdoor_grill', 'ac_unit'
            ],
        }
    }

    dropdownRef = createRef()

    onIconSelect = ev => {
        ev.preventDefault()
        this.props.onSelect(ev.currentTarget.dataset.name)
        let dropdown = bootstrap.Dropdown.getOrCreateInstance(this.dropdownRef.current)
        dropdown.hide()
    }

    render(props, state, context) {
        let btn_classes = 'btn btn-icon w-100 justify-content-center'

        return html`
            <div class="dropdown">
                <button class="btn btn-secondary btn-icon dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        data-bs-auto-close="outside" aria-expanded="false" ref=${this.dropdownRef}>
                    ${this.props.icon ? html`
                        <span class="material-symbols-outlined">${this.props.icon}</span>
                    ` : html`<span class="material-symbols-outlined">pending</span> Keins`}
                </button>
                <div class="dropdown-menu" style="width: 400px; max-height: 400px; overflow-y: auto">
                    <div class="row m-0">
                        <div class="col-5 mb-1">
                            <button type="button" title="Standard" data-name=""
                                    class=${this.props.icon == "" ? btn_classes + " btn-primary" : btn_classes}
                                    onClick=${this.onIconSelect}>
                                <span class="material-symbols-outlined white-on-dark m-0">trip_origin</span>
                                <span class="ms-2">Standard</span>
                            </button>
                        </div>

                        ${Object.entries(this.state.icons).map(([catname, entries]) => html`
                            <div class="col-12">
                                <span class="small text-muted text-capitalize">${catname}</span>
                            </div>
                            ${Object.entries(entries).map(([k, entry]) => html`
                                <div class="col-2 mb-1">
                                    <button type="button" title=${entry} data-name=${entry}
                                            class=${this.props.icon == entry ? btn_classes + " btn-primary" : btn_classes}
                                            onClick=${this.onIconSelect}>
                                        <span class="material-symbols-outlined white-on-dark m-0">${entry}</span>
                                    </button>
                                </div>
                            `)}
                        `)}
                    </div>
                </div>
            </div>
        `
    }

}