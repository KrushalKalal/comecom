import express from "express";
import {
  createSize,
  updateSize,
  deleteSize,
  getSize,
  sizesOnCategory,
} from "../controllers/sizeController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-size", requireSignIn, isAdmin, createSize);
router.put("/update-size/:id", requireSignIn, isAdmin, updateSize);
router.delete("/delete-size/:id", requireSignIn, isAdmin, deleteSize);
router.get("/get-all-sizes", getSize);
router.get("/size-on-category/:id", requireSignIn, isAdmin, sizesOnCategory);

export default router;
