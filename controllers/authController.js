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
