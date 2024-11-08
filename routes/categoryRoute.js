import express from "express";
import {
  createCategory,
  createSubCategory,
  createSupSubCategory,
  deleteCategory,
  deleteSubCategory,
  deleteSupSubCategory,
  getAllSubCategory,
  getAllSupSubCategory,
  getCategories,
  getCategory,
  getSubCategoryOnCategory,
  getSupSubCategoryOnSubCategory,
  singleCategory,
  updateCategory,
  updateSubCategory,
  updateSupSubCategory,
} from "../controllers/categoryController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import upload from "../helpers/multer.js";

//router object
const router = express.Router();

//routing
//category routes

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createCategory
);
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  updateCategory
);
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);
router.get("/get-categories", getCategories);
router.get("/single-category/:slug", singleCategory);
router.get("/get-category/:id", getCategory);

//sub-category routes
router.post(
  "/create-sub-category",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createSubCategory
);
router.put(
  "/update-sub-category/:id",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  updateSubCategory
);
router.delete(
  "/delete-sub-category/:id",
  requireSignIn,
  isAdmin,
  deleteSubCategory
);
router.get("/get-sub-categories", getAllSubCategory);
router.get("/sub-category-on-category/:id", getSubCategoryOnCategory);

//sup-sub-category routes

router.post(
  "/create-sup-sub-category",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createSupSubCategory
);
router.put(
  "/update-sup-sub-category/:id",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  updateSupSubCategory
);
router.delete(
  "/delete-sup-sub-category/:id",
  requireSignIn,
  isAdmin,
  deleteSupSubCategory
);
router.get("/get-sup-sub-categories", getAllSupSubCategory);
router.get(
  "/sup-sub-category-on-sub-category/:id",
  getSupSubCategoryOnSubCategory
);

export default router;
