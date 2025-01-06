class DownloadManager {
    constructor() {
        this.downloads = {};
        this.subscribers = [];
        if(window.neoapi) {
            this.initializeListeners();
        }
    }

    initializeListeners() {
        // Listen for download progress
        window.neoapi.onDownloadProgress((data) => {
            const { downloadsPath, fileName, progress, totalBytes } = data;
            if (!this.downloads[fileName]) {
                this.downloads[fileName] = { path: downloadsPath, progress: 0, totalBytes, status: 'downloading' };
            }
            this.updateDownload(fileName, progress);
        });

        // Listen for download completion
        window.neoapi.onDownloadComplete((data) => {
            const { fileName } = data;
            if (this.downloads[fileName]) {
                this.downloads[fileName].status = 'completed';
                this.notifySubscribers();
            }
        });

        // Listen for download errors
        window.neoapi.onDownloadError((data) => {
            const { fileName, state } = data;
            if (this.downloads[fileName]) {
                this.downloads[fileName].status = `error (${state})`;
                this.notifySubscribers();
            }
        });
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter((cb) => cb !== callback);
        };
    }

    notifySubscribers() {
        this.subscribers.forEach((cb) => cb(this.downloads));
    }

    updateDownload(fileName, progress) {
        if (this.downloads[fileName]) {
            this.downloads[fileName].progress = progress;
            if (progress >= 100) {
                this.downloads[fileName].status = 'completed';
            }
            this.notifySubscribers();
        }
    }

    clearDownloads() {
        // Filter out active downloads and keep only those
        this.downloads = Object.fromEntries(
            Object.entries(this.downloads).filter(([key, download]) => download.status === 'downloading')
        );
        this.notifySubscribers();
    }

    getOverallProgress() {
        const activeDownloads = Object.values(this.downloads).filter((d) => d.status === 'downloading');
        const totalProgress = activeDownloads.reduce((sum, d) => sum + d.progress, 0);
        return activeDownloads.length ? totalProgress / activeDownloads.length : 0;
    }
}

const downloadManager = new DownloadManager();
export default downloadManager;
