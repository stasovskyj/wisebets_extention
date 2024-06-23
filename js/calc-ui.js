
const calc = document.createElement('div');
const CALC_CONTENT = `<div id="calc-container" class="calc-container">
    <div class="calc-card">
      <div class="card-body">
        <form class="calc" id="calc-form">
          <div class="calc-form-row">
            <label for="stakeA">Сума: <span id="stake-a-currency"></span></label>
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
        </form>
        <div class="calc-buttons">
          <button id="move-stake-on-risk" class="calc-button">Перенести</button>
          <button id="reset-calc" class="calc-button">Скинути</button>
        </div>
      </div>
    </div>
  </div>`;

calc.innerHTML = CALC_CONTENT;

document.body.append(calc);

const calcContainer = document.getElementById('calc-container');
const calcForm = document.getElementById('calc-form');

// Відключення перетягування, коли клікнуто на поле вводу
calcContainer.addEventListener('mousedown', (event) => {
    if (event.target.tagName === 'INPUT') {
        isDragging = false;
    }
});

// Увімкнення перетягування, коли клікнуто поза полями вводу
calcContainer.addEventListener('mouseup', () => {
    isDragging = true;
});

let isDragging = true;
let offsetX, offsetY;

calcContainer.addEventListener('mousedown', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    offsetX = e.clientX - calcContainer.getBoundingClientRect().left;
    offsetY = e.clientY - calcContainer.getBoundingClientRect().top;
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', cleanup);
});

function moveHandler(e) {
    calcContainer.style.left = e.clientX - offsetX + 'px';
    calcContainer.style.top = e.clientY - offsetY + 'px';
}

function cleanup() {
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', cleanup);
}