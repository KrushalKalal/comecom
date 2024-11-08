import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: true,
      unique: true,
    },
    hexCode: { type: String },
    image: { type: String },
    image_id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("color", colorSchema);
