import sizeModel from "../models/sizeModel.js";

export const createSize = async (req, res) => {
  try {
    const { sizeName, category } = req.body;
    if (!sizeName) {
      return res.status(401).send({ error: "size is required" });
    }
    if (!category) {
      return res.status(401).send({ error: "category is required" });
    }

    const existingSize = await sizeModel.findOne({ sizeName });
    if (existingSize) {
      res.status(200).send({
        success: false,
        message: "Already size created",
      });
    }
    const size = await new sizeModel({
      sizeName,
      category,
    }).save();
    return res.status(201).send({
      success: true,
      message: "new size created",
      size,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while creating size",
      err,
    });
  }
};

export const getSize = async (req, res) => {
  try {
    const size = await sizeModel.find({}).populate("category");
    return res.status(200).send({
      success: true,
      message: "get all sizes successfully",
      size,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting size",
      err,
    });
  }
};

export const sizesOnCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await sizeModel
      .find({ category: id })
      .populate("category", "name");
    return res.status(200).send({
      success: true,
      message: "get list of sizes based on category",
      size,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while getting sizes based on category",
      err,
    });
  }
};

export const updateSize = async (req, res) => {
  try {
    const { sizeName, category } = req.body;
    const { id } = req.params;
    const size = await sizeModel.findByIdAndUpdate(
      id,
      { sizeName, category },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "update size successfully",
      size,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while updating size",
      err,
    });
  }
};

export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await sizeModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "delete size successfully",
      size,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting size",
      err,
    });
  }
};
