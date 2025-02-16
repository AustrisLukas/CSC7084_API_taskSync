const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();


router.get('/user/tasks/:id', controller.getUserTasks);
router.get('/user/categories/:id', controller.getUserCategories);
router.get('/testAPI', controller.testAPI);

router.post('/user/getuserid', controller.getUserID);
router.post('/user/tasks', controller.getUserTasksFiltered)
router.post('/login', controller.processLogin);
router.post('/register', controller.processRegister);

module.exports = router;