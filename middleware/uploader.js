/*
 * This middleware will provide support for requests with multipart/form-data. This allows us to send 
 * data to the server in multiple "parts", however it is primarily used for uploading files. 
 * 
 * Because it is middleware, it will intercept requests before they are handled by a controller.
 * The middleware can detect if the request is of type multipart/form-data and will automatically separate
 * out the "body" object and "file(s)" object for us. These will be available in the request by the time it
 * is handled by the controller.
 */ 

// require the multer npm package which provides the multipart functionality
const multer = require('multer');

/* 
 * Define an image filter function which will be invoked by multer to determine if a file is a valid type.
 * For our purposes, we only want to allow files that are images. 
 * We can detect this using a file's mimetype (e.g. image/png, image/jpeg)
 */
const imageFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === "image") {
    // First argument in callback function is an error message that we set to null since image type is valid.
    // Second argument in callback function is the result of the filter check (true means this file is allowed.)
    cb(null, true);
  } else {
    // First argument in callback function is the error message stating that only images are allowed.
    // Second argument in callback function is the result of the filter check (false means this file is not allowed.)
    cb("Please upload only images.", false);
  }
}

/*
 * Define an image storage function which will be invoked by multer to determine where to store the file.
 * Here we are using one of multer's built-in storage engines and storing the file to disk (the server).
 * However, we are configuring it so that the file is stored with a particular path and file name.
 */
const storageConfig = {
  destination: (req, file, cb) => {
    // set the file path for the uploaded photo
    cb(null, './public/static/assets/uploads');
  },
  filename: (req, file, cb) => {
    // randomize the filename for security purposes
    // 1E9 taken from the multer docs. The E means one times ten to the ninth power.
    // By concatenating the current time with a large random value, we greatly decrease 
    // the chances of two files with the same exact name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // preserve the file extension from the original uploaded file
    const fileExtension = file.originalname.split('.')[1];

    // Creating the final file name that will be stored on the server.
    // Callback function will instruct multer to use this as the file name.
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  }
}

const imageStorage = multer.diskStorage(storageConfig);

// Finally, create the multer upload object using the storage and filter functions as configuration
const uploader = multer({
  storage: imageStorage,
  fileFilter: imageFilter
});

// When you invoke multer, it will give you the object with all the upload functionality.
module.exports = uploader;