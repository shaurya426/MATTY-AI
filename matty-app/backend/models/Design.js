const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled design",
    },
    // Serialized canvas state (fabric.js JSON: shapes, text, images, positions)
    jsonData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", designSchema);
