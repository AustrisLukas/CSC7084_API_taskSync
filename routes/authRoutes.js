const express = require('express');
const authRouter = express.Router();
const {renderLogin, renderRegister, processLogin, processRegister} = require('./../controllers/authController');


authRouter.get('/login', renderLogin);
authRouter.get('/register', renderRegister);

authRouter.post('/login', processLogin);
authRouter.post('/register',processRegister);


module.exports = authRouter;