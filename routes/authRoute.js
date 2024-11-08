import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  getUserDetails,
  updateUserDetails,
  getAllUsers,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import upload from "../helpers/multer.js";

//router object
const router = express.Router();

//routing

//register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//forget-password
router.post("/forget-password", forgetPasswordController);

//test middleware
router.get("/test", requireSignIn, isAdmin, testController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

router.get("/get-user-detail", requireSignIn, getUserDetails);
router.put(
  "/update-user-details",
  requireSignIn,
  upload.single("image"),
  updateUserDetails
);

router.get("/get-all-users", requireSignIn, isAdmin, getAllUsers);
router.delete("/delete-user/:userId", requireSignIn, isAdmin, deleteUser);
router.put(
  "/update-user-role/:userId/role",
  requireSignIn,
  isAdmin,
  updateUserRole
);
router.put(
  "/update-user-status/:userId/status",
  requireSignIn,
  isAdmin,
  toggleUserStatus
);

export default router;
