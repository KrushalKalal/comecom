import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected routes token based
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    ); //encryption
    req.user = decode; //decryption user._id in admin middleare access
    next();
  } catch (err) {
    console.log(err);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorize Access",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      success: false,
      message: "Error is Admin Middleware",
    });
  }
};
