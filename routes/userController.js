/**
 * 
 */
const path = require('path');
const dbpool = require(path.join(__dirname, '/..', '/utils/dbconn.js'));
const { format, isAfter, differenceInCalendarDays } = require("date-fns");
const { formatDisplayDate, limitTextLength, formatDate, formatDateforHTML } = require('../utils/homeUtils');
//const { connect } = require('../utils/dbconn');
const {appendSortSuffix, getCheckboxState} = require(path.join(__dirname,'/..', '/utils/filterSortUtils.js'));
const {getStarUrl, getCardStyle} = require(path.join(__dirname,'/..', '/utils/homeUtils.js'));
const bcrypt = require('bcrypt');



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

        res.render('home', { elements: rows, format, isAfter, differenceInCalendarDays, user_categories, selected_categories, getCheckboxState, show_completed, getStarUrl, getCardStyle, formatDisplayDate, limitTextLength, formatDateforHTML});
    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).send("Internal Server Error");
    }
};






/**
 * Processes user registration by validating input, checking for existing users,
 * and inserting user details and account information into the database.
 * 
 * @async
 * @function processRegister
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.name - The user's name.
 * @param {string} req.body.user_email - The user's email address.
 * @param {string} req.body.password2 - The user's password.
 * @param {Object} res - The HTTP response object.
 * 
 * @throws {Error} - If there is an issue querying the database or during transaction operations.
 */
exports.processRegister = async (req,res)=>{

    const {name, user_email, password2} = req.body;

    //Check that email address is not yet registered.
    const SELECT_USERS = "SELECT * FROM user_account WHERE user_email = ?";
    try {
        const [current_user] = await dbpool.query(SELECT_USERS, user_email);
        console.log(current_user);
        if (current_user && current_user.length > 0){
            res.status(409).send("<h1>Error 409</h1><h2>Email already in use</h2>");
        }
    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).send("Internal Server Error");
    }

    //If no match found, proceed with user registration
    const INSERT_INTO_user_details = 'INSERT INTO user_details (first_name, last_name, last_edit_timestamp) VALUES (?, ?,current_timestamp())';
    const INSERT_INTO_user_account = 'INSERT INTO user_account (user_email, hashed_password, date_created, account_status_id, user_details_id) VALUES (?, ?, current_timestamp(), ?, ?)';

    const connection = await dbpool.getConnection();
    try {
        await connection.beginTransaction();
        //Write user details
        const [userDetailsResult] = await connection.query(INSERT_INTO_user_details, [name, null]);

        //Write user account details
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password2, salt);
        const accountStatus = 1;
        const userId = userDetailsResult.insertId;

        const [userAccountResult] = await connection.query(INSERT_INTO_user_account, [user_email, hashedPassword, accountStatus, userId]);
        await connection.commit();
        res.redirect('/');
    } catch (error){
        console.error("Error querying the database:", error);
        connection.rollback();
        res.status(500).send("Internal Server Error");
    } finally{
        console.log("DONE")
        connection.release()
    }
};

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