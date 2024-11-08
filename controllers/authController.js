import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import { uploadImage, deleteImage } from "../helpers/uploadImage.js";
import * as fs from "fs";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, answer } = req.body;

    //validation
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone Number is Required" });
    }
    if (!answer) {
      return res.send({ error: "Secret Key is Required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //check existing user
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already registered please login",
      });
    }

    //register users

    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      answer,
    }).save();

    return res.status(200).send({
      success: true,
      message: "User Registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid Username or Password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "invalid password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while login",
      error,
    });
  }
};

//forget-password controller
export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Secret key is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "Password is required",
      });
    }

    //check valid
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or secret",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

//test middleware controller
export const testController = async (req, res) => {
  console.log("protected routes");
  res.send("protected routes");
};

//get loggedin user details
export const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("addresses");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).send({
      success: true,
      message: "Successfully Getting user details with address",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting details of logged in user",
      err,
    });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const image = req.file;
    const { name, phone } = req.body;
    const data = await userModel.findById(req.user._id);
    if (!data) return res.status(404).send({ message: "user not found" });
    if (data.image) {
      await deleteImage(data.image_id);
    }
    const { secure_url, public_id } = await uploadImage(image.path, "users");
    fs.unlinkSync(image.path);
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, phone, image: secure_url, image_id: public_id },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "user detailsupdated successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating user profile",
      err,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      success: true,
      message: "get all users successfully",
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting all users",
      err,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    return res.status(200).send({
      success: true,
      message: "delete user successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while deleting user",
      err,
    });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "updated user role successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while updating user role",
      err,
    });
  }
};
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();
    return res.status(200).send({
      success: true,
      message: "updated user status successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while updating user status",
      err,
    });
  }
};
