import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  getCartDetails,
  removeEntireCart,
  removeItemFromCart,
  updateItemOfCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add-to-cart", requireSignIn, addToCart);
router.put("/update-cart/:itemId", requireSignIn, updateItemOfCart);
router.delete("/delete-cart-item/:itemId", requireSignIn, removeItemFromCart);
router.delete("delete-cart", requireSignIn, removeEntireCart);
router.get("/get-cart-details", requireSignIn, getCartDetails);

export default router;
