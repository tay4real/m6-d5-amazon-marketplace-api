const { Schema, model } = require("mongoose");

const productModel = new Schema(
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
      type: Double,
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

const productModel = model("products", productModel);

module.exports = productModel;
