function calculateCost(startDate, endDate, pricePerHour) {
    // Calculates the cost of a booking based on the difference in hours from start date and end date times price per hour
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInHours = (end - start) / (1000 * 60 * 60);
    return durationInHours * pricePerHour;
}

function updateCostDisplay() {
    // Updates the cost display
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const pricePerHourElement = document.getElementById('pricePerHour');
    const costDisplayElement = document.getElementById('costDisplay');
    
    if (startDate && endDate && pricePerHourElement) {
        const pricePerHour = parseFloat(pricePerHourElement.textContent);
        const cost = calculateCost(startDate, endDate, pricePerHour);
        
        const currency = localStorage.getItem('currency') || 'CHF';
        const exchangeRate = currency === 'EUR' ? parseFloat(localStorage.getItem('exchangeRate')) : 1;
        const costInCurrency = (cost * exchangeRate).toFixed(2);

        costDisplayElement.textContent = `Cost: ${costInCurrency} ${currency}`;
    }
}

function getBookings() {
    // Gets bookings from the server based on the infos provided in the form
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
                fetchDeskPrice(deskId);
            } else {
                console.log('No bookings found.');
                displayBookings([]);
                fetchDeskPrice(deskId);
            }
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
        });
}

function fetchDeskPrice(deskId) {
    // gets the price per hour for a specific desk from the server and updates the price
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
        .catch(error => console.error('Error when retrieving the desk price:', error));
}

function displayBookings(bookings) {
    // Displays the bookings in a table format
    const bookingsContainer = document.getElementById('bookingsContainer');
    bookingsContainer.innerHTML = '';

    if (bookings.length === 0) {
        const noBookingsMessage = document.createElement('p');
        noBookingsMessage.textContent = 'No bookings found.';
        noBookingsMessage.classList.add('text-center', 'my-3');
        bookingsContainer.appendChild(noBookingsMessage);

        console.log('no bookings found');

        const button = document.createElement('button');
        button.textContent = 'Book now!';
        button.classList.add('btn', 'btn-success', 'd-block', 'mx-auto');
        button.addEventListener('click', function() {
            closeBookingForm();
            openBookDeskForm();
        });

        bookingsContainer.appendChild(button);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
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
        const duration = end.diff(start, 'hour', true);

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

    bookingsContainer.style.overflowY = 'auto';
    bookingsContainer.style.maxHeight = '400px'; 

    bookingsContainer.appendChild(table);
}