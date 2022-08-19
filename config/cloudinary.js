// import cloudinary
const cloudinary = require('cloudinary').v2;

// initialize instance with settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY
});

// export for use in app
module.exports = { cloudinary };