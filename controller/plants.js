// Create a variabe that stores our database connection
const db = require('../sql/connection');


//Controller function to create a plant
const createPlant = (req, res)=> {
  // Requiring certain fields to be provided
  // Send a 400 response (user/client error) and an error message if not provided.
  if(req.body.common_name == null) {
    res.status(400).json('Common name is required');
  }
  else if(req.body.zone == null) {
    res.status(400).json('Zone is required');
  }
  else if(req.body.sun_exposure == null) {
    res.status(400).json('Sun exposure is required');
  };

  // The SQL query that will insert a new record (plant) in the database.
  const sql = `
    INSERT INTO plant
      (common_name, botanical_name, zone, sun_exposure, height, width)
    VALUES 
      (?,?,?,?,?,?)
    `;

  // Because our query is parameterized, we need to provide the values to inject into the query.
  // By parameterizing the query, we ensure that users cannot manipulate our SQL query. This is a secure practice.
  const params = [
    req.body.common_name, 
    req.body.botanical_name, 
    req.body.zone, 
    req.body.sun_exposure, 
    req.body.height, 
    req.body.width
  ];

  // Send the query to our database, using the connection we created (db object).
  db.query(sql, params, function(err, results) {
    // Handle scenario where an error occurs.
    if(err) {
      console.log("An error occurred while attempting to insert into the database.", err)
      // sendStatus represents an HTTP response status.
      // 500 is a server error
      res.sendStatus(500);
    }
    // Handle scenario where we successfully write to the database.
    else {
      // Anything in the 200's is a success. 201 is a creation success. Will by default send "Created" message in the response body.
      res.sendStatus(201);
    }
  });
}


//Controller function to list all plants.
const listPlants = (req, res)=> {
  // The SQL query that will fetch all records from our plant table.
  const sql = `SELECT * FROM plant`;

  // Send the query to our database, using the connection we created (db object).
  db.query(sql, function(err, results) {
    // Handle scenario where an error occurs.
    if(err) {
      console.log("An error occurred while trying to fetch from the database.", err)
      // sendStatus represents an HTTP response status.
      // 500 is a server error
      res.sendStatus(500);
    }
    // Handle scenario where we successfully fetch from the database.
    else {
      // Anything in the 200's is a success. 200 is a generic success message.
      // Here we used status as opposed to sendstatus because we do not want to immediately send back a response.
      res.status(200).json(results);
    }
  })
};


//Controller function to list one plant.
const getPlant = (req, res)=> {
  // The SQL query that will fetch a single record from our plant table.
  const sql = `SELECT * FROM plant WHERE id = ?`;

   // Because our query is parameterized, we need to provide the values to inject into the query.
  // By parameterizing the query, we ensure that users cannot manipulate our SQL query. This is a secure practice.
  const params = [
    req.params.id
  ];

  // Send the query to our database, using the connection we created (db object).
  db.query(sql, params, function(err, results) {
    // Handle scenario where an error occurs.
    if(err) {
      console.log("An error occurred while trying to fetch from the database.", err)
      // sendStatus represents an HTTP response status.
      // 500 is a server error
      res.sendStatus(500);
    }
    // Handle scenario where we successfully fetch from the database.
    else {
      // If the database query succeeded but we didn't get any results back, send a 404 response(not found).
      if (results.length === 0) {
        res.sendStatus(404);
      }
      else {
        // Anything in the 200's is a success. 200 is a generic success message.
        // Here we used status as opposed to sendstatus because we do not want to immediately send back a response.
        res.status(200).json(results);
      }
    }
  })
};


const deletePlant = (req, res)=> {
  // The SQL query that will delete a single plant from our table.
  const sql = `DELETE FROM plant WHERE id = ?`;

   // Because our query is parameterized, we need to provide the values to inject into the query.
  // By parameterizing the query, we ensure that users cannot manipulate our SQL query. This is a secure practice.
  const params = [
    req.params.id
  ];

  // Send the query to our database, using the connection we created (db object).
  db.query(sql, params, function(err, results) {
    // Handle scenario where an error occurs.
    if(err) {
      console.log("An error occurred while trying to delete from the database.", err)
      // sendStatus represents an HTTP response status.
      // 500 is a server error
      res.sendStatus(500);
    }
    // Handle scenario where we successfully delete from the database.
    else {
      console.log(results);
      // If the database query succeeded but we didn't get any results back, send a 404 response(not found).
      if (results.affectedRows === 0) {
        res.sendStatus(404);
      }
      else {
        // Anything in the 200's is a success. 204 represents a success with no content.
        // Here we used sendStatus as opposed to status because we do want to immediately send back a response.
        res.sendStatus(204);
      }
    }
  })
};


const updatePlant = (req, res)=> {

  // Requiring certain fields to be provided
  // Send a 400 response (user/client error) and an error message if not provided.
  if(req.body.common_name == null) {
    res.status(400).json('Common name is required');
  }
  else if(req.body.zone == null) {
    res.status(400).json('Zone is required');
  }
  else if(req.body.sun_exposure == null) {
    res.status(400).json('Sun exposure is required');
  }

  // The SQL query that will update an existing plant in the database.
  const sql = `
    UPDATE plant
    SET 
      common_name = ?, 
      botanical_name = ?, 
      zone = ?, 
      sun_exposure = ?, 
      height = ?, 
      width = ?
    WHERE id = ?
    `;

  // Because our query is parameterized, we need to provide the values to inject into the query.
  // By parameterizing the query, we ensure that users cannot manipulate our SQL query. This is a secure practice.
  const params = [
    req.body.common_name, 
    req.body.botanical_name, 
    req.body.zone, 
    req.body.sun_exposure, 
    req.body.height, 
    req.body.width,
    req.params.id
  ];

  // Send the query to our database, using the connection we created (db object).
  db.query(sql, params, function(err, results) {
    // Handle scenario where an error occurs.
    if(err) {
      console.log("An error occurred while attempting to update a record in the database.", err)
      // sendStatus represents an HTTP response status.
      // 500 is a server error
      res.sendStatus(500);
    }
    // Handle scenario where we successfully write to the database.
    else {
      if (results.affectedRows === 0) {
        res.sendStatus(404);
      }
      else {
         // Anything in the 200's is a success. 204 is a no content success.
        res.sendStatus(204);
      }
    }
  })
};

//Creating an object with the plant operations as keys.
module.exports = {createPlant, listPlants, getPlant, deletePlant, updatePlant}