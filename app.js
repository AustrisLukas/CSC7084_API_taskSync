const express = require('express');
//const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const router = require("./routes/router.js");
const dotenv = require('dotenv').config({ path: './config.env' });
const dbpool = require(path.join(__dirname, '/utils/dbconn.js'));

//const cookieParser = require("cookie-parser");
//const session = require("express-session");
//const authRouter = require("./routes/auth");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
//app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 
app.use('/', (req, res, next) =>{
    console.log(`payload of this message: ${req.body.selected_category}`);
    next();
});
*/

app.use('/', router);
startServer();


async function startServer(){
    try {
        const PORT = process.env.PORT || 3000;
        await testDatabaseConn();
        app.listen(PORT, () => {
            console.log(`App - Listening on PORT: ${process.env.PORT}`);
        });
    } catch (error){
        console.log(`Failed to start application: ${error.message}`);
        process.exit(1);
    }
};


/**
 * Tests database connectivity with up to 3 retries, each separated by a 2-second delay.
 * Throws an error if all attempts fail.
 */
async function testDatabaseConn(){
    let attempt = 0;
    const maxAttempt = 3;

    while (attempt <= maxAttempt) {
        try {
            await dbpool.query('SELECT 1');
            console.log(`Database - Success opening PORT: ${process.env.DB_PORT}`);
            return true;
        } catch (error) {
            attempt++;
            console.log(`Database - Error establishing after attempt ${attempt}`);
            console.error(error);
            
        }
        if (attempt == maxAttempt) throw new Error('Database - Conection attempts exceeded.');

        // 2000ms delay before attempting read again.
        await new Promise((resolve) => {setTimeout(resolve, 2000)});
    }
}