const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "products" },
    comment: { type: String, required: true },
    rate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema); // bounded to Users collections
