const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../lib/cloudinary");

const ProductModel = require("../../models/Product");

const productsRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "amazon-marketplace",
  },
});

const cloudinaryMulter = multer({ storage: storage });

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await ProductModel.countDocuments(query.criteria);

    const products = await ProductModel.find(
      query.criteria,
      query.options.fields
    )
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit);
    res.send({ links: query.links("/products", total), products });
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    res.send(product);
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

productsRouter.post(
  "/",

  async (req, res, next) => {
    try {
      const newProduct = new ProductModel(req.body);
      const { _id } = await newProduct.save();

      res.status(201).send(_id);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const modifiedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { runValidators: true, new: true }
    );

    if (modifiedProduct) {
      res.send(modifiedProduct);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.productId);

    if (product) {
      res.send(`Deleted`);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.post(
  "/:id/upload",
  cloudinaryMulter.single("product_image"),
  async (req, res, next) => {
    try {
      const updated = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            imageUrl: req.file.path,
          },
        },
        { runValidators: true, new: true }
      );
      res.status(201).send(updated);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const { review } = await ProductModel.findById(req.params.id, {
      review: 1,
      _id: 0,
    });
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { review } = await ProductModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        review: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );

    if (review) {
      res.send(review);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = productsRouter;
