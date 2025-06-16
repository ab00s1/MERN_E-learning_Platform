const multer = require("multer");
const { v4: uuid } = require("uuid");

// This middleware handles file uploads using multer.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const id = uuid();
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${id}.${fileExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage }).single("file");    // 'file' is the field name in the form

module.exports = { upload };