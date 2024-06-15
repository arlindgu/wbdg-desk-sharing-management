document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('validationForm');
    if (form) {
        form.addEventListener('submit', validateForm);
    }

    // Real-time input validation
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
        alert('Form submitted successfully!');
    }
}

function validateTimeIntervals() {
    const startDateInputs = document.querySelectorAll('#bookStartDate, #startDate');
    const endDateInputs = document.querySelectorAll('#bookEndDate, #endDate');

    const validateTime = (input) => {
        const date = new Date(input.value);
        const minutes = date.getMinutes();
        const hintElement = document.getElementById(input.id + 'Hint');
        
        if (minutes % 15 !== 0) {
            input.classList.add('is-invalid');
            if (hintElement) {
                hintElement.style.display = 'block';
            }
        } else {
            input.classList.remove('is-invalid');
            if (hintElement) {
                hintElement.style.display = 'none';
            }
        }
    };

    const validateTimeRange = (startDateInput, endDateInput) => {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const diffInMinutes = (endDate - startDate) / (1000 * 60);
        const hintElement = document.getElementById(endDateInput.id + 'Hint');

        if (diffInMinutes !== 30 && diffInMinutes !== 60) {
            endDateInput.classList.add('is-invalid');
            if (hintElement) {
                hintElement.style.display = 'block';
            }
        } else {
            endDateInput.classList.remove('is-invalid');
            if (hintElement) {
                hintElement.style.display = 'none';
            }
        }
    };

    startDateInputs.forEach(startDateInput => {
        startDateInput.addEventListener('change', () => {
            validateTime(startDateInput);
            endDateInputs.forEach(endDateInput => {
                validateTimeRange(startDateInput, endDateInput);
            });
        });
    });

    endDateInputs.forEach(endDateInput => {
        endDateInput.addEventListener('change', () => {
            validateTime(endDateInput);
            startDateInputs.forEach(startDateInput => {
                validateTimeRange(startDateInput, endDateInput);
            });
        });
    });
}

