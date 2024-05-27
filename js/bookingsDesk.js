function getBookings() {
    const deskId = document.getElementById('deskId').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    const studentId = document.getElementById('studentId').value;

    // Stellen Sie sicher, dass die Sekunden hinzugefügt werden
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
            } else {
                console.log('Keine Buchungen gefunden.');
                displayBookings([]);
            }
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
        });
}

function displayBookings(bookings) {
    const bookingsContainer = document.getElementById('bookingsContainer');
    bookingsContainer.innerHTML = ''; // Leere das Container-Element

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>Keine Buchungen gefunden.</p>';
        console.log('keine buchungen gefunden');
    
        // Bootstrap Button hinzufügen
        const button = document.createElement('button');
        button.textContent = 'Jetzt reservieren!';
        button.classList.add('btn', 'btn-success'); // Bootstrap-Klassen für einen grünen Button
        button.addEventListener('click', function() {
            // Schließe das vorherige Formular
            closeBookingForm();
            // Öffne das neue Formular
            openBookDeskForm();
        });

        bookingsContainer.appendChild(button);
        return;
    }

    bookings.forEach(booking => {
        const bookingElement = document.createElement('div');
        bookingElement.innerHTML = `
            <div class="booking">
                <p><strong>ID:</strong> ${booking.id}</p>
                <p><strong>Desk ID:</strong> ${booking.deskid}</p>
                <p><strong>Start:</strong> ${booking.start}</p>
                <p><strong>End:</strong> ${booking.end}</p>
                <p><strong>User:</strong> ${booking.user}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Student ID:</strong> ${booking.studid}</p>
            </div>
        `;
        bookingsContainer.appendChild(bookingElement);
    });
}