import productModel from "../models/productModel.js";
import productVariantModel from "../models/productVariantModel.js";
import { uploadImage, deleteImage } from "../helpers/uploadImage.js";
import * as fs from "fs";
import slugify from "slugify";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      title,
      price,
      brand,
      category,
      subCategory,
      rating,
    } = req.body;
    const images = req.files;
    if (!name) {
      return res.status(401).send({ error: "name is required" });
    }
    if (!title) {
      return res.status(401).send({ error: "title is required" });
    }
    if (!price) {
      return res.status(401).send({ error: "price is required" });
    }
    if (!description) {
      return res.status(401).send({ error: "description is required" });
    }
    if (!brand) {
      return res.status(401).send({ error: "brand is required" });
    }
    if (!category) {
      return res.status(401).send({ error: "category is required" });
    }
    // if (!images || images.length === 0) {
    //   return res.status(401).send({ error: "images are required" });
    // }
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(200).send({
        success: false,
        message: "Already product created",
      });
    }

    const imageUpload = images.map(async (file) => {
      const uploadResult = await uploadImage(file.path, "products");
      await fs.unlinkSync(file.path);
      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
      };
    });
    // const imageUpload = await Promise.all(
    //   images.map(async (file) => {
    //     try {
    //       const uploadResult = await uploadImage(file.path, "products"); // Await the upload result
    //      // console.log("Cloudinary Upload Result:", uploadResult); // Debug log to check the response
    //       await fs.unlinkSync(file.path);
    //       return {
    //         public_id: uploadResult.public_id,
    //         secure_url: uploadResult.secure_url,
    //       };
    //     } catch (error) {
    //       console.error("Error uploading image:", error);
    //       throw new Error("Failed to upload image");
    //     }
    //   })
    // );

    const imageResult = await Promise.all(imageUpload);

    const product = await new productModel({
      name,
      slug: slugify(name),
      description,
      title,
      price,
      images: imageResult,
      brand,
      category,
      subCategory,
      rating,
    }).save();

    return res.status(200).send({
      success: true,
      message: "creating base product successfully",
      product,
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

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      title,
      price,
      brand,
      category,
      subCategory,
      superSubCategory,
      rating,
    } = req.body;
    const { id } = req.params;
    const data = await productModel.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Product  not found" });
    }
    const product = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        title,
        price,
        brand,
        category,
        subCategory,
        superSubCategory,
        rating,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "updated product successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating product",
      err,
    });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const images = req.files;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageIndex = product.images.findIndex(
      (image) => image._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found with given id" });
    }

    const uploadResult = await uploadImage(images[0].path, "products");
    const oldImagePublicId = product.images[imageIndex].public_id;
    await deleteImage(oldImagePublicId);

    product.images[imageIndex] = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    };
    await fs.unlinkSync(images[0].path);

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { images: product.images },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating variant's image",
      err,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productModel.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!data.images || data.images.length === 0) {
      return res.status(400).json({ message: "No images found to delete" });
    }

    for (const image of data.images) {
      const publicId = image.public_id;
      try {
        await deleteImage(publicId); // Delete each image from Cloudinary
      } catch (error) {
        console.error(
          `Failed to delete image with public_id: ${publicId}`,
          error
        );
      }
    }
    await productVariantModel.deleteMany({ product: id });
    const product = await productModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "successfully product  deleted",
      product,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      err,
    });
  }
};
export const deleteProductImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const imageIndex = product.images.findIndex(
      (image) => image._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found with given id" });
    }

    const oldImagePublicId = product.images[imageIndex].public_id;
    await deleteImage(oldImagePublicId);
    product.images.splice(imageIndex, 1);
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { images: product.images },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully!",
      productVariant: updatedProduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product  image",
      err,
    });
  }
};

// get all products with all populates
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    return res.status(200).send({
      success: true,
      message: "fetched all the products successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all the products",
      err,
    });
  }
};

export const productBasedOnBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel
      .find({ brand: id })
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    if (!products.length) {
      return res
        .status(404)
        .send({ message: "No products found for this brand" });
    }

    return res.status(200).send({
      success: true,
      message: "fetched all the products based on brand successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all the products based on brand",
      err,
    });
  }
};
export const productBasedOnCatgory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel
      .find({ category: id })
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    if (!products.length) {
      return res
        .status(404)
        .send({ message: "No products found for this category" });
    }
    return res.status(200).send({
      success: true,
      message: "fetched all the products based on category successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all the products based on category",
      err,
    });
  }
};
export const productBasedOnSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel
      .find({ subCategory: id })
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    if (!products.length) {
      return res
        .status(404)
        .send({ message: "No products found for this category" });
    }
    return res.status(200).send({
      success: true,
      message: "fetched all the products based on category sub successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all the products based on sub category",
      err,
    });
  }
};
export const productBasedOnSuperSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel
      .find({ superSubCategory: id })
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    if (!products.length) {
      return res
        .status(404)
        .send({ message: "No products found for this csuper sub ategory" });
    }
    return res.status(200).send({
      success: true,
      message: "fetched all the products based on category successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message:
        "error while getting all the products based on super sub category",
      err,
    });
  }
};
export const getProductDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel
      .findById(id)
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    if (!products) {
      return res.status(404).send({
        message: "No products found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetched product details successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all the product details of given id",
      err,
    });
  }
};
export const getProductDetailsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const products = await productModel
      .findOne({ slug })
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });
    if (!products) {
      return res.status(404).send({
        message: "No products found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetched product details successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting all the product details of given slug",
      err,
    });
  }
};

export const getFilteredProducts = async (req, res) => {
  try {
    const {
      brand,
      category,
      subCatgeory,
      supSubCategory,
      color,
      size,
      minPrice,
      maxPrice,
      rating,
      sortBy,
    } = req.query;

    const filter = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (subCatgeory) filter.subCategory = subCatgeory;
    if (supSubCategory) filter.superSubCategory = supSubCategory;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    let products = await productModel
      .find(filter)
      .populate("brand", "brandName")
      .populate("category", "name")
      .populate({
        path: "variants",
        populate: [
          {
            path: "color",
            select: "colorName",
          },
          {
            path: "sizes.size",
            select: "sizeName",
          },
        ],
      });

    if (color || size) {
      products = products.filter((product) => {
        const hasColor = color
          ? product.variants.some((variant) => {
              return (
                variant.color &&
                variant.color._id.toString() === color.toString()
              );
            })
          : true;
        const hasSize = size
          ? product.variants.some((variant) =>
              variant.sizes.some((s) => {
                return s.size && s.size._id.toString() === size.toString();
              })
            )
          : true;

        return hasColor && hasSize;
      });
    }

    if (rating) {
      products = products.filter((product) => product.rating >= rating);
    }

    if (sortBy) {
      if (sortBy === "price") {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === "newest") {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "highestRating") {
        products.sort((a, b) => b.rating - a.rating);
      }
    }

    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found matching your criteria" });
    }
    return res.status(200).send({
      success: true,
      message: "fetched products according to filter successfully",
      products,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while getting products on basis of filters",
      err,
    });
  }
};

//porduct variants contollers
export const createProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, sizes } = req.body;
    const images = req.files;
    if (!id) {
      return res.status(401).send({ error: "product id is required" });
    }
    if (!color) {
      return res.status(401).send({ error: "color is required" });
    }
    // if (!images || images.length === 0) {
    //   return res.status(401).send({ error: "images are required" });
    // }
    if (!sizes) {
      return res.status(401).send({ error: "size is required" });
    }
    console.log(images, id, color, sizes);
    const parsedSizes = JSON.parse(sizes);
    const existingVariant = await productVariantModel.findOne({
      product: id,
      color,
    });

    if (existingVariant) {
      return res.status(200).send({
        success: false,
        message: "A variant with this color already exists for this product",
      });
    }

    const imageUpload = images.map(async (file) => {
      const uploadResult = await uploadImage(file.path, "products");
      await fs.unlinkSync(file.path);
      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
      };
    });

    const imageResult = await Promise.all(imageUpload);

    const productVariant = await new productVariantModel({
      product: id,
      color,
      sizes: parsedSizes,
      images: imageResult,
    });
    console.log(productVariant);
    const saveProduct = await productVariant.save();
    await productModel.findByIdAndUpdate(id, {
      $addToSet: { variants: saveProduct._id },
    });

    return res.status(200).send({
      success: true,
      message: "creating variant for product successfully",
      productVariant,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while creating product variant",
      err,
    });
  }
};

export const updateProductVariant = async (req, res) => {
  try {
    const { product, color, sizes } = req.body;
    const { id } = req.params;
    const data = await productVariantModel.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Product Variant not found" });
    }
    const productVariant = await productVariantModel.findByIdAndUpdate(
      id,
      {
        product,
        color,
        sizes,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "updated product variant successfully",
      productVariant,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating product variants",
      err,
    });
  }
};

export const updateProductVariantImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const images = req.files; // Assuming images is an array of uploaded files

    // Step 1: Find the product variant
    const productVariant = await productVariantModel.findById(id);
    if (!productVariant) {
      return res.status(404).json({ message: "Product Variant not found" });
    }

    // Step 2: Check if the image exists in the variant's images array
    const imageIndex = productVariant.images.findIndex(
      (image) => image._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found with given id" });
    }

    // Step 3: Upload the new image to Cloudinary
    const uploadResult = await uploadImage(images[0].path, "products"); // Use the first file in the array

    // Step 4: Delete the old image from Cloudinary using its public_id
    const oldImagePublicId = productVariant.images[imageIndex].public_id;
    await deleteImage(oldImagePublicId);

    // Step 5: Update the image details in the product variant
    productVariant.images[imageIndex] = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    };

    // Delete the local file after uploading to Cloudinary
    await fs.unlinkSync(images[0].path); // Use the promise-based unlink

    // Step 6: Save the updated product variant
    const updatedProductVariant = await productVariantModel.findByIdAndUpdate(
      id,
      { images: productVariant.images },
      { new: true }
    );

    // Step 7: Respond with success
    return res.status(200).json({
      success: true,
      message: "Product variant image updated successfully!",
      productVariant: updatedProductVariant,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Error while updating variant's image",
      error: err.message || err,
    });
  }
};

export const deleteProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productVariantModel.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Product Variant not found" });
    }

    // Step 2: Check if there are any images to delete
    if (!data.images || data.images.length === 0) {
      return res.status(400).json({ message: "No images found to delete" });
    }

    // Step 3: Delete all images from Cloudinary
    for (const image of data.images) {
      const publicId = image.public_id;
      try {
        await deleteImage(publicId); // Delete each image from Cloudinary
      } catch (error) {
        console.error(
          `Failed to delete image with public_id: ${publicId}`,
          error
        );
      }
    }
    const productVariant = await productVariantModel.findByIdAndDelete(id);
    await productModel.updateOne(
      { _id: data.product },
      { $pull: { variants: id } }
    );
    return res.status(200).send({
      success: true,
      message: "successfully product varaint deleted",
      productVariant,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product variant",
      err,
    });
  }
};

export const deleteProductVariantImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const productVariant = await productVariantModel.findById(id);
    if (!productVariant) {
      return res.status(404).json({ message: "Product Variant not found" });
    }
    const imageIndex = productVariant.images.findIndex(
      (image) => image._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found with given id" });
    }

    const oldImagePublicId = productVariant.images[imageIndex].public_id;
    await deleteImage(oldImagePublicId);
    productVariant.images.splice(imageIndex, 1);
    const updatedProductVariant = await productVariantModel.findByIdAndUpdate(
      id,
      { images: productVariant.images },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product variant image deleted successfully!",
      productVariant: updatedProductVariant,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product variant image",
      err,
    });
  }
};
