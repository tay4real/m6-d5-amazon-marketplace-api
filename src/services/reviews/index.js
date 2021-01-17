const express = require("express");
const mongoose = require("mongoose");

const ProductModel = require("../../models/Product");
const ReviewModel = require("../../models/Review");

const reviewsRouter = express.Router();

reviewsRouter.get("/p/:productId", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({
      productId: req.params.productId,
    });

    if (reviews) {
      res.send(reviews);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("Oops,  an error occured");
  }
});

reviewsRouter.get("/r/:id", async (req, res, next) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (review) {
      res.send(review);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next("Oops,  an error occured");
  }
});

reviewsRouter.post("/:productId", async (req, res, next) => {
  try {
    const reviewReq = req.body;
    reviewReq.productId = req.params.productId;
    console.log(reviewReq);
    const newReview = new ReviewModel(reviewReq);
    console.log(newReview);
    const { _id } = await newReview.save();

    const modifiedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      {
        $push: {
          reviews: _id,
        },
      },
      { runValidators: true, new: true }
    );

    if (modifiedProduct) {
      res.status(201).send(newReview);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedReview = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );

    if (modifiedReview) {
      res.send(modifiedReview);
    } else {
      const error = new Error(`review with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const review = await ReviewModel.findByIdAndDelete(req.params.id);

    if (review) {
      res.send("Deleted");
    } else {
      const error = new Error(`review with id ${req.params.id} not found`);
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsRouter;
