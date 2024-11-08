import wishListModel from "../models/wishListModel.js";
import productModel from "../models/productModel.js";
import productVariantModel from "../models/productVariantModel.js";

export const addToWishList = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    const variant = await productVariantModel.findById(variantId);

    if (!product || !variant) {
      return res.status(404).send({ message: "Product or Variant not found" });
    }

    let wishList = await wishListModel.findOne({ user: userId });

    if (!wishList) {
      wishList = new wishListModel({
        user: userId,
        products: [
          { product: productId, variant: variantId, addedAt: new Date() },
        ],
      });
    } else {
      const productInWishlist = wishList.products.find(
        (item) =>
          item.product.toString() === productId &&
          item.variant.toString() === variantId
      );
      if (productInWishlist) {
        return res
          .status(400)
          .json({ message: "This variant is already in the wishlist" });
      }
      wishList.products.push({
        product: productId,
        variant: variantId,
        addedAt: new Date(),
      });
    }

    await wishList.save();
    return res.status(200).send({
      success: true,
      message: "successfully product added into wishlist",
      wishList,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while adding product to wishlist",
      err,
    });
  }
};
export const removeFromWishList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId } = req.params;
    const wishList = await wishListModel.findOne({ user: userId });
    if (!wishList) {
      return res.status(400).send({
        message: "Wishlist not found",
      });
    }

    const productIndex = wishList.products.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );

    if (productIndex !== -1) {
      wishList.products.splice(productIndex, 1);
    } else {
      return res
        .status(404)
        .json({ message: "Product variant not found in wishlist" });
    }

    await wishList.save();
    return res.status(200).send({
      success: true,
      message: "product removed from the wishlist",
      wishList,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while removing product from wishlist",
      err,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishList = await wishListModel
      .findOne({ user: req.user._id })
      .populate({ path: "products.product" })
      .populate({ path: "products.variant" });
    if (!wishList) {
      return res.status(400).send({
        message: "Emplty Wishlist",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the items in wishlist",
      wishList,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting all wishlist",
      err,
    });
  }
};
