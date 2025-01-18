
const express = require('express');
const { renderHome, renderError, renderHome_filtered, renderLogin, renderRegister, processRegister, renderNewTask, processLogin } = require('./userController');
const router = express.Router();



router.get('/', renderHome);
router.post('/',renderHome_filtered);
router.get('/new', renderNewTask);
router.get('*', renderError);

module.exports = router;