import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
    role: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    image: {
      type: String,
    },
    image_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
