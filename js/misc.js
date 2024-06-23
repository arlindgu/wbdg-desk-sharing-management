function openBookingForm(deskId) {
    // gets the user profile from local storage
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
        // sets the student ID value in the booking form if the profile exists
        document.getElementById('studentId').value = profile.studentId;
    }
}

function closeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const overlay = document.getElementById('overlay');

    if (bookingForm) {
        // Hides the booking form
        bookingForm.style.display = 'none';
    }
    if (overlay) {
        // Hides the overlay
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
        // sets the desk ID value in the book desk form
        bookDeskId.value = deskIdElement.value;
    }
    if (bookStartDate) {
        // sets the start date value in the book desk form
        bookStartDate.value = document.getElementById('startDate').value;
    }
    if (bookEndDate) {
        // sets the end date value in the book desk form
        bookEndDate.value = document.getElementById('endDate').value;
    }
    if (profile) {
        if (bookUserName) {
            // sets the username value in the book desk form if the profile exists
            bookUserName.value = profile.username;
        }
        if (bookUserEmail) {
            // sets the email value in the book desk form if the profile exists
            bookUserEmail.value = profile.email;
        }
        if (bookStudentId) {
            // sets the student ID value in the book desk form if the profile exists
            bookStudentId.value = profile.studentId;
        }
    }
    if (bookDeskForm) {
        // show the book desk form
        bookDeskForm.style.display = 'block';
    }
}

function closeBookDeskForm() {
    const bookDeskForm = document.getElementById('bookDeskForm');
    if (bookDeskForm) {
        // Hides the book desk form
        bookDeskForm.style.display = 'none';
    }
}

window.addEventListener('click', function(event) {
    const bookingForm = document.getElementById('bookingForm');
    if (event.target === bookingForm) {
        // Hides the booking form when clicked outside of it
        bookingForm.style.display = 'none';
    }
});

function ensureSeconds(datetime) {
    if (datetime.length === 16) {
        // Adds seconds to the datetime string if it is 16 characters long
        return `${datetime}:00`;
    }
    return datetime;
}

function roundToNextHalfHour(date) {
    const minutes = date.getMinutes();
    if (minutes < 30) {
        // Rounds the date to the next half hour
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
        // Sets the start date input value to the rounded current date and time
        startDateInput.value = roundedToday.toISOString().slice(0, -8);
    }

    const endDate = new Date(roundedToday);
    endDate.setHours(endDate.getHours() + 1);
    const endDateInput = document.getElementById('endDate');
    if (endDateInput) {
        // Sets the end date input value to the rounded current date and time plus 1 hour
        endDateInput.value = endDate.toISOString().slice(0, -8);
    }
}
