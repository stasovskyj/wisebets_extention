const API_ROOT = "https://forkmaster.pp.ua/api/";
const ACCOUNTS_URI = "scapegoat/accounts/";
const ACCOUNT_URI = "account/";
const IPTRACKER_URI = "iptracker/track/";
const SITES_CONFIG = {
    'pinnacle': {
        betslip: {
            rootElement: document.body, // Кореневий елемент для відслідковування
            betSlipElement: 'div.collapse-content', // Селектор елементу betslip
            amountInputElement: '.style_inputBox___VsYU input', // Сума
            oddsElement: 'div[data-test-id="SelectionDetails-Odds"] span', // коефіцієнт
            placeBetElement: 'button[data-test-id="Betslip-ConfirmBetButton"]',
            cancelBetElement:'.betslip-close-button', // закрити купон
            currentAmountElement:'span[data-test-id="QuickCashier-BankRoll"]' // залишок на рахунку
        }
    },
    'favbet': {
        betslip: {
            rootElement: document.body,
            betSlipElement: 'div[data-role="c-betSlip"]',
            amountInputElement: 'input[data-role="betslip-bet-sum-input"]',
            oddsElement: 'span[data-role="betslip-outcome-coef"]',
            placeBetElement: 'button[data-test-id="Betslip-ConfirmBetButton"]',
            cancelBetElement:'',
            currentAmountElement:''
        }
    },
    'sportsbet': {
        betslip: {
            rootElement: document.body,
            betSlipElement: 'div.BetslipContents__StyledWrapper-sc-w4swdg-0',
            amountInputElement: 'input[data-test-id="betslip-moneyInputField"]',
            oddsElement: '.BetslipContents__StyledInner-sc-w4swdg-1 span.FormattedOdds__OddsWrapper-sc-dio9ku-0',
            placeBetElement: 'button.wrappers__MultilineButton-sc-caw8ue-2',
            cancelBetElement:'',
            currentAmountElement:'span[data-testid="balance-amount"]',
        }
    },
    'betonline': {
        betslip: {
            rootElement: document.body,
            betSlipElement: '', 
            amountInputElement: '',
            oddsElement: '',
            placeBetElement: '',
            cancelBetElement:'',
            currentAmountElement:''
        }
    },
    'sportsbetting': {
        betslip: {
            rootElement: document.body,
            betSlipElement: '',
            amountInputElement: '',
            oddsElement: '',
            placeBetElement: '',
            cancelBetElement:'',
            currentAmountElement:'button.userBalance'
        }
    },
    'stake': {
        betslip: {
            betSlipElement: 'div[data-test="betslip-bet"]',
            amountInputElement: 'input[data-test="input-bet-amount"]',
            oddsElement: 'span.odds-payout div.odds span',
            placeBetElement: '',
            cancelBetElement:'',
            currentAmountElement:'.currency span span'
        }
    },
    'cloudbet': {
        betslip: {
            rootElement: document.body,
            betSlipElement: 'div[data-component="quick-betslip-card"]',
            amountInputElement: 'input[data-component="betslip-input-field"]',
            oddsElement: 'div[data-component="quick-betslip-odds"]',
            placeBetElement: '',
            cancelBetElement:'',
            currentAmountElement:'p[data-dd-action-name="AccountButton balance"]'
        }
    },
};
const CALC_CONTENT = `<div id="calc-container" class="calc-container">
<div class="calc-card">
    <div class="card-body">
        <form class="calc">
            <div class="calc-form-row">
                <label for="amountA">Сума:</label>
                <input type="number" id="amountA" name="amountA" class="calc-form-control" step="0.01"
                    inputmode="decimal">
            </div>
            <div class="calc-form-row">
                <label for="coefficientA">Коеф A:</label>
                <input type="number" id="coefficientA" name="coefficientA" class="calc-form-control" step="0.001"
                    inputmode="decimal">
            </div>
            <div class="calc-form-row">
                <label for="coefficientB">Коеф B:</label>
                <input type="number" id="coefficientB" name="coefficientB" class="calc-form-control" step="0.001"
                    inputmode="decimal">
            </div>
            <div class="calc-form-row">
                <label for="factAmount">Закрив B:</label>
                <input type="number" id="factAmount" name="factAmount" class="calc-form-control" step="0.01"
                    inputmode="decimal">
            </div>
            <div class="calc-form-row">
                <label for="amountB">Сума B:</label>
                <input type="decimal" id="amountB" step="0.01" class="calc-form-control" name="amountB" readonly>
            </div>
            <div class="calc-form-row">
                <label for="remainAmount">Відкрито</label>
                <input type="decimal" id="remainAmount" step="0.01" class="calc-form-control" name="remainAmount"
                    readonly>
            </div>
            <div class="calc-form-row">
                <label for="profit">Прибуток:</label>
                <input type="decimal" id="profit" step="0.01" class="calc-form-control" name="profit" readonly>
            </div>
        </form>
    </div>
</div>
</div>`;