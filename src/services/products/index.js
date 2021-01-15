const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../lib/cloudinary");

const productsRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce",
  },
});

const cloudinaryMulter = multer({ storage: storage });

productsRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.post(
  "/",
  cloudinaryMulter.single("product_image"),

  async (req, res, next) => {
    try {
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsRouter.post(
  "/:productId/reviews",

  async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

productsRouter.put(
  "/:productId/reviews/:reviewId",

  async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = productsRouter;
