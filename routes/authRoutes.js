const express = require('express');
const authRouter = express.Router();
const {renderLogin, renderRegister, processLogin} = require('./../controllers/authController');


authRouter.get('/login', renderLogin);
authRouter.get('/register', renderRegister);

authRouter.post('/login', processLogin);


module.exports = authRouter;