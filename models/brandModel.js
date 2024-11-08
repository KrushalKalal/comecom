import mongoose, { Schema } from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
    },
    superSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supsubcategory",
    },
  },
  { timestamps: true }
);

export default mongoose.model("brand", brandSchema);
