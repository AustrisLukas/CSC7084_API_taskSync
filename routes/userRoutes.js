
const express = require('express');
const { renderHome, renderError, renderHome_filtered, renderLogin, renderRegister, processRegister, renderNewTask, processLogin } = require('./userController');
const router = express.Router();



router.get('/', renderHome);
router.post('/',renderHome_filtered);

//router.get('/login', renderLogin);
//router.post('/login', processLogin);

//router.get('/register', renderRegister);
router.post('/register', processRegister);

router.get('/new', renderNewTask);



router.get('*', renderError);

module.exports = router;