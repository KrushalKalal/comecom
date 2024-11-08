import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary with credentials
async function cloudinaryConfig() {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary Configuration successfully");
  } catch (err) {
    console.log(err);
    console.log("Error while config cloudinary");
  }
}

export default cloudinaryConfig;
