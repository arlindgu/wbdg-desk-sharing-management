function openBookingForm(deskId) {
    document.getElementById('deskId').value = deskId;
    document.getElementById('bookingForm').style.display = 'block';
}

function closeBookingForm() {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
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
function closeBookDeskForm() {
    document.getElementById('bookDeskForm').style.display = 'none'; // Neues Formular schließen
}

window.addEventListener('click', function(event) {
    const bookingForm = document.getElementById('bookingForm');
    if (event.target === bookingForm) {
        bookingForm.style.display = 'none';
    }
});

function ensureSeconds(datetime) {
    if (datetime.length === 16) { // YYYY-MM-DDTHH:MM
        return `${datetime}:00`; // YYYY-MM-DDTHH:MM:00
    }
    return datetime; // Bereits im richtigen Format YYYY-MM-DDTHH:MM:SS
}

function roundToNextHalfHour(date) {
    const minutes = date.getMinutes();
    if (minutes < 30) {
        date.setMinutes(30);
    } else {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
    }
    return date;
}

// Heutiges Datum holen und auf die nächste halbe Stunde runden
const today = new Date();
const roundedToday = roundToNextHalfHour(today);

// Startdatum setzen
const startDateInput = document.getElementById('startDate');
startDateInput.value = roundedToday.toISOString().slice(0, -8); // ISO-Format ohne Sekunden und Zeitzone

// Enddatum setzen (+1 Stunde von Startdatum)
const endDate = new Date(roundedToday);
endDate.setHours(endDate.getHours() + 1);
const endDateInput = document.getElementById('endDate');
endDateInput.value = endDate.toISOString().slice(0, -8); // ISO-Format ohne Sekunden und Zeitzone

function insertDefaultValues() {
    // Heutiges Datum holen und auf die nächste halbe Stunde runden
    const today = new Date();
    const roundedToday = roundToNextHalfHour(today);

    // Startdatum setzen
    const startDateInput = document.getElementById('startDate');
    startDateInput.value = roundedToday.toISOString().slice(0, -8); // ISO-Format ohne Sekunden und Zeitzone

    // Enddatum setzen (+1 Stunde von Startdatum)
    const endDate = new Date(roundedToday);
    endDate.setHours(endDate.getHours() + 1);
    const endDateInput = document.getElementById('endDate');
    endDateInput.value = endDate.toISOString().slice(0, -8); // ISO-Format ohne Sekunden und Zeitzone
}