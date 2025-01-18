const path = require('path');
const dbpool = require(path.join(__dirname, '/..', '/utils/dbconn.js'));
const bcrypt = require('bcrypt');


exports.renderLogin = (req,res) =>{
    res.render('login');
};
exports.processLogin = async (req,res)=>{
    const {user_email, user_password, remember} = req.body;
    try{
        const SELECT_USER = "SELECT * FROM user_account WHERE user_email = ?";
        const[users] = await dbpool.query(SELECT_USER, user_email);
        if (!users || users.length > 1) throw new Error("None or more than one user with matching emails found");
        
        if (await bcrypt.compare(user_password, users[0].hashed_password)) {
            console.log("Log in: success")
            //create session ID
        } else {
            //reject log in
        }
    } catch (error) {
        console.log(error);
    }
}



exports.renderRegister = (req,res) =>{
    res.render('register');
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
        connection.release()
    }
};