document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('validationForm');
    if (form) {
        form.addEventListener('submit', validateForm);
    }

    const numberInputs = document.querySelectorAll('input[data-validate="number"], input[id="bookStudentId"], input[id="studentId"]');
    const letterInputs = document.querySelectorAll('input[data-validate="letter"], input[id="bookUserName"], input[id="firstName"], input[id="lastName"]');
    const emailInputs = document.querySelectorAll('input[type="email"], input[id="bookUserEmail"], input[id="email"]');

    numberInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            validateNumberInput();
        });
    });

    letterInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
            validateLetterInput();
        });
    });

    emailInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateEmailInput();
        });
    });
});

// validates number inputs by checking if they contain only numbers
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

// validates letter inputs by checking if they contain only letters and spaces
function validateLetterInput() {
    const letterInputs = document.querySelectorAll('input[data-validate="letter"], input[id="bookUserName"], input[id="firstName"], input[id="lastName"]');
    const letterPattern = /^[a-zA-Z\s]*$/; 

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

// valides email inputs by checking if they contain the '@' symbol
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

// validates the form by calling the individual validation functions
function validateForm(event) {
    event.preventDefault();

    validateNumberInput();
    validateLetterInput();
    validateEmailInput();

    if (document.querySelectorAll('.is-invalid').length === 0) {
        alert('Form submitted successfully!');
    }
}
