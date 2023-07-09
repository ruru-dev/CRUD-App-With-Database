// In order to reference the express object/framework you need to require it and store it in a variable.
const express = require('express');

//In order to use the router object we must get it from express.
const router = express.Router();

//In order to use the controller file we must require it.
// The controller has the logic that will handle this request.
const controller = require('../controller/plants.js');

//In order to use the middleware object we must require it.
const authMiddleware = require('../middleware/auth.js');

// POST REQUEST
// Here we are creating a POST endpoint to create a new plant.
router.post('/plants', authMiddleware.checkJwt, controller.createPlant);


// GET REQUEST
//Here we are creating a GET endpoint to list all plants.
router.get('/plants', controller.listPlants);


// GET REQUEST
//Here we are creating a GET endpoint to fetch 1 plant.
router.get('/plants/:id', controller.getPlant);


// DELETE REQUEST
//Here we are creating a DELETE endpoint to delete a plant from the database.
router.delete('/plants/:id', controller.deletePlant);


// PUT REQUEST
// Here we are creating a PUT endpoint to update an existing plant.
router.put('/plants/:id', controller.updatePlant);


// Here we are exporting our router object.
module.exports = router;