const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path')
const { logMessage } = require(path.join(__dirname, "/..", "/utils/apiUtils.js"));


function authenticateToken(req,res,next){

    if (!req.headers.authorization){
        logMessage('API access denied: Token not found');
        return res.status(401).json({message: 'API access denied: Token not found'});
    } 

    let token = (req.headers.authorization).split(" ")
    jwt.verify(token[1], process.env.JWT_KEY, (err, user) =>{

        if (err){
            logMessage('API access denied: Token invalid');
            return res.status(401).json({message: 'API access denied: Token invalid'});
        } else {
            //logMessage('API access granted.');
            //show token
            //console.log(token[1]);
            next();
        }
    });

    
    

}

module.exports = {authenticateToken};
