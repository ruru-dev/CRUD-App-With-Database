// Create a variabe that stores our database connection
const db = require('../sql/connection');

// Controller function to list all images.
const listImages = (req, res)=> {
  // The SQL query that will fetch all records from our image table.
  const sql = `SELECT * FROM image`;

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

// Controller function to get one image.
const getImage = (req, res)=> {
  // The SQL query that will fetch one record from our image table.
  // The id is parameterized and will be susbstituted with the value provided in the path parameter.
  // This is required so that users cannot perform sql injection.
  const sql = `SELECT * FROM image WHERE id = ?`;

  const params = [req.params.id];

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

//Controller function to create an image.
const createImage = (req, res)=> {
  // Requiring certain fields to be provided
  // Send a 400 response (user/client error) and an error message if not provided.
  if(req.body.zone == null) {
    res.status(400).json('Zone is required');
  }
  // else if(req.body.image_url == null) {
  //   res.status(400).json('Failed to upload image.');
  // };

  // The SQL query that will insert a new record (image) in the database.
  const sql = `
    INSERT INTO image
      ( 
        user_id, 
        image_url, 
        submit_date, 
        image_date, 
        zone, state, 
        country, 
        sun_exposure, 
        soil_type, 
        fertilizer_schedule
        )
    VALUES 
      (?,?,?,?,?,?,?,?,?,?)
    `;

  // Because our query is parameterized, we need to provide the values to inject into the query.
  // By parameterizing the query, we ensure that users cannot manipulate our SQL query. This is a secure practice.
  const params = [
    req.body.user_id, 
    `localhost:3000/static/assets/uploads/${req.file.filename}`,
    new Date().toISOString(), 
    req.body.image_date, 
    req.body.zone, 
    req.body.state,
    req.body.country,
    req.body.sun_exposure,
    req.body.soil_type,
    req.body.fertilizer_schedule
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
};

//Controller function to delete an image.
const deleteImage = (req, res)=> {
  // The SQL query that will delete a single image from our table.
  const sql = `DELETE FROM image WHERE id = ?`;

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

// Controller function to update a plant.
const updateImage = (req, res)=> {

  // Requiring certain fields to be provided
  // Send a 400 response (user/client error) and an error message if not provided.
  if(req.body.zone == null) {
    res.status(400).json('Zone is required');
  }
  // else if(req.body.image_url == null) {
  //   res.status(400).json('Failed to upload image.');
  // };

  // The SQL query that will update an existing image in the database.
  const sql = `
    UPDATE image
    SET 
      image_url = ?, 
      image_date = ?, 
      zone = ?, 
      state = ?, 
      country = ?,
      sun_exposure = ?,
      soil_type = ?,
      fertilizer_schedule = ?
    WHERE id = ?
    `;

  // Because our query is parameterized, we need to provide the values to inject into the query.
  // By parameterizing the query, we ensure that users cannot manipulate our SQL query. This is a secure practice.
  const params = [
    `localhost:3000/static/assets/uploads/${req.file.filename}`,
    req.body.image_date, 
    req.body.zone, 
    req.body.state, 
    req.body.country, 
    req.body.sun_exposure,
    req.body.soil_type,
    req.body.fertilizer_schedule,
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
  });
};

//Creating an object with the image operations as keys.
module.exports = {listImages, getImage, createImage, deleteImage, updateImage};