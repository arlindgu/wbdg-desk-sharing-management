document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('validationForm');
    if (form) {
        form.addEventListener('submit', validateForm);
    }
});

function validateNumberInput() {
    const numberInputs = document.querySelectorAll('input[data-validate="number"], input[id="bookStudentId"], input[id="studentId"]');
    const numberPattern = /^[0-9]*$/;

    numberInputs.forEach(input => {
        const errorElement = document.getElementById(input.id + 'Error');
        if (!numberPattern.test(input.value)) {
            input.classList.add('is-invalid');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        } else {
            input.classList.remove('is-invalid');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    });
}

function validateLetterInput() {
    const letterInputs = document.querySelectorAll('input[data-validate="letter"], input[id="bookUserName"], input[id="firstName"], input[id="lastName"]');
    const letterPattern = /^[a-zA-Z\s]*$/;  // \s steht für Leerzeichen

    letterInputs.forEach(input => {
        const errorElement = document.getElementById(input.id + 'Error');
        if (!letterPattern.test(input.value)) {
            input.classList.add('is-invalid');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        } else {
            input.classList.remove('is-invalid');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    });
}

function validateEmailInput() {
    const emailInputs = document.querySelectorAll('input[type="email"], input[id="bookUserEmail"], input[id="email"]');
    const emailPattern = /@/;

    emailInputs.forEach(input => {
        const errorElement = document.getElementById(input.id + 'Error');
        if (!emailPattern.test(input.value)) {
            input.classList.add('is-invalid');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        } else {
            input.classList.remove('is-invalid');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    });
}

function validateForm(event) {
    event.preventDefault();

    validateNumberInput();
    validateLetterInput();
    validateEmailInput();

    if (document.querySelectorAll('.is-invalid').length === 0) {
        alert('Formular erfolgreich abgesendet!');
    }
}
