// Diese Funktion berechnet die Kosten basierend auf den Start- und Endzeiten sowie dem Preis pro Stunde
function calculateCost(startDate, endDate, pricePerHour) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInHours = (end - start) / (1000 * 60 * 60);
    return durationInHours * pricePerHour;
}

// Diese Funktion aktualisiert die Kostenanzeige in der Buchungsform
function updateCostDisplay() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const pricePerHourElement = document.getElementById('pricePerHour');
    const costDisplayElement = document.getElementById('costDisplay');
    
    if (startDate && endDate && pricePerHourElement) {
        const pricePerHour = parseFloat(pricePerHourElement.textContent);
        const cost = calculateCost(startDate, endDate, pricePerHour);
        
        // Währung überprüfen
        const currency = localStorage.getItem('currency') || 'CHF';
        const exchangeRate = currency === 'EUR' ? parseFloat(localStorage.getItem('exchangeRate')) : 1;
        const costInCurrency = (cost * exchangeRate).toFixed(2);

        costDisplayElement.textContent = `Kosten: ${costInCurrency} ${currency}`;
    }
}


function getBookings() {
    const deskId = document.getElementById('deskId').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    const studentId = document.getElementById('studentId').value;

    startDate = ensureSeconds(startDate);
    endDate = ensureSeconds(endDate);

    const url = `https://matthiasbaldauf.com/wbdg24/bookings?deskid=${deskId}&start=${startDate}&end=${endDate}&studid=${studentId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.text();
        })
        .then(data => {
            if (data) {
                const bookings = JSON.parse(data);
                displayBookings(bookings);
                // Aktualisieren Sie den Preis pro Stunde und die Kostenanzeige
                fetchDeskPrice(deskId);
            } else {
                console.log('Keine Buchungen gefunden.');
                displayBookings([]);
                // Aktualisieren Sie den Preis pro Stunde und die Kostenanzeige
                fetchDeskPrice(deskId);
            }
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
        });
}

function fetchDeskPrice(deskId) {
    fetch('https://matthiasbaldauf.com/wbdg24/desks')
        .then(response => response.json())
        .then(desks => {
            const desk = desks.find(d => d.id === deskId);
            if (desk) {
                const pricePerHourElement = document.getElementById('pricePerHour');
                pricePerHourElement.textContent = desk.price;
                updateCostDisplay();
            }
        })
        .catch(error => console.error('Fehler beim Abrufen des Desk-Preises:', error));
}


function displayBookings(bookings) {
    const bookingsContainer = document.getElementById('bookingsContainer');
    bookingsContainer.innerHTML = ''; // Leere das Container-Element

    if (bookings.length === 0) {
        const noBookingsMessage = document.createElement('p');
        noBookingsMessage.textContent = 'Keine Buchungen gefunden.';
        noBookingsMessage.classList.add('text-center', 'my-3'); // Bootstrap-Klassen für zentrierten Text
        bookingsContainer.appendChild(noBookingsMessage);

        console.log('keine buchungen gefunden');

        // Bootstrap Button hinzufügen
        const button = document.createElement('button');
        button.textContent = 'Jetzt reservieren!';
        button.classList.add('btn', 'btn-success', 'd-block', 'mx-auto'); // Bootstrap-Klassen für einen grünen Button, zentriert
        button.addEventListener('click', function() {
            // Schließe das vorherige Formular
            closeBookingForm();
            // Öffne das neue Formular
            openBookDeskForm();
        });

        bookingsContainer.appendChild(button);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped'); // Bootstrap-Klassen für gestylte Tabelle
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Desk ID</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration (hours)</th>
            <th>User</th>
            <th>Email</th>
            <th>Student ID</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    bookings.forEach(booking => {
        const start = dayjs(booking.start);
        const end = dayjs(booking.end);
        const duration = end.diff(start, 'hour', true); // Dauer in Stunden (auch Bruchteile)

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.deskid}</td>
            <td>${start.format('DD. MMMM YYYY HH:mm')}</td>
            <td>${end.format('DD. MMMM YYYY HH:mm')}</td>
            <td>${duration.toFixed(2)}</td>
            <td>${booking.user}</td>
            <td>${booking.email}</td>
            <td>${booking.studid}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Stil für Scrollbar hinzufügen
    bookingsContainer.style.overflowY = 'auto';
    bookingsContainer.style.maxHeight = '400px'; // Höhe anpassen, je nach Bedarf

    bookingsContainer.appendChild(table);
}