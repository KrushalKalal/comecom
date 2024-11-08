import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  createProductVariant,
  deleteProduct,
  deleteProductImage,
  deleteProductVariant,
  deleteProductVariantImage,
  getAllProducts,
  getFilteredProducts,
  getProductDetailsById,
  getProductDetailsBySlug,
  productBasedOnBrand,
  productBasedOnCatgory,
  productBasedOnSubCategory,
  productBasedOnSuperSubCategory,
  updateProduct,
  updateProductImage,
  updateProductVariant,
  updateProductVariantImage,
} from "../controllers/productController.js";
import upload from "../helpers/multer.js";

const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload.array("images", 7),
  createProduct
);

router.put("/update-product/:id", requireSignIn, isAdmin, updateProduct);
router.put(
  "/update-product-image/:id/image/:imageId",
  requireSignIn,
  isAdmin,
  upload.array("images", 1),
  updateProductImage
);
router.delete("/delete-product/:id", requireSignIn, isAdmin, deleteProduct);
router.delete(
  "/delete-product-image/:id/image/:imageId",
  requireSignIn,
  isAdmin,
  deleteProductImage
);

router.get("/get-all-products", getAllProducts);
router.get("/product-on-category/:id", productBasedOnCatgory);
router.get("/product-on-brand/:id", productBasedOnBrand);
router.get("/product-on-sub-category/:id", productBasedOnSubCategory);
router.get("/product-on-sup-sub-category/:id", productBasedOnSuperSubCategory);
router.get("/product/id/:id", getProductDetailsById);
router.get("/product/slug/:slug", getProductDetailsBySlug);
router.get("/filter-products", getFilteredProducts);

//product variant routes
router.post(
  "/create-variant-product/:id/variant",
  requireSignIn,
  isAdmin,
  upload.array("images", 7),
  createProductVariant
);

router.put(
  "/update-variant-product/:id",
  requireSignIn,
  isAdmin,
  updateProductVariant
);

router.put(
  "/update-variant-product/:id/images/:imageId",
  requireSignIn,
  isAdmin,
  upload.array("images", 1),
  updateProductVariantImage
);

router.delete(
  "/delete-variant-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductVariant
);
router.delete(
  "/delete-varaint-product-image/:id/image/:imageId",
  requireSignIn,
  isAdmin,
  deleteProductVariantImage
);
export default router;
