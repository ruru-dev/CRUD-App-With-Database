// In order to use the express npm package you need to require it
const express = require('express');

// Requiring the body-parser NPM package.
// This is put in main.js to act as middleware.
const bodyParser = require("body-parser");

//With express, you can invoke the top level function instead of calling express.function() every time.
// By default, the express function creates an app.
// This instantiates the application
const app = express();

//This is a .json method on the bodyParser object. This will parse the incoming request body as json for us.
app.use(bodyParser.json());

// This middleware makes the public directory directly accessible to the internet.
app.use(express.static('public'));

// Require the file that will contain our auth related routes (register and login.)
app.use(require("./routes/auth.js"));

// Inject our routes using middleware before any requests are processed/handled.
// We need to require the files containing these routes and pass it directly into the app.use middleware.
// The middleware will give our app instructions when handling every request.
app.use(require("./routes/plants.js"));

// Inject our routes using middleware before any requests are processed/handled.
// We need to require the files containing these routes and pass it directly into the app.use middleware.
// The middleware will give our app instructions when handling every request.
app.use(require("./routes/images.js"));

// Our app needs to listen for incoming requests. A callback function can be invoked anytime we start listening
// If you don't provide a port, the express app will default to port 3000
app.listen(3000, () => {
  console.log('Server is listening...');
});
