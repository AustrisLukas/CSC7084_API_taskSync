const express = require('express');
const fs = require('fs');
const path = require('path');
const router = require("./routes/routes.js");
const dotenv = require('dotenv').config({ path: './config.env' });
const dbpool = require(path.join(__dirname, '/utils/dbconn.js'));
//const session = require("express-session");
const app = express();
const {logMessage} = require(path.join(__dirname, "/utils/apiUtils.js"))
//const cookieParser = require("cookie-parser");
//const session = require("express-session");
//const authRouter = require("./routes/auth");
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
//app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));





/*
app.use('/', (req, res, next) =>{
    console.log(`payload of this message: ${req.body.data}`);
    console.log(`payload of this message: ${req.body.user_email}`);
    next();
});
*/


app.use('/', router);

// Executing server start process.
startServer();

/**
 * Asynchronously starts the server after verifying the database connection.
 *
 * This function performs the following steps:
 * 1. Retrieves the server's port from the environment variables (`process.env.PORT`),
 *    defaulting to 3000 if not set.
 * 2. Calls the `testDatabaseConnection` function to ensure the database is accessible.
 * 3. If the database connection is successful, starts the application server and logs a success message.
 * 4. If an error occurs during the database connection or server start process, logs the error
 *    and gracefully shuts down the application using `process.exit(1)`.
 *
 * @async
 * @function startServer
 * @returns {void}
 * 
 * Note:
 * - The function is designed to ensure the application only starts if the database connection is
 *   successfully established.
 * - Any unhandled errors in the process will prevent the server from starting and trigger an immediate shutdown.
 */
async function startServer(){
    try {
        const PORT = process.env.PORT || 3000;
        await testDatabaseConnection();
        app.listen(PORT, () => {
            logMessage(`Listening on PORT ${process.env.PORT}.`)
            
        });
    } catch (error){
        logMessage(`Failed to open - ${error.message}.`)
        process.exit(1);
    }
};


/**
 * Asynchronously tests the database connection with a maximum number of retries.
 *
 * This function attempts to establish a connection to the database using the `dbpool.query` method.
 * If the connection fails, it retries up to a maximum of `maxAttempt` attempts, with a delay of 2000ms
 * between retries. If all attempts fail, an error is thrown.
 *
 * @async
 * @function testDatabaseConnection
 * @returns {Promise<boolean>} - Resolves to `true` if the connection is successful.
 * @throws {Error} - If the maximum number of connection attempts is exceeded.
 *
 * Steps:
 * 1. Initialize the `attempt` counter to track the number of retries.
 * 2. Define `maxAttempt` as the maximum number of retries allowed.
 * 3. Enter a loop to attempt the connection while `attempt` is less than or equal to `maxAttempt`:
 *    - Try to execute a simple query (`SELECT 1`) to test the connection.
 *    - If successful, log the success message and return `true`.
 *    - If an error occurs, increment the `attempt` counter and log the error.
 * 4. If the maximum number of attempts is reached, throw an error indicating connection attempts exceeded.
 * 5. Use a 2000ms delay between retries using a `Promise` with `setTimeout`.
 */
async function testDatabaseConnection(){
    let attempt = 0;
    const maxAttempt = 3;

    while (attempt <= maxAttempt) {
        try {
            await dbpool.query('SELECT 1');
            logMessage(`Database connection established on PORT ${process.env.DB_PORT}.`);
            return true;
        } catch (error) {
            attempt++;
            logMessage(`Database rrror establishing connection after attempt ${attempt}.`)
            
            console.error(error);
            
        }
        if (attempt == maxAttempt) throw new Error('API DATABASE: Conection attempts exceeded.');

        // 2000ms delay before attempting read again.
        await new Promise((resolve) => {setTimeout(resolve, 2000)});
    }
}