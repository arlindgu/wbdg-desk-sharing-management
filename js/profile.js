document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    checkProfileStatus();
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

    localStorage.setItem('profile', JSON.stringify(profile));
    checkProfileStatus();
    alert('Profil gespeichert');
}

function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('profile'));

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
            document.getElementById('profileForm').reset();
        }
    }
}

function resetProfile() {
    localStorage.removeItem('profile');
    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').reset();
    }
    setTimeout(checkProfileStatus, 100);
}

function checkProfileStatus() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const profileNotification = document.getElementById('profileNotification');

    if (profile && profile.firstName && profile.lastName && profile.email && profile.studentId) {
        if (profileNotification) {
            profileNotification.style.display = 'none';
        }
    } else {
        if (profileNotification) {
            profileNotification.style.display = 'block';
        }
    }
}
