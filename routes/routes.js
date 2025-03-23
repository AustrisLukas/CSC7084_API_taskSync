const express = require('express');
const controller = require('../controllers/controller');
const statsController = require('../controllers/statsController');
const router = express.Router();
const middleware = require('../middleware/inputValidation');
const authMidleware = require('../middleware/auth')



//GET routes
router.get('/user/categories/:id',authMidleware.authenticateToken, controller.getUserCategories);
router.get('/testAPI', controller.testAPI);
router.get('/getcolours',authMidleware.authenticateToken, controller.getAvailableColours);
//GET ROUTES for STATISTICS information
router.get('/stats/taskspercategory/:id',authMidleware.authenticateToken, statsController.getTasksPerCategory);
router.get('/stats/getduesummary/:id',authMidleware.authenticateToken, statsController.getDueSummary);
router.get('/stats/getopencompletesummary/:id',authMidleware.authenticateToken, statsController.getOpenCompleteSummary);
router.get('/stats/geturgencysummary/:id',authMidleware.authenticateToken, statsController.getUrgencySummary);

//POST routes
router.post('/user/getuserid',middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.getUserID);
router.post('/user/tasks',middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.getUserTasksFiltered)
router.post('/login',middleware.sanitizeAllFields, middleware.validateLoginInput, controller.processLogin);
router.post('/register',middleware.sanitizeAllFields, middleware.validateRegisterInput, controller.processRegister);
router.post('/newtask',middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.processNewTask);
router.post('/addnewcategory',middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.addNewCategory);

//PUT routes
router.put('/update',middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.updateTask);

//PATCH routes
router.patch('/complete/:id', middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.completeTask);
router.patch('/updateCategories',middleware.sanitizeAllFields,authMidleware.authenticateToken, controller.updateCategories);

//DELETE routes
router.delete('/delete/:id',authMidleware.authenticateToken, controller.deleteTask);

module.exports = router;