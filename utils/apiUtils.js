const { format } = require('date-fns');
 

function logMessage(message){

    const timestamp = format(new Date(), "HH:mm:ss");
    console.log(`${timestamp} API: ${message}`)
}

module.exports = {logMessage}