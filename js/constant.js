const API_ROOT = "https://forkmaster.pp.ua/api/";
const ACCOUNTS_URI = "scapegoat/accounts/";
const ACCOUNT_URI = "account/";
const IPTRACKER_URI = "iptracker/track/";
const WSS = "wss://wisebets.pp.ua/ws/";
const SITES_CONFIG = {
  'pinnacle': {
    currentAmountElement: '[data-test-id="QuickCashier-BankRoll"]',//+
    unsettledBetsElement: '[data-test-id="betCard"]',//+
    betslip: {
      betSlipElement: '[data-test-id="Betslip-ScrollContainer"]', // Селектор елементу betslip
      amountInputElement: '[placeholder="Stake"]', // Сума
      oddsElement: '[data-test-id="SelectionDetails-Odds"] span', // коефіцієнт
      betAcceptedElement: '[class^="style_acceptedBet"]' // Елемент прийнятої ставки
    }
  },
  'betvictor': {
    currentAmountElement: '.site-header-balance__main-balance span',
    betslip: {
      betSlipElement: '[id="full-betslip"]',
      amountInputElement: 'data-cy="stake-input"',
      oddsElement: '.odds-price',
      placeBetElement: '[data-testid="betslip-submit"]',
      betAcceptedElement: '.betslip__button-reuse'
    }
  },
  'favbet': {
    currentAmountElement: '[data-role="user-balance-header"]',
    unsettledBetsElement: '',
    betslip: {
      betSlipElement: 'div[data-role="c-betSlip"]',
      amountInputElement: 'input[data-role="betslip-bet-sum-input"]',
      oddsElement: 'span[data-role="betslip-outcome-coef"]',
      betAcceptedElement: ''
    }
  },
  'sportsbet': {
    unsettledBetsElement: '', // не підтримується
    currentAmountElement: '[data-testid="balance-amount"]', //+
    betslip: {
      betSlipElement: '[class^=BetslipContents]', // +
      amountInputElement: '[data-test-id="betslip-moneyInputField"]', // +
      oddsElement: '[class^="BetslipContents"] [class^="FormattedOdds"] [class^="FormattedOdds"]',
      betAcceptedElement: '[class^=FullReceiptHeaderStyles__BetPlacedContainer]'
    }
    
  },
  'pokerstars': {
    currentAmountElement: '._22a225b',//+
    unsettledBetsElement: '[data-testid=sports-expandable-accordion]',
    betslip: {
      betSlipElement: 'div[data-testid="bet-slip-opportunity"]',
      amountInputElement: 'div[data-testid="bet-slip-opportunity"] div div div div input',
      oddsElement: 'div[data-testid="bet-slip-opportunity"] div div div div',
      betAcceptedElement: ''
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
      betSlipElement: 'div[data-test="betslip-bet"]',
      amountInputElement: 'input[data-test="input-bet-amount"]',
      oddsElement: 'span.odds-payout div.odds span',
      placeBetElement: '',
      cancelBetElement: ''
    }
  },
  'cloudbet': {
    currentAmountElement: '[data-dd-action-name="AccountButton balance"]', // +
    unsettledBetsElement: '.bet-position-summary', // +
    betslip: {
      betSlipElement: 'div[data-component="quick-betslip-card"]',
      amountInputElement: 'input[data-component="betslip-input-field"]',
      oddsElement: 'div[data-component="quick-betslip-odds"]',
      betAcceptedElement: '[data-component="quick-betslip-place-bet-again"]' //+
    }
  },
};