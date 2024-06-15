let exchangeRate = 1; // Standardmäßig 1 für CHF

document.addEventListener('DOMContentLoaded', () => {
    const chfButton = document.getElementById('option5');
    const eurButton = document.getElementById('option6');

    // Laden der gespeicherten Währung
    const savedCurrency = localStorage.getItem('currency') || 'CHF';
    if (savedCurrency === 'EUR') {
        eurButton.checked = true;
        fetchExchangeRateOnce();
    } else {
        chfButton.checked = true;
    }

    // Event Listener zum Speichern der Währung und Neuladen der Seite
    chfButton.addEventListener('change', () => {
        localStorage.setItem('currency', 'CHF');
        location.reload();
    });

    eurButton.addEventListener('change', () => {
        localStorage.setItem('currency', 'EUR');
        location.reload();
    });
});

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

function updatePricesToEuro() {
    const prices = document.querySelectorAll('.desk .price');
    prices.forEach(priceElement => {
        const priceInChf = parseFloat(priceElement.textContent.split(' ')[0]);
        const priceInEur = (priceInChf * exchangeRate).toFixed(2);
        priceElement.textContent = `${priceInEur} EUR`;
    });
}
