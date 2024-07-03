class Initialization extends Base {
    constructor() {
        super();
        //this.siteConfig = siteConfig;
        this.hostname = window.location.hostname;
        this.config = undefined;
        this.currentSiteData = undefined;
        this.nodeElements = undefined;
        this.parser = null;

    }

    getCurrentSiteData(data) {
        const result = data.find(item => this.hostname.includes(item.name.toLowerCase()));

        return result || (this.sendMessageToServiceWorker({
            action: 'notification',
            message: this.getTranslation('account_not_found'),
        }), null);
    }

    getCurrentSiteElements() {
        return SITES_CONFIG[
            Object.keys(SITES_CONFIG).find(item => this.hostname.includes(item))
        ] || this.sendMessageToServiceWorker({
            action: 'notification',
            message: this.getTranslation('elements_not_found'),
        });
    }

    addListeners() {
        // команди від service worker
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'parse_unsettled_bets':
                    console.log(this.parser.parseUnsettledBets());
                    console.log('Парсим нерозраховані ставки');
                    break;
                case 'parse_balance':
                    console.log('Парсим залишок коштів');
                    console.log(this.parser.parseBalanse());
                    break;
            }

            //sendResponse({ response: 'Команда отримана' });

            //return true;
        });

        return this;
    }

    async init() {
        this.addListeners();

        const config = await chrome.storage.sync.get();

        if (Object.keys(config).length !== 0) {
            this.config = config;
            this.currentSiteData = this.getCurrentSiteData(config.accounts);
            this.nodeElements = this.getCurrentSiteElements();
            new IpTracker(this);
            new CalcHelper(this);
            this.parser = new Parser(this);
            return;
        }

        this.sendMessageToServiceWorker({
            action: 'notification',
            message: this.getTranslation('no_accounts_options'),
        });
    }
}

(async () => {
    try {
        const initInstance = new Initialization();
        await initInstance.init();
        console.log(initInstance)
    } catch (error) {
        console.error(error);
    }
})();
