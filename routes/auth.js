// In order to reference the express object/framework you need to require it and store it in a variable.
const express = require('express');

//In order to use the router object we must get it from express.
const router = express.Router();

//In order to use the controller object we must require it and store it in a variable.
const controller = require('../controller/auth.js');

// Here we are creating a POST endpoint to create a new user.
router.post('/register', controller.register);

// Here we are creating a route for a user to login
router.post('/login', controller.login);

// Here we are exporting our router object.
module.exports = router;