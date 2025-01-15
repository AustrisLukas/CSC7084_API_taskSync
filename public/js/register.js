console.log("in reg");
import {nameValidation, emailValidation, validatePassword, hasAcceptedTerms} from '/js/inputValidation.js';



// Disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all forms to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {

        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            if (!nameValidation(form)) {
                event.preventDefault()
                event.stopPropagation()
            } 
            if (!emailValidation(form)) {
                event.preventDefault()
                event.stopPropagation()
            } 
            if (!validatePassword(form)) {
                event.preventDefault()
                event.stopPropagation()
            } 
            if (!hasAcceptedTerms(form)) {
                event.preventDefault()
                event.stopPropagation()
            } 
            
        }, false)
    })
})();





