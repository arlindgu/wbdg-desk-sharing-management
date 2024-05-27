function openBookingForm(deskId) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const deskIdElement = document.getElementById('deskId');
    const bookingForm = document.getElementById('bookingForm');

    if (deskIdElement) {
        deskIdElement.value = deskId;
    }
    if (bookingForm) {
        bookingForm.style.display = 'block';
    }

    if (profile && document.getElementById('studentId')) {
        document.getElementById('studentId').value = profile.studentId;
    }
}

function closeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const overlay = document.getElementById('overlay');

    if (bookingForm) {
        bookingForm.style.display = 'none';
    }
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function openBookDeskForm() {
    const deskIdElement = document.getElementById('deskId');
    const profile = JSON.parse(localStorage.getItem('profile'));
    const bookDeskId = document.getElementById('bookDeskId');
    const bookStartDate = document.getElementById('bookStartDate');
    const bookEndDate = document.getElementById('bookEndDate');
    const bookUserName = document.getElementById('bookUserName');
    const bookUserEmail = document.getElementById('bookUserEmail');
    const bookStudentId = document.getElementById('bookStudentId');
    const bookDeskForm = document.getElementById('bookDeskForm');

    if (bookDeskId && deskIdElement) {
        bookDeskId.value = deskIdElement.value;
    }
    if (bookStartDate) {
        bookStartDate.value = document.getElementById('startDate').value;
    }
    if (bookEndDate) {
        bookEndDate.value = document.getElementById('endDate').value;
    }
    if (profile) {
        if (bookUserName) {
            bookUserName.value = profile.username;
        }
        if (bookUserEmail) {
            bookUserEmail.value = profile.email;
        }
        if (bookStudentId) {
            bookStudentId.value = profile.studentId;
        }
    }
    if (bookDeskForm) {
        bookDeskForm.style.display = 'block';
    }
}

function closeBookDeskForm() {
    const bookDeskForm = document.getElementById('bookDeskForm');
    if (bookDeskForm) {
        bookDeskForm.style.display = 'none';
    }
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

function insertDefaultValues() {
    const today = new Date();
    const roundedToday = roundToNextHalfHour(today);

    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.value = roundedToday.toISOString().slice(0, -8);
    }

    const endDate = new Date(roundedToday);
    endDate.setHours(endDate.getHours() + 1);
    const endDateInput = document.getElementById('endDate');
    if (endDateInput) {
        endDateInput.value = endDate.toISOString().slice(0, -8);
    }
}
