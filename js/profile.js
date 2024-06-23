document.addEventListener('DOMContentLoaded', () => {
    loadProfile(); // gets the profile data from localstorage
    checkProfileStatus(); // Checks the status of profile and displays a notification if it's incomplete
});

function saveProfile() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = firstName + " " + lastName;
    const email = document.getElementById('email').value;
    const studentId = document.getElementById('studentId').value;

    const profile = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        studentId: studentId
    };

    localStorage.setItem('profile', JSON.stringify(profile)); // Saves the profile data to localstorage
    checkProfileStatus(); // Checks the status of the profile and displays a notification if it's incomplete
    alert('Profile saved successfully!'); // Displays a success message
}

function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('profile')); // Retrieves the profile data from localstorage

    if (profile) {
        if (document.getElementById('firstName')) {
            document.getElementById('firstName').value = profile.firstName || '';
        }
        if (document.getElementById('lastName')) {
            document.getElementById('lastName').value = profile.lastName || '';
        }
        if (document.getElementById('username')) {
            document.getElementById('username').value = profile.username || '';
        }
        if (document.getElementById('email')) {
            document.getElementById('email').value = profile.email || '';
        }
        if (document.getElementById('studentId')) {
            document.getElementById('studentId').value = profile.studentId || '';
        }
    } else {
        if (document.getElementById('profileForm')) {
            document.getElementById('profileForm').reset(); // Resets the profile form
        }
    }
}

function resetProfile() {
    localStorage.removeItem('profile'); // Removes the profile data from localstorage
    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').reset(); // Resets the profile form
    }
    setTimeout(checkProfileStatus, 100); // Delays the checkProfileStatus function for 100 milliseconds
    alert('Profile reset successfully!'); // Displays a success message
}

function checkProfileStatus() {
    const profile = JSON.parse(localStorage.getItem('profile')); // gets the profile data from localstorage
    const profileNotification = document.getElementById('profileNotification');

    if (profile && profile.firstName && profile.lastName && profile.email && profile.studentId) {
        if (profileNotification) {
            profileNotification.style.display = 'none'; // Hides the profile notification if the profile is complete
        }
    } else {
        if (profileNotification) {
            profileNotification.style.display = 'block'; // Displays the profile notification if the profile is incomplete
        }
    }
}
