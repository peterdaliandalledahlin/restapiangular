const bodyParser = require('body-parser');
const express = require('express');
const app = express();

/* ------------ API CORS ------------- */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }

    next();    
})

/* ------------ BODY PARSER ------------- */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


/* ------------ API ROUTES ------------- */

// example. http://localhost:9999/api/users
const userRoute = require('./routes/users.js');
app.use("/api/users", userRoute);



module.exports = app;