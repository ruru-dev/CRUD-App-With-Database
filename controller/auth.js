// // In order to reference the jsonwebtoken library you need to require it and store it in a variable.
const jsonWebToken = require('jsonwebtoken');

// In order to reference the argon library you need to require it and store it in a variable.
const argon = require('argon2');

// // In order to reference the database connection you need to require it and store it in a variable.
const db = require('../sql/connection.js');

const register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Ensure that username field is provided
  if(!username) {
    res.status(400).send('Username field is required.');
    return;
  }

  // Ensure that pasword field is provided
  if(!password) {
    res.status(400).send('Password field is required.');
    return;
  }

  // Because of block scoping, the hashedPassword variable has to be declared outside of the try block.
  let hashedPassword;
  try {
    // Hash the password
    hashedPassword = await argon.hash(password);
  }
  catch(error) {
    console.log('Error occurred while hashing password', error);
    res.sendStatus(500);
    return;
  }

  // Insert parameterized variables into the SQL statement/query
  const sqlStatement = 'INSERT INTO user (username, password) VALUES (?,?)';
  const params = [username, hashedPassword];  

  // Send query to the database
  db.query(sqlStatement, params, (error, result)=> {
    if (error) {
      console.log('An error occured while trying to insert into the database.', error);
      res.sendStatus(500);
      return;
    }
    else {
      // Creation success
      res.sendStatus(201);
      return;
    }
  })
};

const login = async (req, res) => {
  const loginUsername = req.body.username;
  const loginPassword = req.body.password;

  // Ensure that username field is provided
  if(!loginUsername) {
    res.status(400).send('Username field is required.');
    return;
  }

  // Ensure that pasword field is provided
  if(!loginPassword) {
    res.status(400).send('Password field is required.');
    return;
  }

  // Insert parameterized variables into the SQL statement/query
  const sqlStatement = 'SELECT username, id, password FROM user WHERE username = ?';
  const params = [loginUsername];

  // Send query to the database
  db.query(sqlStatement, params, async (error, results)=> {
    if (error) {
      console.log('An error occured while trying to select from the database.', error);
      res.sendStatus(500);
      return;
    }

    // This logic will handle if we find the username.
    if (results.length === 1) {
      const storedPassword = results[0].password;
      const storedId = results[0].id;
      const storedUsername = results[0].username;

    // Using object deconstruction to extract the keys from an object into variables.
    // const {username, id} = results[0];

      // This logic will handle if the provided password matches the stored hash for that username.
      let isCorrectPassword;
      try {
        isCorrectPassword = await argon.verify(storedPassword, loginPassword);
      }
      catch {
        console.log('An error occurred while verifying the password.')
      }

      if (isCorrectPassword) {
        // Creating our payload for the JWT.
        let jwtPayload = {
           id: storedId,
           username: storedUsername
        };

        // This is where we generate our token. JWT (JSON web token.)
        const token = jsonWebToken.sign(jwtPayload, process.env.JWT_KEY)
        res.status(200).send(token);
        return;
      };
    }

    // 401 Unauthorized is the status code to return when the client provides no credentials 
    // or invalid credentials.
    res.status(401).send("Please enter a valid username/password combination.");
  })
};


module.exports = {
  register,
  login
};