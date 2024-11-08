import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/create-address", requireSignIn, createAddress);
router.put("/update-address/:id", requireSignIn, updateAddress);
router.delete("/delete-address/:id", requireSignIn, deleteAddress);
router.get("/get-address-user", requireSignIn, getAddress);

export default router;
