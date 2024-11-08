import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "color",
      required: true,
    },
    sizes: [
      {
        size: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "size",
          required: true,
        },
        stock: { type: Number, required: true },
        sku: { type: String, required: true },
      },
    ],
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("variants", ProductVariantSchema);
