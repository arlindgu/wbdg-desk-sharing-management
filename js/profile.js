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
        document.getElementById('firstName').value = profile.firstName || '';
        document.getElementById('lastName').value = profile.lastName || '';
        document.getElementById('username').value = profile.username || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('studentId').value = profile.studentId || '';
    } else {
        document.getElementById('profileForm').reset();
    }
}

function resetProfile() {
    localStorage.removeItem('profile');
    document.getElementById('profileForm').reset();
    // Verzögerung hinzufügen, um sicherzustellen, dass das Profil entfernt wurde
    setTimeout(checkProfileStatus, 100);
}

function checkProfileStatus() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const profileNotification = document.getElementById('profileNotification');

    if (profile && profile.firstName && profile.lastName && profile.email && profile.studentId) {
        profileNotification.style.display = 'none';
    } else {
        profileNotification.style.display = 'block';
    }
}
