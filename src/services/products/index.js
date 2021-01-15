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
      .limit(query.options.limit)
      .populate("reviews");
    res.send({ links: query.links("/products", total), products });
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "reviews"
    );
    res.send(product);
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

productsRouter.post(
  "/",
  cloudinaryMulter.single("product_image"),
  async (req, res, next) => {
    try {
      const newProductObject = req.body;

      newProductObject.imageUrl = req.file.path;

      const newProduct = new ProductModel(newProductObject);
      const { _id } = await newProduct.save();

      res.status(201).send(_id);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

productsRouter.put(
  "/:productId",
  cloudinaryMulter.single("product_image"),

  async (req, res, next) => {
    try {
      const newProductObject = req.body;
      newProductObject.imageUrl = req.file.path;

      const modifiedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        newProductObject,
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
  }
);

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (article) {
      res.send(`Deleted`);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

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

    if (review && review.length > 0) {
      res.send(review);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.post("/:id", async (req, res, next) => {
  try {
    const article = await ProductModel.findById(req.params.id, {
      _id: 0,
    });

    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          review: req.body.review,
        },
      },
      { runValidators: true, new: true }
    );
    res.status(201).send(updated);
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
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

    if (review && review.length > 0) {
      const reviewToEdit = { ...review[0].toObject(), ...req.body };

      const modifiedArticle = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "review._id": mongoose.Types.ObjectId(req.params.reviewId),
        },
        { $set: { "review.$": reviewToEdit } },
        {
          runValidators: true,
          new: true,
        }
      );
      res.send(modifiedArticle);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedArticle = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          review: {
            _id: mongoose.Types.ObjectId(req.params.reviewId),
          },
        },
      },
      {
        new: true,
      }
    );
    res.send(modifiedArticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = productsRouter;
