const path = require("path");
const dbpool = require(path.join(__dirname, "/..", "/utils/dbconn.js"));
const { appendSortSuffix, getCheckboxState } = require(path.join(__dirname, "/..", "/utils/filterSortUtils.js"));
const { format } = require("date-fns");
const { logMessage } = require(path.join(__dirname, "/..", "/utils/apiUtils.js"));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");


exports.testAPI = async (req, res) => {
  logMessage("Executing testAPI.");

  const SELECT_1 = "SELECT 1";
  try {
    dbpool.query(SELECT_1);
    logMessage("testAPI - Success.");
    res.status(200).json({ success: true });
  } catch (err) {
    logMessage("testAPI - Failed.");
    res.status(500).json({ success: false });
  }
};

exports.getUserID = async (req, res) => {
  const { user_email } = req.body;
  logMessage(`Executing getUserID for ${user_email}.`);
  const SELECT_USER_ID = `SELECT user_id FROM user_account WHERE user_email = '${user_email}'`;

  try {
    const [rows] = await dbpool.query(SELECT_USER_ID);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "No matching records found" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

exports.getUserCategories = async (req, res) => {
  const { id } = req.params;
  logMessage(`Executing getUserCategories for user_id ${id}.`);

  const SELECT_USER_DEFINED_CATEGORIES = `SELECT 
  task_category.task_category_id,
  task_category.category_name,
  task_category.user_id,
  task_category.colour_id,
  category_colour.colour_name,
  category_colour.colour_url
  FROM task_category INNER JOIN category_colour ON task_category.colour_id = category_colour.colour_id WHERE task_category.user_id = ${id}`;

  //const SELECT_USER_DEFINED_CATEGORIES = `SELECT * FROM task_category WHERE task_category.user_id = ${id}`;

  try {
    const [rows] = await dbpool.query(SELECT_USER_DEFINED_CATEGORIES);
    res.status(200);
    res.json(rows);
    //console.log(rows);
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

exports.getUserTasks = async (req, res) => {
  const { id } = req.params;
  logMessage(`Executing getUserTasks for user_id ${id}.`);
  const SELECT_USER_TASKS = `SELECT * FROM task 
  INNER JOIN task_category ON task.task_category_id = task_category.task_category_id 
  INNER JOIN category_colour ON task_category.colour_id = category_colour.colour_id 
  WHERE task.user_id = ${id}`;

  try {
    const [rows] = await dbpool.query(SELECT_USER_TASKS);
    res.status(200);
    res.json(rows);
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

exports.getUserTasksFiltered = async (req, res) => {
  logMessage(`Executing getUserTasksFiltered`);

  const SELECT_FILTERED = `SELECT * FROM task
INNER JOIN
task_category ON task.task_category_id = task_category.task_category_id
INNER JOIN 
category_colour ON task_category.colour_id = category_colour.colour_id
WHERE task.user_id = ? AND category_name IN (?)`;

  const { sort_by, selected_category, show_completed, user_id } = req.body;

  try {
    const [rows] = await dbpool.query(appendSortSuffix(sort_by, SELECT_FILTERED), [user_id, selected_category]);
    res.status(200);
    res.json(rows);
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

exports.processLogin = async (req, res) => {
  logMessage(`Executing processLogin`);

  
  //Check for validation errors and handle
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    
    const errorMessages = errors.array().map(error => error.msg)
    logMessage(`Input validation failed in processLogin: ${errorMessages}`);
    return res.status(400).json({
      message: "Backend validation: Failed",
      errorMessages: errorMessages
    })
  }

  let duration;
  const { user_email, user_password, password_remember } = req.body;
  if (password_remember) {
    duration = "12h";
  } else {
    duration = "1h";
  }

  const SELECT_USER = "SELECT * FROM user_account WHERE user_email = ?";
  try {
    //Check that at least one username matches provided username
    const [users] = await dbpool.query(SELECT_USER, user_email);
    if (users.length < 1) {
      return res.status(404).json({ error: "User not found. Try again." });
    }
    //Compare provided password with retrieved username and its password.
    if (await bcrypt.compare(user_password, users[0].hashed_password)) {
      logMessage(`Succesfull login to ${user_email} account.`);
      //Log in success - generate jwt token
      const token = jwt.sign({}, process.env.JWT_KEY, { expiresIn: duration });

      res.status(200).json({
        message: "Login succesful",
        token,
        users,
      });
    } else {
      //reject log in
      return res.status(401).json({ error: "Incorrect username, or password credentials. Try again" });
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

exports.processRegister = async (req, res) => {

  logMessage("Executing processRegister");

  //Check for validation errors in user input.
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    const errorMessages = errors.array().map(error => error.msg)
    logMessage(`Input validation failed in processRegister: ${errorMessages}`);
    return res.status(400).json({
      message: "Backend validation: Failed",
      errorMessages: errorMessages
    })
  }

  const { name, user_email, password2 } = req.body;
  const defaultCategoryName1 = 'Work';
  const defaultCategoryName2 = 'Home';
  const defaultCategoryColour1 = 1;
  const defaultCategoryColour2 = 2;

  //Check that email address is not already in use.
  const SELECT_USERS = "SELECT * FROM user_account WHERE user_email = ?";
  try {
    const [new_user] = await dbpool.query(SELECT_USERS, user_email);
    if (new_user && new_user.length > 0) {
      return res.status(409).json({ error: "User e-mail already in use, try another registering with a different address." });
    }
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).send("Internal Server Error");
  }

  //If no match found, proceed with user registration
  const INSERT_INTO_user_details = "INSERT INTO user_details (first_name, last_name, last_edit_timestamp) VALUES (?, ?,current_timestamp())";
  const INSERT_INTO_user_account =
    "INSERT INTO user_account (user_email, hashed_password, date_created, account_status_id, user_details_id, role_id) VALUES (?, ?, current_timestamp(), ?, ?, ?)";
  const INSERT_INTO_task_category = "INSERT INTO task_category (category_name, user_id, colour_id) VALUES (?, ?, ?)";

  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    //Write user details
    const [userDetailsResult] = await connection.query(INSERT_INTO_user_details, [name, null]);
    //Write user account details
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password2, salt);
    const accountStatus = 1;
    const user_details_id = userDetailsResult.insertId;
    const role_id = 1;
    const [userAccountResult] = await connection.query(INSERT_INTO_user_account, [user_email, hashedPassword, accountStatus, user_details_id, role_id]);

    //Create default categories for new user
    const user_id = userAccountResult.insertId;
    await connection.query(INSERT_INTO_task_category,[defaultCategoryName1,user_id, defaultCategoryColour1]);
    await connection.query(INSERT_INTO_task_category,[defaultCategoryName2,user_id, defaultCategoryColour2]);

    await connection.commit();
    return res.status(200).json({ message: "New user account registered successfully." });
  } catch (error) {
    console.error("Error querying the database:", error);
    connection.rollback();
    res.status(500).send("Internal Server Error");
  } finally {
    connection.release();
  }
};

exports.processNewTask = async (req, res) => {
  logMessage("Executing processNewTask");
  
  const { task_title, task_desc, task_duedate, star_level, user_id, task_cat_id } = req.body;
  const INSERT_NEW_TASK = `INSERT INTO task (task_id, task_name, task_desc, created_date, due_date, date_completed, star_level, task_status_id, task_category_id, user_id) VALUES (NULL, ?, ?, current_timestamp(), ?, NULL, ?, 0, ?, ?)`;

  try {
    const result = await dbpool.query(INSERT_NEW_TASK, [task_title, task_desc, task_duedate, star_level, task_cat_id, user_id]);
    return res.status(200).json({ message: "New task created succesfully." });
  } catch (err) {
    return res.status(500).json({ message: "Error occurred while creating new task. Try again." });
  }
};

exports.updateTask = async (req, res) => {
  logMessage("Executing updateTask");

  const { task_name, task_desc, task_duedate, task_cat, task_star, task_id } = req.body;

  const UPDATE_TASK = `UPDATE task SET
   task_name = ?,
   task_desc = ?,
   due_date = ?,
   task_category_id = ?,
   star_level = ?
   WHERE task_id = ?`;

  try {
    const [result] = await dbpool.query(UPDATE_TASK, [task_name, task_desc, task_duedate, task_cat, task_star, task_id]);
    return res.status(200).json({ message: `Task updated succesfully, ${result.affectedRows} row affected.` });
  } catch (err) {
    logMessage(err);
    return res.status(500).json({ message: "Error occurred while updating task. Try again." });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  logMessage(`Executing deleteTask for task_id = ${id}`);

  const DELETE_TASK = `DELETE FROM task WHERE task_id = ?`;

  try {
    const [result] = await dbpool.query(DELETE_TASK, id);
    logMessage(`Deletion succesfully executed for task_id ${id},  ${result.affectedRows} rows affected.`);
    return res.status(200).json({ message: `Deletion succesfully executed for task_id ${id},  ${result.affectedRows} rows affected.` });
  } catch (err) {
    logMessage(err);
    return res.status(500).json({ message: "Error occurred while deleting task. Try again." });
  }
};

exports.completeTask = async (req, res) => {
  const { id } = req.params;
  logMessage(`Executing completeTask for task_id = ${id}`);

  const COMPLETE_TASK = "UPDATE task SET task_status_id = 1, date_completed = current_timestamp() WHERE task_id = ?";

  try {
    const [result] = await dbpool.query(COMPLETE_TASK, id);
    logMessage(`Succesfully completed task_id ${id},  ${result.affectedRows} rows affected.`);
    return res.status(200).json({ message: `Succesfully completed task_id ${id},  ${result.affectedRows} rows affected.` });
  } catch (err) {
    logMessage(err);
    return res.status(500).json({ message: "Error occurred while completing task. Try again." });
  }
};

exports.getAvailableColours = async (req, res) => {
  logMessage(`Executing getAvailableColours`);
  const SELECT_ALL_CATEGORY_COLOURS = `SELECT * FROM category_colour`;

  try {
    const [result] = await dbpool.query(SELECT_ALL_CATEGORY_COLOURS);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error occured while getting category colours" });
  }
};

exports.updateCategories = async (req, res) => {
  logMessage(`Executing updateCategories`);
  const { task_category_id, category_name, colour_id } = req.body;

  const UPDATE_CATEGORIES = `UPDATE task_category SET category_name = ?, colour_id = ? WHERE task_category.task_category_id = ?`;

  try {
    for (let i = 0; i < req.body.task_category_id.length; i++) {
      await dbpool.query(UPDATE_CATEGORIES, [category_name[i], colour_id[i], task_category_id[i]]);
    }
    return res.status(200).json({ message: "Categories updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error occured while updating categories" });
  }
};

exports.addNewCategory = async (req, res) => {
  logMessage(`Executing addNewCategory`);

  const { category_name, user_id, colour_id } = req.body;

  const INSERT_INTO_CATEGORIES = `INSERT INTO task_category (task_category_id, category_name, user_id, colour_id) VALUES(NULL, ?, ?, ?)`;

  try {
    const result = dbpool.query(INSERT_INTO_CATEGORIES, [category_name, user_id, colour_id]);
    return res.status(200).json({ message: `New category succesfully created` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occrred while creating new task category" });
  }
};
