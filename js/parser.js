class Parser {
    constructor(initInstance) {
        this.keyWord = 'Stake';
        this.numbRegExp = /\d+/g;
        this.currentAmountElement = initInstance.nodeElements.currentAmountElement
        this.unsettledBetsElement = initInstance.nodeElements.unsettledBetsElement

    }
   
    parseBalanse() {
        let data = document.querySelector(this.currentAmountElement).innerText ?? false
        return parseFloat(data.replace(/[^\d.,]+/g, '').replace(',', '.'));

    }
 
    parseUnsettledBets() {

        const betElements = document.querySelectorAll(this.unsettledBetsElement);
        if (!betElements) {
            return false
        }
        const totalBets = Array.from(betElements).reduce((acc, item) => {
            item.innerText.split('\n').forEach((itemInner, i, arr) => {
                const value = arr[i + 1];

                if (itemInner.includes(this.keyWord) && typeof value === 'string') {
                    const arrValues = (() => {
                        const res = value.match(this.numbRegExp);
                        if (!res) {
                            return itemInner.match(this.numbRegExp);
                        }

                        return res;
                    })();

                    acc += parseFloat(arrValues?.join('.') || '0');
                }
            });

            return acc;
        }, 0);
        return totalBets
    }
}
