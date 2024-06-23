let exchangeRate = 1;

document.addEventListener('DOMContentLoaded', () => {
    const chfButton = document.getElementById('option5');
    const eurButton = document.getElementById('option6');

    const savedCurrency = localStorage.getItem('currency') || 'CHF';
    if (savedCurrency === 'EUR') {
        eurButton.checked = true;
        fetchExchangeRateOnce();
    } else {
        chfButton.checked = true;
    }

    chfButton.addEventListener('change', () => {
        localStorage.setItem('currency', 'CHF');
        location.reload();
    });

    eurButton.addEventListener('change', () => {
        localStorage.setItem('currency', 'EUR');
        location.reload();
    });
});

// gets the exchange rate from CHF to EUR once and stores it in local storage
function fetchExchangeRateOnce() {
    const savedRate = localStorage.getItem('exchangeRate');
    if (savedRate) {
        exchangeRate = parseFloat(savedRate);
        updatePricesToEuro();
    } else {
        fetch('https://api.exchangerate-api.com/v4/latest/CHF')
            .then(response => response.json())
            .then(data => {
                exchangeRate = data.rates.EUR;
                localStorage.setItem('exchangeRate', exchangeRate);
                updatePricesToEuro();
            })
            .catch(error => console.error('Error when retrieving the exchange rate:', error));
    }
}

// updates the prices on the page to EUR based on the current exchange rate
function updatePricesToEuro() {
    const prices = document.querySelectorAll('.desk .price');
    prices.forEach(priceElement => {
        const priceInChf = parseFloat(priceElement.textContent.split(' ')[0]);
        const priceInEur = (priceInChf * exchangeRate).toFixed(2);
        priceElement.textContent = `${priceInEur} EUR`;
    });
}
