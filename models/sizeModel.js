import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    sizeName: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("size", sizeSchema);
