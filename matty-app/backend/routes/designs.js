const express = require("express");
const Design = require("../models/Design");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All design routes require a logged-in user
router.use(protect);

// @route   GET /api/designs
// @desc    Fetch all designs belonging to the logged-in user
router.get("/", async (req, res, next) => {
  try {
    const designs = await Design.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ designs });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/designs/:id
// @desc    Fetch a single design (only if it belongs to the user)
router.get("/:id", async (req, res, next) => {
  try {
    const design = await Design.findOne({ _id: req.params.id, userId: req.user._id });
    if (!design) return res.status(404).json({ message: "Design not found" });
    res.json({ design });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/designs
// @desc    Save a new design
router.post("/", async (req, res, next) => {
  try {
    const { title, jsonData, thumbnailUrl, width, height } = req.body;

    if (!jsonData) {
      return res.status(400).json({ message: "jsonData (canvas state) is required" });
    }

    const design = await Design.create({
      userId: req.user._id,
      title: title || "Untitled design",
      jsonData,
      thumbnailUrl,
      width,
      height,
    });

    res.status(201).json({ design });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/designs/:id
// @desc    Update an existing design (autosave / manual save)
router.put("/:id", async (req, res, next) => {
  try {
    const { title, jsonData, thumbnailUrl, width, height } = req.body;

    const design = await Design.findOne({ _id: req.params.id, userId: req.user._id });
    if (!design) return res.status(404).json({ message: "Design not found" });

    if (title !== undefined) design.title = title;
    if (jsonData !== undefined) design.jsonData = jsonData;
    if (thumbnailUrl !== undefined) design.thumbnailUrl = thumbnailUrl;
    if (width !== undefined) design.width = width;
    if (height !== undefined) design.height = height;

    await design.save();
    res.json({ design });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/designs/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const design = await Design.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!design) return res.status(404).json({ message: "Design not found" });
    res.json({ message: "Design deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
