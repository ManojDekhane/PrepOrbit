const express =  require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'questionImages',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
});

const upload = multer({ storage });

router.post('/image', upload.single('image'), (req, res) => {
    res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;