const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/auth");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "matty/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [{ width: 2000, height: 2000, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB max
});

// @route   POST /api/uploads/image
// @desc    Upload an image to be placed on the canvas, or a design thumbnail
router.post("/image", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  res.status(201).json({ url: req.file.path, publicId: req.file.filename });
});

module.exports = router;
