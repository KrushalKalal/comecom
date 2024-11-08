import { uploadImage, deleteImage } from "../helpers/uploadImage.js";
import colorModel from "../models/colorModel.js";
import * as fs from "fs";
export const createColor = async (req, res) => {
  try {
    const { colorName, hexCode } = req.body;
    const image = req.file;

    if (!colorName) {
      return res.status(401).send({ error: "color is required" });
    }

    const existingColor = await colorModel.findOne({ colorName });
    if (existingColor) {
      res.status(200).send({
        success: false,
        message: "Already color created",
      });
    }
    const { secure_url, public_id } = await uploadImage(image.path, "colors");
    fs.unlinkSync(image.path);
    const color = await new colorModel({
      colorName,
      hexCode,
      image: secure_url,
      image_id: public_id,
    }).save();
    return res.status(201).send({
      success: true,
      message: "new color created",
      color,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while creating color",
      err,
    });
  }
};
export const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { colorName, hexCode } = req.body;
    const image = req.file;

    const data = await colorModel.findById(id);
    console.log(data);
    if (!data) return res.status(404).send({ message: "color not found" });
    if (data.image) {
      await deleteImage(data.image_id);
    }
    const { secure_url, public_id } = await uploadImage(image.path, "colors");
    fs.unlinkSync(image.path);
    // data.image = secure_url;
    // data.image_id = public_id;
    // await data.save();

    const color = await colorModel.findByIdAndUpdate(
      id,
      { colorName, hexCode, image: secure_url, image_id: public_id },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "update color successfully",
      color,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while updating color",
      err,
    });
  }
};

export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const colorImage = await colorModel.findById(id);
    await deleteImage(colorImage.image_id); // delete image from cloudinary
    const color = await colorModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "delete color successfully",
      color,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while deleting color",
      err,
    });
  }
};
export const getColor = async (req, res) => {
  try {
    const color = await colorModel.find({});
    return res.status(200).send({
      success: true,
      message: "get all colors successfully",
      color,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting color list",
      err,
    });
  }
};
