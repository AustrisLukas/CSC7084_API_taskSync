const express = require('express');
const controller = require('../controllers/controller');
const statsController = require('../controllers/statsController');
const router = express.Router();


router.get('/user/tasks/:id', controller.getUserTasks);
router.get('/user/categories/:id', controller.getUserCategories);
router.get('/testAPI', controller.testAPI);
router.get('/getcolours', controller.getAvailableColours);
//STATS GET ROUTES
router.get('/stats/taskspercategory/:id', statsController.getTasksPerCategory);
router.get('/stats/getduesummary/:id', statsController.getDueSummary);
router.get('/stats/getopencompletesummary/:id', statsController.getOpenCompleteSummary);
router.get('/stats/geturgencysummary/:id', statsController.getUrgencySummary);

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