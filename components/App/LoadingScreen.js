import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * Displaying a fullscreen loading screen
 */
export default class LoadingScreen extends Component {
    render(props, state, context) {
        let style = 'margin-top: 2rem;'
        if(this.props.fullscreen) {
            style = 'height: 100vh; overflow: hidden;'
        }

        let images = ['loader1', 'loader2', 'loader3', 'loader4', 'loader5', 'loader6']
        let image = images[Math.floor(Math.random()*images.length)]

        return html`
            <div class="container" style=${style}>
                <div class="d-flex w-100 h-100 align-items-center justify-content-center">
                    <div class="card">
                        <img src=${window.neopren.baseUrl + '/assets/images/loaders/' + image + '.webp'} alt="Loading"
                             class="card-img-top" />
                        <div class="card-body d-flex align-items-center justify-content-center">
                            <div class="spinner-border text-primary me-4" role="status"></div>
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
