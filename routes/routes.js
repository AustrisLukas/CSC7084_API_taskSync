const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();


router.get('/user/tasks/:id', controller.getUserTasks);
router.get('/user/categories/:id', controller.getUserCategories);
router.get('/testAPI', controller.testAPI);
router.get('/getcolours', controller.getAvailableColours);

router.post('/user/getuserid', controller.getUserID);
router.post('/user/tasks', controller.getUserTasksFiltered)
router.post('/login', controller.processLogin);
router.post('/register', controller.processRegister);
router.post('/newtask', controller.processNewTask);
router.post('/addnewcategory', controller.addNewCategory);

router.put('/update', controller.updateTask);

router.patch('/complete/:id', controller.completeTask)
router.patch('/updateCategories', controller.updateCategories);

router.delete('/delete/:id', controller.deleteTask);

module.exports = router;