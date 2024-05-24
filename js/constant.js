const API_ROOT = "https://forkmaster.pp.ua/api/";
const ACCOUNTS_URI = "scapegoat/accounts/";
const ACCOUNT_URI = "account/";
const IPTRACKER_URI = "iptracker/track/";
const WSS = "wss://wisebets.pp.ua/ws/";
const SITES_CONFIG = {
    'pinnacle': {
        currentAmountElement: 'span[data-test-id="QuickCashier-BankRoll"]',
        betslip: {
            rootElement: '#unified-betslip', // Кореневий елемент для відслідковування
            betSlipElement: 'div.collapse-content', // Селектор елементу betslip
            amountInputElement: '[placeholder="Stake"]', // Сума
            oddsElement: 'div[data-test-id="SelectionDetails-Odds"] span', // коефіцієнт
            betAcceptedElement:'[class^="style_acceptedBet"]' // Елемент прийнятої ставки
        }
    },
    'betvictor': {
        currentAmountElement: '.site-header-balance__main-balance span',
        betslip: {
            rootElement: '[id="full-betslip"]',
            betSlipDataElement: '.betslip_bet-list',
            amountInputElement: 'data-cy="stake-input"',
            oddsElement: '.odds-price',
            placeBetElement: '[data-testid="betslip-submit"]',
            betAcceptedElement: '.betslip__button-reuse'
        }
    },
    'favbet': {
        currentAmountElement: '',
        betslip: {
            rootElement: document.body,
            betSlipElement: 'div[data-role="c-betSlip"]',
            amountInputElement: 'input[data-role="betslip-bet-sum-input"]',
            oddsElement: 'span[data-role="betslip-outcome-coef"]',
            betAcceptedElement:''
        }
    },
    'sportsbet': {
        currentAmountElement: 'span[data-testid="balance-amount"]',
        betslip: {
            rootElement: '[class^=BetslipContents]',
            betSlipElement: '[class^=BetslipContents]', // +
            amountInputElement: 'data-test-id="betslip-moneyInputField"', // +
            oddsElement: '.BetslipContents__StyledInner-sc-w4swdg-1 span.FormattedOdds__OddsWrapper-sc-dio9ku-0',
            betAcceptedElement:'[class^=FullReceiptHeaderStyles__BetPlacedContainer]'
        }
    },
    'pokerstars-01': {
        currentAmountElement: '',
        betslip: {
            rootElement: 'div[data-testid="bet-slip-opportunity"]',
            betSlipElement: 'div[data-testid="bet-slip-opportunity"]',
            amountInputElement: 'div[data-testid="bet-slip-opportunity"] div div div div input',
            oddsElement: 'div[data-testid="bet-slip-opportunity"] div div div div',
            betAcceptedElement:''
        }
    },
    'sportsbetting': {
        currentAmountElement: 'button.userBalance',
        betslip: {
            rootElement: document.body,
            betSlipElement: '',
            amountInputElement: '',
            oddsElement: '',
            cancelBetElement: ''
        }
    },
    'stake': {
        currentAmountElement: '.currency span span',
        betslip: {
            rootElement: 'div[data-test="betslip-bet"]',
            betSlipElement: 'div[data-test="betslip-bet"]',
            amountInputElement: 'input[data-test="input-bet-amount"]',
            oddsElement: 'span.odds-payout div.odds span',
            placeBetElement: '',
            cancelBetElement: ''
        }
    },
    'cloudbet': {
        currentAmountElement: 'p[data-dd-action-name="AccountButton balance"]',
        betslip: {
            rootElement: 'div[data-component="quick-betslip-card"]',
            betSlipElement: 'div[data-component="quick-betslip-card"]',
            amountInputElement: 'input[data-component="betslip-input-field"]',
            oddsElement: 'div[data-component="quick-betslip-odds"]',
            betAcceptedElement:'[data-component="quick-betslip-place-bet-again"]' //+
        }
    },
};
const CALC_CONTENT = `<div id="calc-container" class="calc-container">
<div class="calc-card">
    <div class="card-body">
<<<<<<< HEAD
        <form class="calc">
=======
        <form class="calc" id="calc-form">
>>>>>>> 40ce954 (Додано відслідковування прийняття ставки)
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
        <div class="calc-buttons">
          <button onclick="a.moveStakeOnRisk()" class="calc-button">Перенести</button>
          <button onclick="a.reset()" class="calc-button">Скинути</button>
        </div>
      </div>
    </div>
  </div>`;