const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const CartSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "products" },
        name: { type: String, required: true },
        brand: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
