function loadProfile() {
    var storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
        var profile = JSON.parse(storedProfile);
        document.getElementById('profileFirstName').value = profile.firstName;
        document.getElementById('profileLastName').value = profile.lastName;
        document.getElementById('profileEmail').value = profile.email;
        document.getElementById('profileStudentId').value = profile.studentId;
    }
}


// Event-Listener hinzufügen, um das Profil beim Laden der Seite zu laden
window.addEventListener('load', function() {
    loadProfile();
});

// Funktion zum Speichern des Profils lokal
function saveProfile() {
    // Daten aus den Eingabefeldern erfassen
    var firstName = document.getElementById("profileFirstName").value;
    var lastName = document.getElementById("profileLastName").value;
    var email = document.getElementById("profileEmail").value;
    var studentId = document.getElementById("profileStudentId").value;

    // Benutzernamen erstellen
    var userName = firstName + ' ' + lastName;

    // Profil als JavaScript-Objekt speichern
    var profile = {
        firstName: firstName,
        lastName: lastName,
        userName: userName, // Benutzername hinzufügen
        email: email,
        studentId: studentId
    };

    // Profil als JSON-String in den Local Storage speichern
    localStorage.setItem('profile', JSON.stringify(profile));
}

// Funktion zum Überprüfen und Speichern des Profils
function checkInput() {
    var profileFirstName = document.getElementById('profileFirstName').value;
    var profileLastName = document.getElementById('profileLastName').value;
    var profileEmail = document.getElementById('profileEmail').value;
    var profileStudentId = document.getElementById('profileStudentId').value;
    var isValid = true;

    // Überprüfen, ob Vorname und Nachname nur Buchstaben enthalten
    var nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(profileFirstName) || !nameRegex.test(profileLastName)) {
        isValid = false;
        document.getElementById('profileFirstName').classList.add('is-invalid');
        document.getElementById('profileLastName').classList.add('is-invalid');
    } else {
        document.getElementById('profileFirstName').classList.remove('is-invalid');
        document.getElementById('profileLastName').classList.remove('is-invalid');
    }

    // Überprüfen, ob die E-Mail-Adresse ein @-Symbol enthält
    var emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(profileEmail)) {
        isValid = false;
        document.getElementById('profileEmail').classList.add('is-invalid');
    } else {
        document.getElementById('profileEmail').classList.remove('is-invalid');
    }

    // Überprüfen, ob die Studenten-ID nur Zahlen enthält
    var studentIdRegex = /^1234$/; // Regulärer Ausdruck für die Studenten-ID "1234"
    if (!studentIdRegex.test(profileStudentId)) {
        isValid = false;
        document.getElementById('profileStudentId').classList.add('is-invalid');
    } else {
        document.getElementById('profileStudentId').classList.remove('is-invalid');
    }

    // Wenn alles gültig ist, speichern oder weiterverarbeiten
    if (isValid) {
        saveProfile();
    }
}

function resetProfile() {
    // Lokale Profildaten löschen
    localStorage.removeItem('profile');
    // Formularfelder zurücksetzen
    document.getElementById("profileFirstName").value = "";
    document.getElementById("profileLastName").value = "";
    document.getElementById("profileEmail").value = "";
    document.getElementById("profileStudentId").value = "";
}

// Überprüfung, ob das Profil ausgefüllt ist
window.addEventListener('load', function() {
    var storedProfile = localStorage.getItem('profile');
    var navbarAlert = document.getElementById('navbarAlert');

    if (!storedProfile) {
        navbarAlert.classList.add('show');
    }
});

window.addEventListener('load', function() {
    var storedProfile = localStorage.getItem('profile');
    var profileStatus = document.getElementById('profileStatus');
    var tooltipText = document.getElementById('tooltipText');

    if (storedProfile) {
        profileStatus.textContent = "●"; // Grünes Häkchen, wenn das Profil ausgefüllt ist
        profileStatus.style.color = "green";
        tooltipText.textContent = "Profile is complete"; // Tooltip-Text ändern, wenn das Profil ausgefüllt ist
    } else {
        profileStatus.textContent = "●"; // Rotes Ausrufezeichen, wenn das Profil nicht ausgefüllt ist
        profileStatus.style.color = "red";
        tooltipText.textContent = "Profile needs to be filled first"; // Tooltip-Text ändern, wenn das Profil nicht ausgefüllt ist
    }

    // Tooltip hinzufügen
    document.querySelectorAll('[data-toggle="tooltip"]').forEach(function(item) {
        new bootstrap.Tooltip(item);
    });
});