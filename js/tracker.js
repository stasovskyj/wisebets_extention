class IpTracker extends Base {
    constructor(initInstance) {
        super()
        this.initInstance = initInstance;
        this.requestTimeout = 60000;
        this.track();
    }
    track() {
        setInterval(() => {
            this.sendToRemoteServer(this.initInstance.currentSiteData.id, this.initInstance.config.apiKey);
        }, this.requestTimeout);
    }
    check() {
        
    }

    async sendToRemoteServer(id, apiKey) {
        const url = `${API_ROOT}${IPTRACKER_URI}?api-key=${apiKey}&id=${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                this.initInstance.sendMessageToServiceWorker({
                    action: 'notification',
                    message: this.getTranslation('send_error')
                });
            } else {
                console.log(this.getTranslation('send_success'));
            }
        } catch (error) {
            console.error(this.getTranslation('send_error'), error);
        }
    }
}