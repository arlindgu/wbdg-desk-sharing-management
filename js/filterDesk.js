document.addEventListener('DOMContentLoaded', function() {
    fetchDesks();
    loadStudentIdFromProfile();
});

// load student ID from profile and fill the input field
function loadStudentIdFromProfile() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile && profile.studentId) {
        document.getElementById('studentId').value = profile.studentId;
    }
}

// gets desks from the server and fill the dropdown
function fetchDesks() {
    fetch('https://matthiasbaldauf.com/wbdg24/desks')
        .then(response => response.json())
        .then(desks => {
            const dropdown = document.getElementById('deskIdDropdown');
            desks.forEach(desk => {
                const option = document.createElement('option');
                option.value = desk.id;
                option.text = desk.id + " - " + desk.name;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error when loading the desks:', error));
}

// search for bookings based on selected filters
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

// show the bookings in a table
function displayBookings(bookings) {
    const deskList = document.querySelector('.results');
    deskList.innerHTML = '';

    if (bookings.length === 0) {
        const noBookingsMessage = document.createElement('p');
        noBookingsMessage.textContent = 'There are no bookings for this period with the searched parameters.';
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

            const cellId = document.createElement('td');
            cellId.textContent = booking.id;
            cellId.setAttribute('id', 'bookingId');
            row.appendChild(cellId);

            const cellStart = document.createElement('td');
            cellStart.textContent = booking.start;
            cellStart.setAttribute('id', 'bookingStart');
            row.appendChild(cellStart);

            const cellEnd = document.createElement('td');
            cellEnd.textContent = booking.end;
            cellEnd.setAttribute('id', 'bookingEnd');
            row.appendChild(cellEnd);

            const cellUser = document.createElement('td');
            cellUser.textContent = booking.user;
            cellUser.setAttribute('id', 'bookingUser');
            row.appendChild(cellUser);

            const cellEmail = document.createElement('td');
            cellEmail.textContent = booking.email;
            cellEmail.setAttribute('id', 'bookingEmail');
            row.appendChild(cellEmail);

            const cellStudentId = document.createElement('td');
            cellStudentId.textContent = booking.studid;
            cellStudentId.setAttribute('id', 'bookingStudentId');
            row.appendChild(cellStudentId);

            const cellButton1 = document.createElement('td');
            const button1 = document.createElement('button');
            button1.className = 'btn btn-success';
            button1.textContent = 'Generate ICS-Link';
            button1.setAttribute('id', 'button1');
            cellButton1.appendChild(button1);
            row.appendChild(cellButton1);
            cellButton1.onclick = generateCalendarLinkFiltered;

            const cellButton2 = document.createElement('td');
            const button2 = document.createElement('button');
            button2.className = 'btn btn-danger';
            button2.textContent = 'Cancel Booking';
            button2.setAttribute('id', 'button2');
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

// generate a calendar link for the selected booking
function generateCalendarLinkFiltered(event) {
    const currentRow = event.target.closest('tr');

    const deskId = document.getElementById('deskIdDropdown').value;
    const startDate = currentRow.querySelector('#bookingStart').textContent;
    const endDate = currentRow.querySelector('#bookingEnd').textContent;

    const baseUrl = 'https://calndr.link/d/event/?';
    const params = new URLSearchParams({
        service: 'apple',
        start: formatDateToISO(startDate),
        end: formatDateToISO(endDate),
        title: `Desk Reservation ${deskId}`
    });

    const calendarLink = baseUrl + params.toString();

    window.open(calendarLink, '_blank');
}

// Format a date string to ISO format
function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString;
}

// Cancel booking
function cancelBooking(event) {
    const currentRow = event.target.closest('tr');

    const bookingId = currentRow.querySelector('#bookingId').textContent;
    const studentId = currentRow.querySelector('#bookingStudentId').textContent;
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
                currentRow.innerHTML = '<td colspan="10">Deleted</td>';

                currentRow.style.transition = 'opacity 0.5s';
                currentRow.style.opacity = '0';

                setTimeout(() => {
                    currentRow.remove();
                }, 500);
            } else {
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
                    overlay.remove();
                }, 3000);
            }
        })
        .catch(error => {
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
                overlay.remove();
            }, 3000);
        });
}