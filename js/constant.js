const API_ROOT = "https://forkmaster.pp.ua/api/";
const ACCOUNTS_URI = "scapegoat/accounts/";
const ACCOUNT_URI = "account/";
const IPTRACKER_URI = "iptracker/track/";

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