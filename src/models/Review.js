const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ReviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, maximum: 5, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", ReviewSchema); // bounded to Users collections
