/**
 * Validates name input using regex and applies Bootstrap is-valid/is-invalid classes accordingly.
 * Allowable -  Alphabetical characters - min:2, max:20
 * @param {*} form - input form
 * @returns - true is valid, false otherwise.
 */
/*
function nameValidation(form){
    let isValid = true;
    const usernameRegex = /^[a-zA-Z]{2,20}$/;

    const inputField = form.querySelector('input[name="name"]');
    console.log(`name of ${inputField.value}`);

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

export default {nameValidation};

*/