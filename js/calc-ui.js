class CalcUI extends Base {
  constructor() {
    super();
    this.calc = document.createElement('div');
    this.calc.id = "calc-container"
    this.calc.className = "calc-container"

    this.calc.innerHTML = this.getCalcContent();
    document.body.append(this.calc);

    this.calcContainer = document.getElementById('calc-container');
    this.calcForm = document.getElementById('calc-form');

    this.observerIndicator = document.getElementById('observe');
    this.webSocketIndicator = document.getElementById('ws');
    this.stateIndicator = document.getElementById('state');

    this.incorrectStake = document.getElementById('incorrectStake');

    this.moveStakeOnRiskButton = document.getElementById('move-stake-on-risk');
    this.resetButton = document.getElementById('reset-calc');

    this.stakeACurrencyInput = document.getElementById('stakeACurrency');
    this.stakeACurrencyElement = document.getElementById('stake-a-currency');
    this.stakeBCurrencyElement = document.getElementById('stake-b-currency');
    this.stakeBCurrencyInput = document.getElementById('stakeBCurrency');
    this.stakeOnRiskCurrencyElement = document.getElementById('stake-on-risk-currency');
    this.stakeOnRiskCurrencyInput = document.getElementById('stakeOnRiskCurrency');

    this.isDragging = true;
    this.offsetX = 0;
    this.offsetY = 0;

    this.initEventListeners();

    this.eventEmitter.on("websocket", this.setWebSocketIndicator)
    this.eventEmitter.on("observer", this.setObserverIndicator)
    this.eventEmitter.on("state", this.setStateIndicator)
    this.eventEmitter.on("calcUpdated", this.updateForm.bind(this))

  }

  getCalcContent() {
    return `
    <div class="calc-card">
      <div class="card-body">
        <form class="calc" id="calc-form">
          <div class="calc-form-row">
            <label for="stakeA">Сума A: <span id="stake-a-currency"></span></label>
            <input type="number" id="stakeA" name="stakeA" class="calc-form-control" step="0.01" inputmode="decimal">
            <input type="hidden" id="stakeACurrency" name="stakeACurrency">
            </div>
          <div class="calc-form-row">
            <label for="oddsA">Коеф A:</label>
            <input type="number" id="oddsA" name="oddsA" min="1" class="calc-form-control" step="0.01" inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="oddsB">Коеф B:</label>
            <input type="number" id="oddsB" name="oddsB" min="1" class="calc-form-control" step="0.01" inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="incorrectStake">Закрив B:</label>
            <input type="number" id="incorrectStake" name="incorrectStake" class="calc-form-control" step="0.01"
              inputmode="decimal">
          </div>
          <div class="calc-form-row">
            <label for="stakeB">Сума B:<span id="stake-b-currency"></span></label>
            <input type="number" id="stakeB" name="stakeB" step="0.01" class="calc-form-control" readonly>
            <input type="hidden" id="stakeBCurrency" name="stakeBCurrency">
          </div>
          <div class="calc-form-row">
            <label for="stakeOnRisk">Відкрито: <span id="stake-on-risk-currency"></span></label>
            <input type="number" id="stakeOnRisk" name="stakeOnRisk" step="0.01" class="calc-form-control" readonly>
            <input type="hidden" id="stakeOnRiskCurrency" name="stakeBCurrency">
          </div>
          <div class="calc-form-row">
            <label for="profit">Прибуток:</label>
            <input type="number" id="profit" name="profit" step="0.01" class="calc-form-control" readonly>
          </div>
          <div class="calc-form-row calc-form-row__v-center">
              <button id="move-stake-on-risk" class="calc-button">Перенести</button>
            </div>
            <div class="calc-form-row calc-form-row__v-center">
              <button id="reset-calc" class="calc-button">Скинути</button>
            </div>
        </form>
        <div class="calc-helper-buttons">
           <div class="checkbox-wrapper-10">
              <input class="tgl tgl-flip" id="observe" type="checkbox"/>
              <label class="tgl-btn" data-tg-off="OFF" data-tg-on="Observer" for="observe"></label>
            </div>
            <div class="checkbox-wrapper-10">
              <input class="tgl tgl-flip" id="ws" disabled type="checkbox"/>
              <label class="tgl-btn" data-tg-off="WS - OFF!" data-tg-on="WS" for="ws"></label>
            </div>
            <div class="checkbox-wrapper-10">
              <input class="tgl tgl-flip" id="state" type="checkbox"/>
              <label class="tgl-btn" data-tg-off="РЕЖИМ 2" data-tg-on="РЕЖИМ 1" for="state"></label>
            </div>
        </div>
      </div>
    </div>

    `;
  }

  initEventListeners() {
    this.calcContainer.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') {
        this.isDragging = false;
      } else {
        this.isDragging = true;
      }
    });

    this.calcContainer.addEventListener('mouseup', () => {
      this.isDragging = true;
    });

    this.calcContainer.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || !this.isDragging) return;
      e.preventDefault();
      this.offsetX = e.clientX - this.calcContainer.getBoundingClientRect().left;
      this.offsetY = e.clientY - this.calcContainer.getBoundingClientRect().top;
      window.addEventListener('mousemove', this.boundMoveHandler = this.moveHandler.bind(this));
      window.addEventListener('mouseup', this.boundCleanup = this.cleanup.bind(this));
    });

    this.stateIndicator.addEventListener('change', (e) => this.eventEmitter.emit('stateIndicator', e.target.checked ? 1 : 2, true))

    this.observerIndicator.addEventListener('change', (e) => this.eventEmitter.emit('observerIndicator', e.target.checked, true))
    // Виключити Observer при вводі в поле неправильна ставка
    this.incorrectStake.addEventListener('input', () => {
      if (this.observerIndicator.checked) this.eventEmitter.emit('observerIndicator', false)
    });
    // Метод очистки поля при focus
    this.calcForm.addEventListener('focus', (e) => {
      if (e.target.tagName === 'INPUT') {
        e.target.value = '';
      }
    }, true);
    // синхронізація даних в обєкті калькулятора
    this.calcForm.addEventListener('input', (e) => {
      const { id, value } = e.target;
      const numericValue = parseFloat(value) || null;
      const regex = /^(?:\d+\.(?:0)?)$/
      if (!regex.test(value)) {
        this.eventEmitter.emit('formUpdated', id, numericValue)
      }
    });
    this.moveStakeOnRiskButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.calcForm.elements['stakeOnRisk'].value != '')
        this.eventEmitter.emit('moveStakeOnRisk');
    });
    this.resetButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.eventEmitter.emit('reset');
      this.calcForm.reset();
    });

  }
  moveHandler(e) {
    if (!this.isDragging) return;
    this.calcContainer.style.left = e.clientX - this.offsetX + 'px';
    this.calcContainer.style.top = e.clientY - this.offsetY + 'px';
  }

  cleanup() {
    window.removeEventListener('mousemove', this.boundMoveHandler);
    window.removeEventListener('mouseup', this.boundCleanup);
  }

  updateForm(propertyName, value) {
    const input = this.calcForm.elements[propertyName];
    if (input) {
      input.value = value !== null ? value : '';
      this.showCurrency()
    }
  }

  setCalcVisibility(value) {
    this.calcContainer.style.display = value ? 'block' : 'none';
  }
  setObserverIndicator = (value) => {
    this.observerIndicator.checked = value;
  }
  setWebSocketIndicator = (value) => {
    this.webSocketIndicator.checked = value;
  }
  setStateIndicator = (value) => {
    this.stateIndicator.checked = (value == 1) ? true : false;
  }
  showCurrency() {
    this.stakeACurrencyElement.innerText = this.stakeACurrencyInput.value ?? "";
    this.stakeBCurrencyElement.innerText = this.stakeBCurrencyInput.value ?? "";
    this.stakeOnRiskCurrencyElement.innerText = this.stakeOnRiskCurrencyInput.value ?? "";
  }
}