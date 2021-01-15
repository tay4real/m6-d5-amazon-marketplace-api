const express = require("express");
const mongoose = require("mongoose");
const ReviewModel = require("../../models/Review");

const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find(req.query);

    if (reviews) {
      res.send(reviews);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("Sorry,  an error occured");
  }
});

reviewsRouter.get("/:id", async (req, res, next) => {
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
    next("Sorry,  an error occured");
  }
});

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body);

    const { _id } = await newReview.save();
    res.status(201).send(_id);
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
