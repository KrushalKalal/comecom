import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createColor,
  deleteColor,
  getColor,
  updateColor,
} from "../controllers/colorController.js";
import upload from "../helpers/multer.js";

const router = express.Router();

router.post(
  "/create-color",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createColor
);
router.put(
  "/update-color/:id",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  updateColor
);
router.delete("/delete-color/:id", requireSignIn, isAdmin, deleteColor);
router.get("/get-all-colors", getColor);

export default router;
