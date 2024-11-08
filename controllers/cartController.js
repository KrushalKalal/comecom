import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import productVariantModel from "../models/productVariantModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, sizeId, quantity } = req.body;
    const userId = req.user._id;
    const product = await productModel.findById(productId);
    const variant = await productVariantModel.findById(variantId);
    const size = variant.sizes.find((s) => s._id.toString() === sizeId);

    if (!variant || !variant.sizes.some((size) => size.size.equals(sizeId))) {
      return res.status(400).send({
        success: false,
        message: "Selected size not available.",
      });
    }

    if (!product || !variant) {
      return res.status(404).send({ message: "Product or Variant not found" });
    }
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = product.price * cartItem.quantity;
    } else {
      const newItem = {
        product: productId,
        variant: variantId,
        size: sizeId,
        quantity: quantity,
        price: product.price * quantity,
      };
      cart.items.push(newItem);
    }
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

    await cart.save();
    return res.status(200).send({
      success: true,
      message: "successfully item added into cart",
      cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while adding item into cart",
      err,
    });
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({ message: "cart is empty" });
    }
    return res.status(200).send({
      success: true,
      message: "successfully fetched cart details",
      cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting cart items",
      err,
    });
  }
};
export const updateItemOfCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const { quantity } = req.body;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart) {
      return res.status(404).send({ message: "cart is empty" });
    }

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).send({ message: "item not found in cart" });
    }
    cartItem.quantity = quantity;
    cartItem.price = cartItem.product.price * cartItem.quantity;

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    return res.status(200).send({
      success: true,
      message: "successfully updated cart details",
      cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating item into cart",
      err,
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    cart.items.splice(itemIndex, 1);
    // cart.items = cart.items.filter(
    //   (item) => item.product.toString() !== productId
    // );

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    return res.status(200).send({
      success: true,
      message: "successfully item removed from cart",
      cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while removing item from cart",
      err,
    });
  }
};
export const removeEntireCart = async (req, res) => {};
