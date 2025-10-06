const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configure Multer for temporary storage
const upload = multer({ dest: 'uploads/' });

// @route   POST api/upload
// @desc    Upload a media file to Cloudinary
// @access  Private
router.post('/', [auth, upload.array('media', 5)], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No files uploaded' });
    }

    // Upload all files in parallel to Cloudinary
    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'onehood_uploads',
      });
    });

    const results = await Promise.all(uploadPromises);
    const secure_urls = results.map(result => result.secure_url);

    // Send back the secure URL
    res.json({ secure_urls }); 

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;