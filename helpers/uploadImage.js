import { v2 as cloudinary } from "cloudinary";
import cloudinaryConfig from "./cloudinary.js";

async function uploadImage(imagepath, folderName) {
  // console.log(imagepath);
  try {
    cloudinaryConfig();
    const result = await cloudinary.uploader.upload(imagepath, {
      folder: folderName,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function deleteImage(imageId) {
  try {
    await cloudinary.uploader.destroy(imageId);
  } catch (err) {
    console.log(err);
  }
}

// async function updateImage(imageId, imagePath) {
//   console.log(imageId, imagePath);
//   try {
//     const result = await cloudinary.uploader.upload(imagePath, {
//       public_id: imageId,
//     });
//     return result;
//   } catch (err) {
//     console.log(err);
//   }
// }

export { uploadImage, deleteImage };
