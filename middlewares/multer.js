const multer = require('multer');

/**muler create the memory storage for uploading the images */

const storage = multer.memoryStorage();
const singleUpload = multer({storage}).single("file");

module.exports = singleUpload;