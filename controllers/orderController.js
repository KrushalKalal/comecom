import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import addressModel from "../models/addressModel.js";
import productVariantModel from "../models/productVariantModel.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod } = req.body;
    const cart = await cartModel.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "variants", // Populate the variants of the product
        select: "color sizes images sku stock", // Select necessary fields
      },
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ message: "your cart is empty" });
    }
    const address = await addressModel.findOne({ user: userId });
    console.log(address);
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.price,
      0
    );

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      variant: item.variant._id,
      size: item.size, // Use the selected variant ID
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await new orderModel({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: address._id,
      paymentMethod,
    }).save();

    if (cart) {
      await cartModel.findOneAndUpdate(
        { user: userId },
        { items: [], totalPrice: 0 },
        { new: true }
      );
    }

    return res.status(200).send({
      success: true,
      message: "Successfully order placed",
      order,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while placing an order",
      err,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(400).send({ message: "order not found" });
    }
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updateOrder = await order.save();
    return res.status(200).send({
      success: true,
      message: "update order status",
      updateOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).send({
      success: false,
      message: "error while updating order status",
      err,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const variant = await productVariantModel.findById(variantId);
    const orders = await orderModel
      .find({ user: userId })
      .populate("items.product", "name price");
    if (!orders) {
      return res.status(404).send({
        message: "No orders Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "get logged in user all orders",
      orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting orders",
      err,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = await orderModel
      .findById(orderId)
      .populate("items.product", "name price");
    if (!order) {
      res.status(400).send({
        message: "order not found",
      });
    }

    if (order.user.toString() !== userId.toString() && order.user.role !== 1) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    return res.status(200).send({
      success: true,
      message: "get order details successfully",
      order,
    });
  } catch (err) {
    console.log(err);
    return res.sttaus(500).send({
      success: false,
      message: "error while getting order details",
      err,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("user")
      .populate({
        path: "items.product",
      })
      .populate({
        path: "items.variant",
        select: "color sizes images sku stock",
        populate: [
          { path: "color", select: "colorName" },
          { path: "sizes.size", select: "sizeName" },
        ],
      })
      .populate({
        path: "items.size",
        select: "sizeName",
      });

    if (!orders || orders.length === 0) {
      return res.status(400).send({
        message: "No orders found",
      });
    }

    return res.status(200).send({
      success: true,
      message:
        "Successfully fetched orders with product and selected variant details",
      orders,
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send({
      success: false,
      message: "Error while fetching orders",
      err,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "Cannot cancel order after it's been shipped",
      });
    }

    order.orderStatus = "Cancelled";
    const cancelledOrder = await order.save();
    return res.status(200).send({
      success: true,
      message: "order canceled successfully",
      cancelledOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while canceling the order",
      err,
    });
  }
};
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findByIdAndDelete(orderId);
    return res.status(200).send({
      success: true,
      message: "delete order successfully",
      order,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting order",
      err,
    });
  }
};
