const express = require('express');
const controller = require('../controllers/controller');
const statsController = require('../controllers/statsController');
const router = express.Router();
const middleware = require('../middleware/inputValidation')



//GET routes
router.get('/user/tasks/:id', controller.getUserTasks);
router.get('/user/categories/:id', controller.getUserCategories);
router.get('/testAPI', controller.testAPI);
router.get('/getcolours', controller.getAvailableColours);
//GET ROUTES for STATISTICS information
router.get('/stats/taskspercategory/:id', statsController.getTasksPerCategory);
router.get('/stats/getduesummary/:id', statsController.getDueSummary);
router.get('/stats/getopencompletesummary/:id', statsController.getOpenCompleteSummary);
router.get('/stats/geturgencysummary/:id', statsController.getUrgencySummary);

//POST routes
router.post('/user/getuserid',middleware.sanitizeAllFields, controller.getUserID);
router.post('/user/tasks',middleware.sanitizeAllFields, controller.getUserTasksFiltered)
router.post('/login',middleware.sanitizeAllFields, middleware.validateLoginInput, controller.processLogin);
router.post('/register',middleware.sanitizeAllFields, middleware.validateRegisterInput, controller.processRegister);
router.post('/newtask',middleware.sanitizeAllFields, controller.processNewTask);
router.post('/addnewcategory',middleware.sanitizeAllFields, controller.addNewCategory);

//PUT routes
router.put('/update',middleware.sanitizeAllFields, controller.updateTask);

//PATCH routes
router.patch('/complete/:id', middleware.sanitizeAllFields, controller.completeTask)
router.patch('/updateCategories',middleware.sanitizeAllFields, controller.updateCategories);

//DELETE routes
router.delete('/delete/:id', controller.deleteTask);

module.exports = router;