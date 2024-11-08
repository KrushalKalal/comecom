import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import supSubCategoryModel from "../models/supSubCategoryModel.js";
import slugify from "slugify";
import { uploadImage, deleteImage } from "../helpers/uploadImage.js";
import * as fs from "fs";

//category controllers

//1)create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file;
    if (!name) {
      return res.status(401).send({ error: "Name is required" });
    }
    if (!image) {
      return res.status(401).send({ error: "image is required" });
    }
    //existing Category check
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Already category created",
      });
    }
    const { secure_url, public_id } = await uploadImage(image.path, "category");
    fs.unlinkSync(image.path);

    const category = await new categoryModel({
      name,
      slug: slugify(name),
      image: secure_url,
      image_id: public_id,
    }).save();
    return res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while creating product",
      err,
    });
  }
};

//2)update category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const image = req.file;

    const data = await categoryModel.findById(id);
    if (!data) return res.status(404).send({ message: "category not found" });
    if (data.image) {
      await deleteImage(data.image_id);
    }
    const { secure_url, public_id } = await uploadImage(image.path, "category");
    fs.unlinkSync(image.path);
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name), image: secure_url, image_id: public_id },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "category updates successfully",
      category,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating Category",
      err,
    });
  }
};

//3) delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryImage = await categoryModel.findById(id);
    await deleteImage(categoryImage.image_id);
    const category = await categoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "category deleted",
      category,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting category",
      err,
    });
  }
};

//4) get all categories
export const getCategories = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    return res.status(200).send({
      success: true,
      message: "get all categories",
      category,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all categories",
      err,
    });
  }
};

//5) getting single category
export const singleCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    return res.status(200).send({
      success: true,
      message: "geting perticular category",
      category,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting perticular category",
      err,
    });
  }
};

//6)getting category on id
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.find({ _id: id });
    return res.status(200).send({
      success: true,
      message: "geting perticular category",
      category,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting perticular category",
      err,
    });
  }
};

//1)create Sub Category
export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file;
    //validation
    if (!name) {
      return res.status(401).send({ error: "Name is required" });
    }
    if (!category) {
      return res.status(401).send({ error: "Category is required" });
    }

    if (!image) {
      return res.status(401).send({ error: "image is required" });
    }
    //existing subCategory checked
    const existingSubCategory = await subCategoryModel.findOne({ name });
    if (existingSubCategory) {
      res.status(200).send({
        success: false,
        message: "Already sub-category created",
      });
    }
    const { secure_url, public_id } = await uploadImage(
      image.path,
      "subCategory"
    );
    fs.unlinkSync(image.path);
    const subCategory = await new subCategoryModel({
      name,
      slug: slugify(name),
      category,
      image: secure_url,
      image_id: public_id,
    }).save();
    return res.status(201).send({
      success: true,
      message: "new sub-category created",
      subCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while creating SubCategory",
      err,
    });
  }
};

//2) update sub category
export const updateSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const { id } = req.params;
    const image = req.file;
    const data = await subCategoryModel.findById(id);
    if (!data)
      return res.status(404).send({ message: "sub category not found" });
    if (data.image) {
      await deleteImage(data.image_id);
    }
    const { secure_url, public_id } = await uploadImage(
      image.path,
      "subCategory"
    );
    fs.unlinkSync(image.path);
    const subCategory = await subCategoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
        category,
        image: secure_url,
        image_id: public_id,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "sub category updates successfully",
      subCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).send({
      success: false,
      message: "Error while updating subcategory",
      err,
    });
  }
};

//3) delete sub category
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryImage = await subCategoryModel.findById(id);
    await deleteImage(subCategoryImage.image_id);
    const subCategory = await subCategoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "sub category deleted",
      subCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting subcategory",
      err,
    });
  }
};

//4) get all sub categories
export const getAllSubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryModel.find({}).populate("category");
    return res.status(200).send({
      success: true,
      message: "getting all sub categories",
      subCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting all subCategories",
      err,
    });
  }
};

//5) get subcategory based on category
export const getSubCategoryOnCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // const category = await categoryModel.findOne({ _id: id });
    // const subCategory = await subCategoryModel
    //   .find({ category })
    //   .populate("category");
    const subCategory = await subCategoryModel
      .find({ category: id })
      .populate("category");
    return res.status(200).send({
      success: true,
      message: "getting sub categories based on category",
      subCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting subCategories based on category",
      err,
    });
  }
};

//1)create Sup Sub Category
export const createSupSubCategory = async (req, res) => {
  try {
    const { name, subCategory, category } = req.body;

    //validation
    if (!name) {
      return res.status(401).send({ error: "Name is required" });
    }
    if (!subCategory) {
      return res.status(401).send({ error: "sub-Category is required" });
    }
    if (!category) {
      return res.status(401).send({ error: "category is required" });
    }

    //existing subCategory checked
    const existingSupSubCategory = await supSubCategoryModel.findOne({ name });
    if (existingSupSubCategory) {
      res.status(200).send({
        success: false,
        message: "Already sup-sub-category created",
      });
    }

    const supSubCategory = await new supSubCategoryModel({
      name,
      slug: slugify(name),
      subCategory,
      category,
    }).save();
    return res.status(201).send({
      success: true,
      message: "new sub-category created",
      supSubCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while creating Super-SubCategory",
      err,
    });
  }
};

//2)update Sup Sub Category
export const updateSupSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subCategory, category } = req.body;
    const supSubCategory = await supSubCategoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
        subCategory,
        category,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "sup sub category updates successfully",
      supSubCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating supsub category",
      err,
    });
  }
};

//3)delete Sup Sub Category
export const deleteSupSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const supSubCategory = await supSubCategoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "sub category deleted",
      supSubCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting sup sub category",
      err,
    });
  }
};

//4)get all Sup Sub Category
export const getAllSupSubCategory = async (req, res) => {
  try {
    const supSubCategory = await supSubCategoryModel
      .find({})
      .populate("category")
      .populate("subCategory");
    return res.status(200).send({
      success: true,
      message: "successfully gets all sup sub category",
      supSubCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting sup sub categories",
      err,
    });
  }
};

//5)get Sup Sub Category based on category
export const getSupSubCategoryOnSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const supSubCategory = await supSubCategoryModel
      .find({ subCategory: id })
      .populate("subcategory");
    return res.status(200).send({
      success: true,
      message: "successfully gets all sup sub category based on subcategory",
      supSubCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting sup sub categories based on sub category",
      err,
    });
  }
};
