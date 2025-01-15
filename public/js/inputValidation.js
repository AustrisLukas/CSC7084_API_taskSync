/**
 * Validates a name input field in a form using a regex pattern.
 * Applies Bootstrap's `is-valid` and `is-invalid` classes to indicate validation state.
 *
 * @param {HTMLFormElement} form - The form element containing the name input field to validate.
 * @returns {boolean} - Returns `true` if the name is valid; otherwise, `false`.
 *
 * Validation Rules:
 * - Name must be between 2 and 20 characters long.
 * - Only alphabetic characters (uppercase and lowercase) are allowed.
 *
 * Visual Feedback:
 * - Adds `is-invalid` class if the name is invalid.
 * - Adds `is-valid` class for successful validation.
 */
function nameValidation(form){
    let isValid = true;
    const usernameRegex = /^[a-zA-Z]{2,20}$/;

    const inputField = form.querySelector('input[name="name"]');
    

    if (!usernameRegex.test(inputField.value)){
        isValid = false;
        inputField.classList.remove('is-valid');
        inputField.classList.add('is-invalid');
    } else {
        inputField.classList.remove('is-invalid');
        inputField.classList.add('is-valid');
        
    }
    return isValid;
};

/**
 * Validates an email input field in a form using a regex.
 * Applies Bootstrap's `is-valid` and `is-invalid` classes to indicate validation state.
 *
 * @param {HTMLFormElement} form - The form element containing the email input field to validate.
 * @returns {boolean} - Returns `true` if the email is valid; otherwise, `false`.
 *
 * Validation Rules:
 * - Email must follow the format: `username@domain.tld`
 *   - `username` may contain alphanumeric characters, dots (.), underscores (_), percent (%), plus (+), and hyphens (-).
 *   - `domain` must be a valid hostname.
 *   - `tld` (top-level domain) must be at least two alphabetic characters.
 *
 * Visual Feedback:
 * - Adds `is-invalid` class if the email is invalid.
 * - Adds `is-valid` class for successful validation.
 */
function emailValidation(form){
    let isValid = true;
    // Regex pattern to validate email format (alphanumeric, dot, underscore, percent, plus, and hyphen characters allowed before and after @, followed by a valid domain and TLD)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const inputField = form.querySelector('input[name="user_email"]');

    if (!emailRegex.test(inputField.value)){
        isValid = false;
        inputField.classList.remove("is-valid");
        inputField.classList.add("is-invalid");
    } else {
        inputField.classList.remove("is-invalid");
        inputField.classList.add("is-valid");

    }
    return isValid;
}
/**
 * Validates password fields in a form based on complexity requirements and ensures passwords match.
 * Applies Bootstrap's `is-valid` and `is-invalid` classes to indicate validation state.
 *
 * @param {HTMLFormElement} form - The form element containing the password fields to validate.
 * @returns {boolean} - Returns `true` if both passwords meet the requirements and match; otherwise, `false`.
 *
 * Validation Rules:
 * - Password must be at least 8 characters long.
 * - Password must include:
 *   - At least one lowercase letter.
 *   - At least one uppercase letter.
 *   - At least one digit.
 *   - At least one special character (@, $, !, %, *, ?, &).
 * - Passwords must match.
 *
 * Visual Feedback:
 * - Adds `is-invalid` class and appropriate error messages if validation fails.
 * - Adds `is-valid` class for successful validation.
 */
function validatePassword(form){

    let isValid = true;
    // Password regex: Requires at least 8 characters, including one lowercase letter, one uppercase letter, one digit, and one special character.
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const password1 = form.querySelector('input[name="password1"]');
    const password1feedback = password1.nextElementSibling.nextElementSibling;
    const password2 = form.querySelector('input[name="password2"]');
    const password2feedback = password2.nextElementSibling.nextElementSibling;
    

    if (!passwordRegex.test(password1.value)) {
        password1.classList.remove("is-valid");
        password1.classList.add("is-invalid");
        password1feedback.innerHTML ="Password complexity requirement not met - must contain at least:<br>one lowercase,<br>one uppercase,<br>one digit,<br>one special character."
        isValid = false;
    } else {
        password1.classList.remove("is-invalid");
        password1.classList.add("is-valid");
        password1feedback.nextElementSibling.textContent ="Password complexity requirement met"
    }

    if (password1.value !== password2.value || password2.value == ''){
        password2.classList.remove("is-valid");
        password2.classList.add("is-invalid");
        password2feedback.textContent ="Passwords do not match"
        isValid = false;
    } else {
        password2.classList.remove("is-invalid");
        password2.classList.add("is-valid");
        password2feedback.nextElementSibling.textContent ="Passwords match"
    }
    return isValid;
}

function hasAcceptedTerms(form){

    let accepted = true;
    let checkbox = form.querySelector('input[name="termsAndConditions"]');

    if (!checkbox.checked){
        accepted = false;
        checkbox.classList.remove('is-valid');
        checkbox.classList.add('is-invalid');
    } else {
        checkbox.classList.remove('is-invalid');
        checkbox.classList.add('is-valid');
    }
    return accepted;


}

export {nameValidation, emailValidation, validatePassword, hasAcceptedTerms};