import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("subcategory", subCategorySchema);
