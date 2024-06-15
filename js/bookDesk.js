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
        showError('End date must be after the start date.');
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
        console.log('Booking successful:', data);
        showSuccess(data);
    })
    .catch(error => {
        console.error('Booking error:', error);

        let errorMessage = 'An unknown error has occurred.';

        try {
            // Versuche, die Fehlermeldung aus der Antwort zu extrahieren
            const errorData = JSON.parse(error.message);
            if (errorData.errorcode === 150) {
                errorMessage = 'The selected period is already reserved!';
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (e) {
            // Falls das Parsen der Fehlermeldung fehlschlägt, zeige die ursprüngliche Fehlermeldung an
            console.error('Error parsing the error message:', e);
        }

        showError(errorMessage);
    });
}

function showSuccess(data) {
    const alert = document.getElementById('alert');
    alert.className = 'alert alert-success mt-3';
    alert.textContent = 'Booking successful!';
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
    alert.textContent = 'Booking error: ' + errorMessage + '';
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