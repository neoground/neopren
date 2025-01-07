import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import downloadManager from './DownloadManager.js'
import Format from "../App/Format.js"

const html = htm.bind(h)

export default class DownloadBox extends Component {
    constructor() {
        super();
        this.state = {
            downloads: {},
        };
    }

    componentDidMount() {
        this.unsubscribe = downloadManager.subscribe((downloads) => this.setState({downloads}));
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    openFile(event, download, filename) {
        if(event) {
            event.preventDefault()
        }

        if(download.status === 'completed') {
            window.neoapi.openExternal(download.path + '/' + filename);
        }
    }

    openDir(event, download) {
        event.preventDefault()
        window.neoapi.openExternal(download.path)
    }

    clearDownloads() {
        downloadManager.clearDownloads()
        this.props.onclear()
    }

    DownloadItem = (props, state, context) => {
        let download = props.download

        let linkclasses = 'list-group-item list-group-item-action align-items-center'
        if(download.status === 'downloading') {
            linkclasses += ' is-new'
        }

        return html`
            <a class=${linkclasses} href="#" onClick=${e => this.openFile(e, download, props.filename)}>
                <div class="w-100">
                    <div style="line-height: 1.2" class="mb-2">${props.filename}</div>
                    ${download.status === 'downloading' ? html`
                        <div class="progress">
                            <div class="progress-bar"
                                 role="progressbar"
                                 style="width: ${download.progress}%"
                                 aria-valuenow="${download.progress}"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                                ${download.progress}%
                            </div>
                        </div>
                    ` : html`
                        <div class=${`badge ${download.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>
                            ${download.status === 'completed' ? html`Fertig - ${Format.Bytes(download.totalBytes)}` : download.status}
                        </div>
                    `}
                </div>
            </a>
        `
    }

    render(props, state, context) {
        const {downloads} = this.state;
        const downloadList = Object.keys(downloads);
        let firstDownload = downloads[downloadList[0]]

        if (!this.props.visible) return null;

        return html`
            <div class="mb-auto">
                <div class="d-flex align-items-center justify-content-between mt-1 mb-2">
                    <h5 class="m-0">Downloads</h5>
                    
                    <div class="d-flex">
                        ${firstDownload && html`
                            <button class="btn btn-secondary btn-icon me-2" title="Open download folder"
                                    onClick=${e => this.openDir(e, firstDownload)}>
                                <span class="material-symbols-outlined icon-1-25x text-white m-0">folder</span>
                            </button>
                        `}
                        <button class="btn btn-warning btn-icon" title="Clear all downloads"
                                onClick=${() => this.clearDownloads()}
                                disabled=${!Object.values(this.state.downloads).some(
                                        (download) => ['completed', 'error'].includes(download.status)
                                )}>
                            <span class="material-symbols-outlined icon-1-25x text-white m-0">mop</span>
                        </button>
                    </div>
                </div>
                <div class="list-group notifications" style="overflow-y: auto" data-simplebar>
                    ${downloadList.reverse().map((fileName) => {
                        const download = downloads[fileName];
                        return html`
                            <${this.DownloadItem} download=${download} filename=${fileName} />
                        `;
                    })}
                </div>
            </div>
        `;
    }
}
