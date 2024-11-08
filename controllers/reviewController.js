import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user._id;

    const existingReview = await reviewModel.findOne({
      user: userId,
      product: productId,
    });
    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You can only review a product once." });
    }
    const review = await new reviewModel({
      user: userId,
      product: productId,
      rating,
      content,
    }).save();

    product.numReviews += 1;
    const newAverageRating =
      (product.rating * (product.numReviews - 1) + rating) / product.numReviews;
    product.rating = newAverageRating;

    await product.save();

    return res.status(200).send({
      success: true,
      message: "your review added successfully",
      review,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while writing a review",
      err,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, content } = req.body;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own reviews" });
    }

    const oldRating = review.rating;
    review.rating = rating;
    review.content = content;
    await review.save();

    const product = await productModel.findById(review.product);
    product.rating =
      (product.rating * product.numReviews - oldRating + rating) /
      product.numReviews;
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while updating a review",
      err,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }
    await reviewModel.findByIdAndDelete(reviewId);

    const product = await productModel.findById(review.product);
    product.numReviews -= 1;

    if (product.numReviews === 0) {
      product.rating = 0;
    } else {
      product.rating =
        (product.rating * (product.numReviews + 1) - review.rating) /
        product.numReviews;
    }

    await product.save();
    return res.status(200).send({
      success: true,
      message: "Review deleted successfully",
      review,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while deleting a review",
      err,
    });
  }
};

export const getAllReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const review = await reviewModel
      .find({ product: productId })
      .populate("user", "name");
    return res.status(200).send({
      success: true,
      message: "fetched all reviews of product",
      review,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting a review",
      err,
    });
  }
};
