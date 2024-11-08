import brandModel from "../models/brandModel.js";
import slugify from "slugify";
import { uploadImage, deleteImage } from "../helpers/uploadImage.js";
import * as fs from "fs";

export const createBrand = async (req, res) => {
  try {
    const { brandName, category, subCategory, superSubCategory } = req.body;
    const image = req.file;
    if (!brandName) {
      return res.status(401).send({ error: "brand is required" });
    }
    if (!image) {
      return res.status(401).send({ error: "image is required" });
    }
    const existingBrand = await brandModel.findOne({ brandName });
    if (existingBrand) {
      res.status(200).send({
        success: false,
        message: "Already brand created",
      });
    }

    const { secure_url, public_id } = await uploadImage(image.path, "brands");
    fs.unlinkSync(image.path);
    const brand = await new brandModel({
      brandName,
      slug: slugify(brandName),
      image: secure_url,
      image_id: public_id,
      category,
      subCategory,
      superSubCategory,
    }).save();
    return res.status(201).send({
      success: true,
      message: "new brand created",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while crrating brand",
      err,
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, category, subCategory, superSubCategory } = req.body;
    const image = req.file;

    const data = await brandModel.findById(id);
    console.log(data);
    if (!data) return res.status(404).send({ message: "brand not found" });
    if (data.image) {
      await deleteImage(data.image_id);
    }
    const { secure_url, public_id } = await uploadImage(image.path, "brands");
    fs.unlinkSync(image.path);
    // data.image = secure_url;
    // data.image_id = public_id;
    // await data.save();

    const brand = await brandModel.findByIdAndUpdate(
      id,
      {
        brandName,
        slug: slugify(brandName),
        image: secure_url,
        image_id: public_id,
        category,
        subCategory,
        superSubCategory,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "update brand successfully",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while updating brand",
      err,
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandImage = await brandModel.findById(id);
    await deleteImage(brandImage.image_id); // delete image from cloudinary
    const brand = await brandModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "delete brand successfully",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while deleting brand",
      err,
    });
  }
};

export const getAllBrand = async (req, res) => {
  try {
    const brand = await brandModel
      .find({})
      .populate("category")
      .populate("subCategory");
    return res.status(200).send({
      success: true,
      message: "getting all brands successfully",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all brands",
      err,
    });
  }
};

export const getBrandOnCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandModel.find({ category: id }).populate("category");
    return res.status(200).send({
      success: true,
      message: "getting all brands based on category",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting brands on category",
      err,
    });
  }
};
export const getBrandOnSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandModel
      .find({ subCategory: id })
      .populate([{ path: "subcategory", strictPopulate: false }]);
    return res.status(200).send({
      success: true,
      message: "getting all brands based on sub category",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting brands on sub category",
      err,
    });
  }
};
export const getBrandOnSupSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandModel
      .find({ superSubCategory: id })
      .populate([{ path: "supsubcategory", strictPopulate: false }]);
    return res.status(200).send({
      success: true,
      message: "getting all brands based on super sub category",
      brand,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting brands on super sub category",
      err,
    });
  }
};
