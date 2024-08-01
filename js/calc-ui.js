
class CalcUI {
  constructor() {
    this.calc = document.createElement('div');
    this.calc.id = "calc-container"
    this.calc.className = "calc-container"
    this.calc.innerHTML = this.getCalcContent();
    document.body.append(this.calc);

    this.calcContainer = document.getElementById('calc-container');
    this.calcForm = document.getElementById('calc-form');
    this.isDragging = true;
    this.offsetX = 0;
    this.offsetY = 0;

    this.initEventListeners();
  }

  getCalcContent() {
    return `
    <div class="calc-card">
      <div class="card-body">
        <form class="calc" id="calc-form">
          <div class="calc-form-row">
            <label for="stakeA">Сума A: <span id="stake-a-currency"></span></label>
            <input type="number" id="stakeA" name="stakeA" class="calc-form-control" step="0.01" inputmode="decimal">
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
          </div>
          <div class="calc-form-row">
            <label for="stakeOnRisk">Відкрито: <span id="stake-on-risk-currency"></span></label>
            <input type="number" id="stakeOnRisk" name="stakeOnRisk" step="0.01" class="calc-form-control" readonly>
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
              <input class="tgl tgl-flip" id="ws" disabled type="checkbox" checked/>
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
      if (!this.isDragging) return;
      e.preventDefault();
      this.offsetX = e.clientX - this.calcContainer.getBoundingClientRect().left;
      this.offsetY = e.clientY - this.calcContainer.getBoundingClientRect().top;
      window.addEventListener('mousemove', this.boundMoveHandler = this.moveHandler.bind(this));
      window.addEventListener('mouseup', this.boundCleanup = this.cleanup.bind(this));
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

  setCalcVisibility(v) {
    this.calcContainer.style.display = v ? 'block' : 'none';
  }
}