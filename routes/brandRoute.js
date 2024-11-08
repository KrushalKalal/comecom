import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getBrandOnCategory,
  getBrandOnSubCategory,
  getBrandOnSupSubCategory,
} from "../controllers/brandController.js";
import upload from "../helpers/multer.js";

const router = express.Router();

router.post(
  "/create-brand",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createBrand
);

router.put(
  "/update-brand/:id",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  updateBrand
);

router.delete("/delete-brand/:id", requireSignIn, isAdmin, deleteBrand);
router.get("/get-all-brand", getAllBrand);
router.get("/get-brand-on-category/:id", getBrandOnCategory);
router.get("/get-brand-on-sub-category/:id", getBrandOnSubCategory);
router.get("/get-brand-on-sup-sub-category/:id", getBrandOnSupSubCategory);
export default router;
