import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import downloadManager from './DownloadManager.js'

const html = htm.bind(h)

export class DownloadButton extends Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            overallProgress: 0,
            hasActiveDownloads: false,
        };
    }

    componentDidMount() {
        this.unsubscribe = downloadManager.subscribe((downloads) => {
            const overallProgress = downloadManager.getOverallProgress();
            const hasActiveDownloads = Object.values(downloads).some((d) => d.status === 'downloading');
            this.setState({
                overallProgress,
                hasActiveDownloads,
                visible: hasActiveDownloads || Object.keys(downloads).length > 0
            });
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    render(props, state, context) {
        const {visible, overallProgress, hasActiveDownloads} = this.state;

        if (!visible) return null;

        let icon_style = 'text-muted'
        if(hasActiveDownloads) {
            icon_style = 'text-info'
        }

        let progress_style = 'position-absolute start-0 bottom-0 w-100'
        if(hasActiveDownloads) {
            progress_style += ' bg-info'
        }

        let btn_class = ''
        if(this.props.active) {
            btn_class = 'is-active'
        }

        return html`
            <a class=${"position-relative me-2 " + btn_class}
                    style="background: transparent; cursor: pointer"
                    onClick=${this.props.onToggle}>
        <span class=${"material-symbols-outlined " + icon_style}>download</span>
                <div class=${progress_style} style="height: 3px;
            transform: scaleX(${overallProgress / 100});
            transform-origin: left;
            transition: transform 0.2s ease-in-out;
          "></div>
            </a>
        `;
    }
}
