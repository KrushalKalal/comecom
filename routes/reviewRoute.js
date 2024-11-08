import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  addReview,
  deleteReview,
  getAllReview,
  updateReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/add-review/:productId", requireSignIn, addReview);
router.put("/update-review/:reviewId", requireSignIn, updateReview);
router.delete("/delete-review/:reviewId", requireSignIn, deleteReview);
router.get("/review/:productId", getAllReview);

export default router;
