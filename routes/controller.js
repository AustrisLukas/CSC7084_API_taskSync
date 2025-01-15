/**
 * 
 */
const path = require('path');
const dbpool = require(path.join(__dirname, '/..', '/utils/dbconn.js'));
const { format, isAfter, differenceInCalendarDays } = require("date-fns");
const { formatDisplayDate, limitTextLength, formatDate, formatDateforHTML } = require('../utils/homeUtils');
const {appendSortSuffix, getCheckboxState} = require(path.join(__dirname,'/..', '/utils/filterSortUtils.js'));
const {getStarUrl, getCardStyle} = require(path.join(__dirname,'/..', '/utils/homeUtils.js'));



//SQL Querries
const SELECT_ALL_TASKS = 'SELECT * FROM task';
const SELECT_ALL_INNER_JOIN = `SELECT * FROM task
INNER JOIN
task_category ON task.task_category_id = task_category.task_category_id
INNER JOIN 
category_colour ON task_category.colour_id = category_colour.colour_id
WHERE task.user_id = 1`;
const SELECT_USER_DEFINED_CATEGORIES = `SELECT category_name FROM task_category WHERE task_category.user_id = ?`;
const SELECT_FILTERED = `SELECT * FROM task
INNER JOIN
task_category ON task.task_category_id = task_category.task_category_id
INNER JOIN 
category_colour ON task_category.colour_id = category_colour.colour_id
WHERE task.user_id = (?) AND category_name IN (?)`;


exports.renderHome = async (req, res) => {

    let user_id = 1;
    //empty array will default to all categories showing.
    let selected_categories = [];
    let show_completed = 'off';

    try {
        const [user_categories] = await dbpool.query(SELECT_USER_DEFINED_CATEGORIES, user_id);
        const [rows] = await dbpool.query(SELECT_ALL_INNER_JOIN); 

        res.render('home', { elements: rows, format, isAfter, differenceInCalendarDays, user_categories, selected_categories, show_completed, getStarUrl, getCardStyle, formatDisplayDate, limitTextLength});
    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).send("Internal Server Error");
    }
};

/*
* Renders user tasks with FILTER and SORT(optional) parameters applied. Category filters sort preference are received in req.* body. Query utilises appendSortSuffix to apply sort suffix to search querry.
*/
exports.renderHome_filtered = async (req, res) => {

    //Query selected categories and filter
    let selected_categories = req.body.selected_category;
    let sort_by = req.body.sort_by;
    let show_completed = req.body.show_completed || 'off';
    let user_id = 1;

    try {
        
        //Look up user-defined task categories.
        const [user_categories] = await dbpool.query(SELECT_USER_DEFINED_CATEGORIES, user_id);
        const [rows] = await dbpool.query(appendSortSuffix(sort_by, SELECT_FILTERED),[user_id,selected_categories]); 

        res.render('home', { elements: rows, format, isAfter, differenceInCalendarDays, user_categories, selected_categories, getCheckboxState, show_completed, getStarUrl, getCardStyle, formatDisplayDate, limitTextLength,});
    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).send("Internal Server Error");
    } finally{

    }
};


exports.renderLogin = ('/login', (req,res) =>{
    res.render('login');

});

exports.renderRegister = ('/register', (req,res) =>{

    res.render('register');
});
exports.processRegister = ('/register', (req,res)=>{
    console.log('in process reg');
    console.log(req.body);
});

exports.renderNewTask = async (req,res)=>{

    let user_id = 1;

    try{
        const [user_categories] = await dbpool.query(SELECT_USER_DEFINED_CATEGORIES, user_id);
        res.render('newTask', {getStarUrl, user_categories});
        


    } catch (err){
        console.log(err);

    }
};




exports.renderError = ('*', (req,res) =>{
    res.send("<h1>Error 404</h> /n <p>Page not found</p>")
})