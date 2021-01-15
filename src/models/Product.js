const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: String,

    reviews: [{ type: Schema.Types.ObjectId, ref: "reviews" }],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
