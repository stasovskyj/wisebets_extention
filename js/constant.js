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
        <form class="calc" id="calc-form">
          <div class="calc-form-row">
            <label for="stakeA">Сума:</label>
            <input type="number" id="stakeA" name="stakeA" class="calc-form-control" step="0.01" inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="oddsA">Коеф A:</label>
            <input type="number" id="oddsA" name="oddsA" class="calc-form-control" step="0.01" inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="oddsB">Коеф B:</label>
            <input type="number" id="oddsB" name="oddsB" class="calc-form-control" step="0.01" inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="incorrectStake">Закрив B:</label>
            <input type="number" id="incorrectStake" name="incorrectStake" class="calc-form-control" step="0.01"
              inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="stakeB">Сума B:</label>
            <input type="number" id="stakeB" name="stakeB" step="0.01" class="calc-form-control" readonly>
          </div>
          <div class="calc-form-row">
            <label for="stakeOnRisk">Відкрито</label>
            <input type="number" id="stakeOnRisk" name="stakeOnRisk" step="0.01" class="calc-form-control" readonly>
          </div>
          <div class="calc-form-row">
            <label for="profit">Прибуток:</label>
            <input type="number" id="profit" name="profit" step="0.01" class="calc-form-control" readonly>
          </div>

        </form>
        <div class="calc-buttons">
          <button onclick="a.moveStakeOnRisk()" class="calc-button">Перенести</button>
          <button onclick="a.reset()" class="calc-button">Скинути</button>
        </div>
      </div>
    </div>
  </div>`;