const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const PORT = 3000;
const db = require('./config/databaseConnection');

app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes'));

app.listen(PORT, (err) => {
    if(err){return console.log('Error in connecting with the express server', err);}
    return console.log('Express server is up and running on port:', PORT);
});