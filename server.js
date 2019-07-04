const db = require('mongoose');
const http = require('http');
const app = require('./app.js');
const webserver_port = process.env.WEB_SERVER_PORT || 9999;
const mongodbserver = process.env.MONGODB_SERVER_NAME || "mongodb://localhost";
const mongodbserver_port = process.env.MONGODB_SERVER_PORT || 27017;
const mongodbserver_db = process.env.MONGODB_SERVER_DB || "default";

const webserver_address =  "http://localhost:" + webserver_port;
const mongodb_address = mongodbserver + ":" + mongodbserver_port + "/" + mongodbserver_db;

// API WEB SERVER
http
.createServer(app)
.listen(webserver_port, () => console.log("WEB SERVER: " + webserver_address));

// MONGO DB SERVER
db
.set("useCreateIndex", true)
.connect(mongodb_address, { useNewUrlParser: true })
.then(() => console.log("MONGODB SERVER: " + mongodb_address))
