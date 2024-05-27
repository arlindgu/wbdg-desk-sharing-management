function addMapToDesk(deskElement, latitude, longitude, deskId) {
    var mapId = `map-${deskId}`; // Stelle sicher, dass `deskId` eindeutig und korrekt ist
    var mapContainer = document.createElement('div');
    mapContainer.id = mapId;
    mapContainer.style.height = '150px';
    deskElement.querySelector('.desk-map').appendChild(mapContainer);

    var map = L.map(mapId);
    var marker = L.marker([latitude, longitude]);
    var group = new L.featureGroup([marker]); // Gruppe von Markern erstellen

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);

    map.fitBounds(group.getBounds()); // Karte an Markergruppe anpassen
    map.addLayer(group); // Markergruppe zur Karte hinzufügen
    marker.addTo(map); // Marker zur Karte hinzufügen

    // Unterdrücken des Klickereignisses auf der Karte
    mapContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    fetchDesks();
});

function fetchDesks() {
    fetch('https://matthiasbaldauf.com/wbdg24/desks')
        .then(response => response.json())
        .then(desks => updateDeskList(desks))
        .catch(error => console.error('Fehler beim Laden der Schreibtische:', error));
}
function updateDeskList(desks) {
    const deskList = document.querySelector('.desk-list');
    deskList.innerHTML = ''; // Löscht vorhandene Inhalte, falls welche vorhanden sind

    // Funktion zum Hinzufügen eines Schreibtischs ohne Verzögerung
    function addDesk(desk) {
        const isAvailable = desk.available === "1"; // Konvertiere die Verfügbarkeitszahl in einen booleschen Wert
        const availabilityClass = isAvailable ? 'alert-success' : 'alert-danger'; // Klasse für den Verfügbarkeitsindikator
        const latitude = parseFloat(desk.lat); // Konvertiere die Latitude in eine Gleitkommazahl
        const longitude = parseFloat(desk.lon); // Konvertiere die Longitude in eine Gleitkommazahl

        const deskElement = document.createElement('div');
        deskElement.className = 'desk card clickable'; // Bootstrap-Styling hinzugefügt und Klasse für anklickbare Kacheln
        deskElement.innerHTML = `
            <div class="card-body">
                <div class="availability-indicator alert ${availabilityClass}" role="alert">
                    ${isAvailable ? 'Verfügbar' : 'Nicht Verfügbar'}
                </div>
                <h2 class="card-title">${desk.name}</h2>
                <h6 class="card-subtitle text-body-secondary" id=${desk.id}>${desk.id}</h6>
                <div class="col">${desk.address}</div>
                <div class="col">${desk.price} CHF </div>
                <div class="col">${desk.comment || '<i>keine Bemerkungen</i>'} </div>
                <div class="desk-map pt-2 mb-2" style="height: 150px;"></div>
            </div>
        `;
        
        // Fügen Sie das Element mit der CSS-Klasse 'desk' hinzu
        deskList.appendChild(deskElement).classList.add('desk');
        addMapToDesk(deskElement, latitude, longitude, desk.id);

        // Eventlistener für das Klicken auf die Karte hinzufügen
        deskElement.addEventListener('click', () => {
            console.log('Angeklickte Karte ID:', desk.id);
            openBookingForm(desk.id); // Öffnet das Buchungsformular mit der deskId
        });
    }

    // Schleife durch die Schreibtische ohne Verzögerung zwischen den Iterationen
    desks.forEach(desk => {
        addDesk(desk);
    });
}
function openBookingForm(deskId) {
    document.getElementById('deskId').value = deskId;
    document.getElementById('bookingForm').style.display = 'block';
}

function closeBookingForm() {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

window.addEventListener('click', function(event) {
    const bookingForm = document.getElementById('bookingForm');
    if (event.target === bookingForm) {
        bookingForm.style.display = 'none';
    }
});
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
// Funktion zum Hinzufügen von Sekunden zu einem datetime-local String, falls nicht vorhanden
// Funktion zum Hinzufügen von Sekunden zu einem datetime-local String, falls nicht vorhanden
function ensureSeconds(datetime) {
    if (datetime.length === 16) { // YYYY-MM-DDTHH:MM
        return `${datetime}:00`; // YYYY-MM-DDTHH:MM:00
    }
    return datetime; // Bereits im richtigen Format YYYY-MM-DDTHH:MM:SS
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

function openBookDeskForm() {
    // Übernehme die Parameter aus dem vorherigen Formular
    document.getElementById('bookDeskId').value = document.getElementById('deskId').value;
    document.getElementById('bookStartDate').value = document.getElementById('startDate').value;
    document.getElementById('bookEndDate').value = document.getElementById('endDate').value;
    document.getElementById('bookStudentId').value = document.getElementById('studentId').value;

    // Setze Name und Email auf leere Felder oder Standardwerte
    document.getElementById('bookUserName').value = '';
    document.getElementById('bookUserEmail').value = '';

    document.getElementById('bookDeskForm').style.display = 'block'; // Neues Formular anzeigen
}

function closeBookingForm() {
    document.getElementById('bookingForm').style.display = 'none'; // Vorheriges Formular schließen
}

function closeBookDeskForm() {
    document.getElementById('bookDeskForm').style.display = 'none'; // Neues Formular schließen
}

function bookDesk() {
    const deskId = document.getElementById('bookDeskId').value;
    const userName = document.getElementById('bookUserName').value;
    const userEmail = document.getElementById('bookUserEmail').value;
    let startDate = document.getElementById('bookStartDate').value;
    let endDate = document.getElementById('bookEndDate').value;
    const studentId = document.getElementById('bookStudentId').value;

    startDate = ensureSeconds(startDate);
    endDate = ensureSeconds(endDate);

    // Ensure startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
        showError('Enddatum muss nach dem Startdatum liegen.');
        return;
    }

    const url = 'https://matthiasbaldauf.com/wbdg24/booking';
    const data = {
        deskid: deskId,
        user: userName,
        email: userEmail,
        start: startDate,
        end: endDate,
        studid: studentId
    };

    const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

    console.log('URL:', url);
    console.log('Request Body:', formBody);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Buchung erfolgreich:', data);
        showSuccess(data);
    })
    .catch(error => {
        console.error('Fehler bei der Buchung:', error);
        showError(error.message);
    });
}

function showSuccess(data) {
    const alert = document.getElementById('alert');
    alert.className = 'alert alert-success mt-3';
    alert.textContent = 'Buchung erfolgreich!';
    alert.style.display = 'block';

    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    const calendarLink = generateCalendarLink(data);
    const calendarLinkElement = document.getElementById('calendarLink');
    calendarLinkElement.href = calendarLink;
    calendarLinkElement.style.display = 'inline';
}

function showError(errorMessage) {
    const alert = document.getElementById('alert');
    alert.className = 'alert alert-danger mt-3';
    alert.textContent = 'Fehler bei der Buchung: ' + errorMessage + '. Bitte versuchen Sie es später erneut.';
    alert.style.display = 'block';

    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'none';
}

function generateCalendarLink() {
    const deskId = document.getElementById('bookDeskId').value;
    const startDate = document.getElementById('bookStartDate').value;
    const endDate = document.getElementById('bookEndDate').value;

    const baseUrl = 'https://calndr.link/d/event/?';
    console.log(startDate, endDate)
    const params = new URLSearchParams({
        service: 'apple',  // Apple service
        start: formatDateISO(startDate),
        end: formatDateISO(endDate),
        title: `Desk Reservation ${deskId}`
    });
    console.log(params)

    return baseUrl + params.toString();
}

function formatDateISO(dateTime) {
    const date = new Date(dateTime);
    return date.toISOString().split('.')[0] + 'Z';  // Ensure ISO format without milliseconds
}

function closeBookDeskForm() {
    document.getElementById('bookDeskForm').style.display = 'none';
}