// In order to reference the express object/framework you need to require it and store it in a variable.
const express = require('express');

//In order to use the router object we must get it from express.
const router = express.Router();

//In order to use the controller file we must require it.
// The controller has the logic that will handle this request.
const controller = require('../controller/images.js');

//In order to use the middleware object we must require it.
const authMiddleware = require('../middleware/auth.js');

//In order to use the middleware object we must require it.
const uploadMiddleware = require('../middleware/uploader.js');

// GET REQUEST
//Here we are creating a GET endpoint to list all images from the database.
router.get('/images', controller.listImages);

// GET REQUEST
//Here we are creating a GET endpoint to get a specific image by id from the database.
router.get('/images/:id', controller.getImage);

// POST REQUEST
//Here we are creating a POST endpoint to create a new image.
router.post('/images', uploadMiddleware.single('image'), authMiddleware.checkJwt, controller.createImage);

// DELETE REQUEST
// Here we are creating a DELETE endpoint to delete a image.
router.delete('/images/:id', authMiddleware.checkJwt, controller.deleteImage);

// PUT REQUEST
// Here we are creating a PUT endpoint to update an image.
router.put('/images/:id', uploadMiddleware.single('image'), authMiddleware.checkJwt, controller.updateImage);

// Here we are exporting our router object.
module.exports = router;