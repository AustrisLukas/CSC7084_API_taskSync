const path = require("path");
const dbpool = require(path.join(__dirname, "/..", "/utils/dbconn.js"));
const { appendSortSuffix, getCheckboxState } = require(path.join(__dirname, "/..", "/utils/filterSortUtils.js"));
const { format } = require("date-fns");
const { logMessage } = require(path.join(__dirname, "/..", "/utils/apiUtils.js"));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");


/**
 * A test API endpoint used to check the database connection.
 * 
 * This function performs a simple query (`SELECT 1`) to the database to ensure that the database connection is active and functional.
 * - If the query is successful, a `200 OK` response with a success status is returned.
 * - If there is an error while querying the database, a `500 Internal Server Error` response with a failure status is returned.
 */
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


/**
 * Retrieves the user ID based on the provided email address.
 * 
 * This function accepts an email address from the request body, queries the database to find the corresponding user ID,
 * and returns the result.
 * - If a matching user is found, the user ID is returned with a `200 OK` response.
 * - If no matching user is found, a `404 Not Found` response is returned with an error message.
 * - If there is an error with the database query, a `500 Internal Server Error` response is sent.
 */
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

/**
 * Retrieves the categories defined by a user, including category name, associated color, and color URL.
 * 
 * This function accepts a user ID as a route parameter, queries the database to retrieve the categories associated
 * with that user, and returns the result.
 * - If categories are found for the given user ID, a `200 OK` response is returned with the category details.
 * - If no categories are found for the given user ID, a `404 Not Found` response is returned with an error message.
 * - If there is an error with the database query, a `500 Internal Server Error` response is sent.
 */
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
    if (rows.length <1 ) return res.status(404).json({message: `User_id ${id} categories not found`});
    res.status(200).json(rows);
    
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

/**
 * Retrieves a list of tasks for a specific user, filtered by category and optionally sorted.
 * 
 * This function queries the database to fetch tasks associated with the user specified by `user_id` from the request body.
 * It filters tasks based on the `selected_category` and applies sorting suffix to the querry via appendSortSuffix helper function.
 * 
 * - The `selected_category` filters the tasks by category.
 * - The `sort_by` field determines how the tasks should be sorted (e.g., by due date, priority, etc.).
 * - The `show_completed` field, although received in the request, is not yet utilized in this implementation.
 */
exports.getUserTasksFiltered = async (req, res) => {
  logMessage(`Executing getUserTasksFiltered`);

  const SELECT_FILTERED = `SELECT * FROM task
INNER JOIN
task_category ON task.task_category_id = task_category.task_category_id
INNER JOIN 
category_colour ON task_category.colour_id = category_colour.colour_id
WHERE task.user_id = ? AND category_name IN (?)`;

  const { sort_by, selected_category, show_completed, user_id } = req.body;
  //console.log(selected_category);

  try {
    const [rows] = await dbpool.query(appendSortSuffix(sort_by, SELECT_FILTERED), [user_id, selected_category]);
  
    res.status(200);
    res.json(rows);
    
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.error("Error querying the database:", err);
  }
};

/**
 * Handles user login by validating the request, checking credentials, and generating a JWT token.
 * 
 * This function is executed when the user submits their login form. It performs the following:
 * - Validates the input fields (email and password).
 * - Checks the provided email against the database.
 * - Compares the provided password with the stored hashed password.
 * - If the credentials are valid, generates a JWT token and returns it to the user.
 * - Handles errors by returning appropriate HTTP status codes and messages.
 */
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

  //Checks if "remember password" was selected
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

/**
 * Handles the user registration process, including input validation, email uniqueness check, 
 * user account creation, and creation of default task categories for the new user.
 * 
 * This function performs the following steps:
 * - Validates the user's input (name, email, password).
 * - Checks if the provided email is already in use.
 * - Registers the user by inserting their details into the database.
 * - Creates default task categories (e.g., "Work" and "Home") for the new user.
 * - Uses database transactions to ensure atomicity during the registration process.
 */
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
      return res.status(409).json({ error: "e-mail address already in use, try registering with a different address." });
    }
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).send("Internal Server Error");
  }

  //If no match found in the above code, proceed with user registration
  const INSERT_INTO_user_details = "INSERT INTO user_details (first_name, last_name, last_edit_timestamp) VALUES (?, ?,current_timestamp())";
  const INSERT_INTO_user_account =
    "INSERT INTO user_account (user_email, hashed_password, date_created, account_status_id, user_details_id, role_id) VALUES (?, ?, current_timestamp(), ?, ?, ?)";
  const INSERT_INTO_task_category = "INSERT INTO task_category (category_name, user_id, colour_id) VALUES (?, ?, ?)";

  //Start transaction
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
    return res.status(200).json({ message: `New user account registered successfully.` });
  } catch (error) {
    console.error("Error querying the database:", error);
    connection.rollback();
    res.status(500).send("Internal Server Error");
  } finally {
    connection.release();
  }
};

/**
 * Handles the creation of a new task for a user. This function inserts the task details 
 * into the database and returns an appropriate response to the client.
 * 
 * The process involves:
 * - Extracting the task details (title, description, due date, star level, category, and user ID) from the request body.
 * - Inserting the new task into the `task` table with the provided details.
 * - Returning a success response if the task is created, or an error response if there is an issue during the database operation.
 */
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

/**
 * Handles updating an existing task in the database. This function modifies the task details 
 * based on the provided task ID and updates its properties such as name, description, due date, 
 * category, and star level.
 * 
 * The process involves:
 * - Extracting the task details (task_name, task_desc, task_duedate, task_cat, task_star, task_id) from the request body.
 * - Running an SQL query to update the task in the `task` table using the provided task ID.
 * - Returning a success message along with the number of rows affected if the update is successful.
 * - Returning an error message if the update fails.
 */
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
    return res.status(500).json({ message: `Unxpected issue occurred while editing task -  ${err}` });
  }
};

/**
 * Handles the deletion of a task from the database based on the provided task ID.
 * The function attempts to delete the task from the `task` table using the given task ID.
 * If the task is not found, a `404` status is returned. If the deletion is successful,
 * a `200` status with the number of affected rows is returned.
 */
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  logMessage(`Executing deleteTask for task_id = ${id}`);

  //CHECK IF USER REQUESTER OWNS TASK BEFORE DELETION
  try {
    const TASK_OWNER_ID = `SELECT user_id FROM task where task_id = ${id}`;
    const [taskOwnerID] = await dbpool.query(TASK_OWNER_ID);
    //console.log(taskOwnerID[0].user_id);

    if (req.headers.user_id != taskOwnerID[0].user_id) {
      logMessage(`Task Delete rejected, user_id missmatch`);
      return res
        .status(401)
        .json({ message: "Task Delete rejected, user_id missmatch" });
    }
  } catch (err) {
    logMessage(err);
    return res.status(500).json({ message: "Error occurred while deleting task. Try again." });
  }

  //PROCEED WITH TASK DELETION
  try {
    const DELETE_TASK = `DELETE FROM task WHERE task_id = ?`;
    const [result] = await dbpool.query(DELETE_TASK, id);
    if (result.affectedRows < 1) return res.status(404).json({message: `Unanble to delete task, task_id ${id} not found.`});
    logMessage(`Deletion succesfully executed for task_id ${id},  ${result.affectedRows} rows affected.`);
    return res.status(200).json({ message: `Deletion succesfully executed for task_id ${id},  ${result.affectedRows} rows affected.` });
  } catch (err) {
    logMessage(err);
    return res.status(500).json({ message: "Error occurred while deleting task. Try again." });
  }
};

/**
 * Marks a task as completed by updating the `task_status_id` to `1` (completed) and setting the `date_completed` 
 * field to the current timestamp. The function attempts to complete the task in the database based on the provided task ID.
 * If the task is not found, a `404` status is returned. If the task is successfully completed, a `200` status is returned.
 */
exports.completeTask = async (req, res) => {
  const { id } = req.params;
  logMessage(`Executing completeTask for task_id = ${id}`);

  const COMPLETE_TASK = "UPDATE task SET task_status_id = 1, date_completed = current_timestamp() WHERE task_id = ?";

  try {
    const [result] = await dbpool.query(COMPLETE_TASK, id);
    if (result.affectedRows < 1) return res.status(404).json({message: `Unanble to complete task, task_id ${id} not found.`});
    logMessage(`Succesfully completed task_id ${id},  ${result.affectedRows} rows affected.`);
    return res.status(200).json({ message: `Succesfully completed task_id ${id},  ${result.affectedRows} rows affected.` });
  } catch (err) {
    logMessage(err);
    return res.status(500).json({ message: "Error occurred while completing task. Try again." });
  }
};


/**
 * Retrieves all available category colours from the `category_colour` table in the database.
 * The function fetches the data and returns it in the response as JSON. 
 * If an error occurs during the database query, a `500` status is returned.
 */
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


/**
 * Updates multiple task categories in the database with new names and associated colours.
 * The function iterates through the provided data and updates the `task_category` table for each task category.
 * If any error occurs during the update process, a `500` error status is returned.
 */
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


/**
 * Adds a new task category to the database for a specified user.
 * The function takes the category name, user ID, and colour ID from the request body and inserts them into the `task_category` table.
 * If the operation is successful, a `200` status is returned with a success message. If an error occurs, a `500` status is returned.
 */
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
