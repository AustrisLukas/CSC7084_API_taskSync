const {body} = require('express-validator');


//General user input sanitisation against malicious attacks
const sanitizeAllFields = [
    body("*").trim().escape(), //Applies to all fields
]

const validateLoginInput = [

    //validate user imput for user_name
    body ('user_email')
    .isEmail().withMessage('Backend Validation: Email format not valid.'),

    //validate user input for password
    body('user_password')
    .notEmpty().withMessage('Backend Validation: Password is required')
    .isLength({min: 1}).withMessage('Backend Validation: Password must be at least 8 characters long')
    .isLength({max: 100}).withMessage('Backend Validation: Password must be less than 100 characters')
    //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Backend Validation: Password complexity not met')
]

const validateRegisterInput = [

    //validate input for user_email
    body ('user_email')
    .isEmail().withMessage('Backend Validation: Email format not valid.'),

    //validate input for password
    body('password2')
    .notEmpty().withMessage('Backend Validation: Password is required')
    .isLength({min: 8}).withMessage('Backend Validation: Password must be at least 8 characters long')
    .isLength({max: 100}).withMessage('Backend Validation: Password must be less than 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Backend Validation: Password complexity not met'),

    //validate input for name
    body ('name')
    .notEmpty().withMessage('Backend Validation: Name field must not be empty.')
    .isLength({min: 2}).withMessage('Backend Validation: Name must be at least 2 characters long')
    .isLength({max: 100}).withMessage('Backend Validation: Name must not contain more than 100 characters.')
    .matches(/^[a-zA-Z]+$/).withMessage('Backend Validation: Name must be alphabetic characters')
]


module.exports = {sanitizeAllFields, validateLoginInput, validateRegisterInput}