// // In order to reference the jsonwebtoken library you need to require it and store it in a variable.
const jsonWebToken = require('jsonwebtoken');

// This function will serve as our middleware which checks whether the JWT is valid.
// This will only be used for protected routes.
const checkJwt = (req, res, next) => {

  // Obtain the JWT from the Authorization header. Express provides this to us via a function to obtain all headers.
  const token = req.get('Authorization');


  // Check if token was provided
  if (token) {
    // Need to remove the word bearer from the token name.
    const tokenParts = token.split(" ");
    const actualToken = tokenParts[1];

    try {
      // Decode the JSON web token that was provided to us by the user.
      const decodedToken = jsonWebToken.verify(actualToken, process.env.JWT_KEY);
      // Append the user id from the decoded token to the request body on the user's behalf.
      // The id in the decoded token represents the id from the user table (for the currently logged in user.)
      req.body.user_id = decodedToken.id;
    }
    catch(error){
      // Error message 401 is unauthorized. Meaning the token they provided was not valid.
      res.status(401).send('JSON web token is invalid.');
      return;
    };

    // The "next" variable will invoke the next middleware function in the chain.
    next();
  }
  else {
    res.status(401).send("Missing JSON web token.")
  }
}

// Exporting the middleware function that checks your JWT(jSON web token).
module.exports = {
  checkJwt
};