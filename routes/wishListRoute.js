import express from "express";
import {
  addToWishList,
  getWishlist,
  removeFromWishList,
} from "../controllers/wishListController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-to-wishlist", requireSignIn, addToWishList);
router.delete(
  "/remove-from-wishlist/:productId/:variantId",
  requireSignIn,
  removeFromWishList
);
router.get("/get-all-wishlist", requireSignIn, getWishlist);

export default router;
