import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  placeOrder,
  updateOrderStatus,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", requireSignIn, placeOrder);
router.put(
  "/update-order-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatus
);
router.get("/user-order", requireSignIn, getUserOrders);
router.get("/orders/:orderId", requireSignIn, getOrderDetails);
router.get("/get-all-orders", requireSignIn, isAdmin, getAllOrders);
router.put("/cancel-order/:orderId", requireSignIn, cancelOrder);
router.delete("/delete-order/:orderId", requireSignIn, isAdmin, deleteOrder);

export default router;
