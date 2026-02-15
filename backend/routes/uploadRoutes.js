const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/', upload.single('image'), (req, res) => {
    // Generate URL for the uploaded file
    // Assuming 'uploads' folder is served statically
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
        message: 'Image uploaded',
        image: imageUrl,
        filePath: `/uploads/${req.file.filename}`
    });
});

module.exports = router;
