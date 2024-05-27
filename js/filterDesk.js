document.addEventListener('DOMContentLoaded', function() {
    fetchDesks();
    loadStudentIdFromProfile();
});

function loadStudentIdFromProfile() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile && profile.studentId) {
        document.getElementById('studentId').value = profile.studentId;
    }
}

function fetchDesks() {
    fetch('https://matthiasbaldauf.com/wbdg24/desks')
        .then(response => response.json())
        .then(desks => {
            const dropdown = document.getElementById('deskIdDropdown');
            desks.forEach(desk => {
                const option = document.createElement('option');
                option.value = desk.id;
                option.text = desk.id;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Fehler beim Laden der Schreibtische:', error));
}

function searchDesks() {
    const deskId = document.getElementById('deskIdDropdown').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const studentId = document.getElementById('studentId').value;

    const url = `https://matthiasbaldauf.com/wbdg24/bookings?deskid=${deskId}&start=${ensureSeconds(startDate)}&end=${ensureSeconds(endDate)}&studid=${studentId}`;

    fetch(url)
        .then(response => response.json())
        .then(bookings => {
            displayBookings(bookings);
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
        });
}



function displayBookings(bookings) {
    const deskList = document.querySelector('.results');
    deskList.innerHTML = ''; // Clear existing content

    // Prüfe, ob Buchungen vorhanden sind
    if (bookings.length === 0) {
        const noBookingsMessage = document.createElement('p');
        noBookingsMessage.textContent = 'Für diesen Zeitraum mit den gesuchten Parametern gibt es keine Buchungen.';
        deskList.appendChild(noBookingsMessage);
    } else {
        const bookingsContainer = document.createElement('div');
        bookingsContainer.className = 'table-responsive';

        const table = document.createElement('table');
        table.className = 'table table-striped';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['ID', 'Start', 'End', 'User', 'Email', 'Student ID', '', ''];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        bookings.forEach(booking => {
            const row = document.createElement('tr');

            // Erstelle die Zellen für jede Buchung
            const cellId = document.createElement('td');
            cellId.textContent = booking.id;
            cellId.setAttribute('id', 'bookingId'); // ID für die Buchungs-ID
            row.appendChild(cellId);

            const cellStart = document.createElement('td');
            cellStart.textContent = booking.start;
            cellStart.setAttribute('id', 'bookingStart'); // ID für den Startzeitpunkt
            row.appendChild(cellStart);

            const cellEnd = document.createElement('td');
            cellEnd.textContent = booking.end;
            cellEnd.setAttribute('id', 'bookingEnd'); // ID für den Endzeitpunkt
            row.appendChild(cellEnd);

            const cellUser = document.createElement('td');
            cellUser.textContent = booking.user;
            cellUser.setAttribute('id', 'bookingUser'); // ID für den Benutzer
            row.appendChild(cellUser);

            const cellEmail = document.createElement('td');
            cellEmail.textContent = booking.email;
            cellEmail.setAttribute('id', 'bookingEmail'); // ID für die E-Mail
            row.appendChild(cellEmail);

            const cellStudentId = document.createElement('td');
            cellStudentId.textContent = booking.studid;
            cellStudentId.setAttribute('id', 'bookingStudentId'); // ID für die Studenten-ID
            row.appendChild(cellStudentId);

            const cellButton1 = document.createElement('td');
            const button1 = document.createElement('button');
            button1.className = 'btn btn-success';
            button1.textContent = 'Generate ICS-Link';
            button1.setAttribute('id', 'button1'); // ID für Button 1
            cellButton1.appendChild(button1);
            row.appendChild(cellButton1);
            cellButton1.onclick = generateCalendarLinkFiltered;

            const cellButton2 = document.createElement('td');
            const button2 = document.createElement('button');
            button2.className = 'btn btn-danger';
            button2.textContent = 'Cancel Booking';
            button2.setAttribute('id', 'button2'); // ID für Button 2
            cellButton2.appendChild(button2);
            row.appendChild(cellButton2);
            cellButton2.onclick = cancelBooking;

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        bookingsContainer.appendChild(table);

        deskList.appendChild(bookingsContainer);
    }
}


function generateCalendarLinkFiltered(event) {
    const currentRow = event.target.closest('tr'); // Finde die nächste Zeile, die das Ziel-Element (der geklickte Button) enthält

    const deskId = document.getElementById('deskIdDropdown').value;
    const startDate = currentRow.querySelector('#bookingStart').textContent;
    const endDate = currentRow.querySelector('#bookingEnd').textContent;

    const baseUrl = 'https://calndr.link/d/event/?';
    const params = new URLSearchParams({
        service: 'apple',  // Apple service
        start: formatDateToISO(startDate),
        end: formatDateToISO(endDate),
        title: `Desk Reservation ${deskId}`
    });

    const calendarLink = baseUrl + params.toString();

    // Öffne den Link in einem neuen Tab
    window.open(calendarLink, '_blank');
}

function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString;
}

function cancelBooking(event) {
    const currentRow = event.target.closest('tr'); // Finde die nächste Zeile, die das Ziel-Element (der geklickte Button) enthält

    const bookingId = currentRow.querySelector('#bookingId').textContent; // ID der Buchung in der aktuellen Zeile
    const studentId = currentRow.querySelector('#bookingStudentId').textContent; // Studenten-ID in der aktuellen Zeile

    const url = 'https://matthiasbaldauf.com/wbdg24/booking';
    const params = new URLSearchParams({
        id: bookingId,
        studid: studentId
    });

    fetch(url, {
        method: 'DELETE',
        body: params
    })
    .then(response => {
        if (response.ok) {
            // Buchung erfolgreich gelöscht
            currentRow.innerHTML = '<td colspan="10">Deleted</td>'; // Leere die gesamte Zeile und zeige "Deleted" in der Mitte an

            // Füge Fade-Out-Effekt hinzu
            currentRow.style.transition = 'opacity 0.5s';
            currentRow.style.opacity = '0';

            // Entferne die Zeile nach einer Verzögerung von 0.5 Sekunden (entspricht der Transition-Dauer)
            setTimeout(() => {
                currentRow.remove();
            }, 500);
        } else {
            // Fehler beim Löschen der Buchung
            const overlay = document.createElement('div');
            overlay.textContent = 'Failed to cancel booking!';
            overlay.style.position = 'absolute';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            overlay.style.color = 'white';
            overlay.style.padding = '10px';
            document.body.appendChild(overlay);
            setTimeout(() => {
                overlay.remove(); // Entferne das Fehler-Overlay nach 3 Sekunden
            }, 3000);
        }
    })
    .catch(error => {
        // Fehler beim Ausführen der DELETE-Anfrage
        console.error('Error cancelling booking:', error);
        const overlay = document.createElement('div');
        overlay.textContent = 'An error occurred!';
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px';
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.remove(); // Entferne das Fehler-Overlay nach 3 Sekunden
        }, 3000);
    });
}