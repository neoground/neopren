import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * Displaying a fullscreen loading screen
 */
export default class LoadingScreen extends Component {
    render(props, state, context) {
        return html`
            <div class="container" style="height: 100vh; overflow: hidden;">
                <div class="d-flex w-100 h-100 align-items-center justify-content-center">
                    <div class="card">
                        <img src=${window.neopren.baseUrl + '/assets/images/loading.webp'} alt="Loading"
                             class="card-img-top"/>
                        <div class="card-body d-flex align-items-center justify-content-center">
                            <div class="spinner-border text-primary me-3" role="status"></div>
                            <h2 class="h2">
                                Loading...
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}
