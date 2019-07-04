const route = require('express').Router();

const authorization = require('../auth/auth.js');
const users = require('../controllers/userController.js');

// unrestricted routes
route.post("/register", users.register);
route.post("/login", users.login);

// restricted routes
route.get("/all", authorization, users.getUsers);       // Get all users
route.get("/:id", authorization, users.getUser);        // Get specific user
route.put("/:id", users.updateUser);     // Update specific user
route.delete("/:id", authorization, users.deleteUser);  // Remove specific user


module.exports = route;