const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const { check, validationResult } = require("express-validator");

const CartModel = require("../../models/Cart");
const ProductModel = require("../../models/Product");

const cartsRouter = express.Router();

const cartsValidation = [
  check("email")
    .exists()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Provide a valid Email"),
  check("name").exists().withMessage("First name is required!"),
  check("surname").exists().withMessage("Surname is required!"),
];

const productsValidation = [
  check("name").exists().withMessage("Product Name is required!"),
  check("brand").exists().withMessage("Brand is required!"),
  check("price").exists().withMessage("Price is required!"),
];

// List all carts
cartsRouter.get("/", async (req, res, next) => {
  try {
    const carts = await CartModel.find();

    if (carts) {
      res.send(carts);
    } else {
      next();
    }
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

// List specific Cart
cartsRouter.get("/:cartId", async (req, res, next) => {
  try {
    const cart = await CartModel.find({
      _id: req.params.cartId,
    });

    if (cart) {
      res.send(cart);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Create Cart
cartsRouter.post("/", cartsValidation, async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const error = new Error();
      error.httpStatusCode = 400;
      error.message = validationErrors;
      next(error);
    } else {
      const cartExist = await CartModel.find({ email: req.body.email });

      console.log(cartExist);
      if (cartExist && cartExist.length !== 0) {
        res.send("Email already used to register an existing cart");
      } else {
        const newCart = new CartModel(req.body);
        const { _id } = await newCart.save();
        res.status(201).send(_id);
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Add to Cart
cartsRouter.post("/:cartId/add-to-cart/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    console.log(product);
    if (product) {
      if (product.quantity !== 0) {
        const modifiedCart = await CartModel.findByIdAndUpdate(
          req.params.cartId,
          {
            $push: {
              products: {
                productId: product._id,
                name: product.name,
                brand: product.brand,
                description: product.description,
                price: product.price,
              },
            },
          },
          { runValidators: true, new: true }
        );

        if (modifiedCart) {
          res.status(201).send(modifiedCart);
        } else {
          next();
        }
      } else {
        res.send("Product is out of stock");
      }
    } else {
      res.send("Product does not exist");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Remove product from cart
cartsRouter.delete("/:cartId/remove-from-cart/:pId", async (req, res, next) => {
  try {
    const product = await CartModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.cartId),
      },
      {
        _id: 0,
        products: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.pId) },
        },
      }
    );

    const modifiedCart = await CartModel.findByIdAndUpdate(
      req.params.cartId,
      {
        $pull: {
          products: product.products[0],
        },
      },
      { runValidators: true, new: true }
    );

    if (modifiedCart) {
      res.status(201).send(modifiedCart);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = cartsRouter;
