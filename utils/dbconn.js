/**
 * Initiates and exports database pool connection for use in the API.
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv').config({ path: './config.env' });


const dbpool = mysql.createPool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '..', 'DigiCertGlobalRootCA.crt.pem'))
    }
});




module.exports = dbpool.promise();
