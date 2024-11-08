import addressModel from "../models/addressModel.js";
import userModel from "../models/userModel.js";

export const createAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      locality,
      address,
      city,
      state,
      pinCode,
      country,
      landmark,
      alternativePhone,
    } = req.body;

    const user = await userModel.findById(req.user._id);
    console.log(req);

    if (!user.addresses) {
      user.addresses = []; // Initialize addresses if undefined
    }
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const data = await new addressModel({
      user: req.user._id,
      name,
      phone,
      locality,
      address,
      city,
      state,
      pinCode,
      country,
      landmark,
      alternativePhone,
    }).save();

    if (data && data._id) {
      user.addresses.push(data._id); // Push only if valid data exists
      await user.save(); // Save the updated user
    } else {
      return res.status(400).json({ msg: "Invalid address data" });
    }

    return res.status(200).send({
      success: true,
      message: "Successfully created address for users",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while creating address",
      err,
    });
  }
};
export const updateAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      locality,
      address,
      city,
      state,
      pinCode,
      country,
      landmark,
      alternativePhone,
    } = req.body;
    const { id } = req.params;
    const result = await addressModel.findById(id);
    console.log(result);
    if (!result || result.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to update this address" });
    }
    const data = await addressModel.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        locality,
        address,
        city,
        state,
        pinCode,
        country,
        landmark,
        alternativePhone,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Successfully updated address of logged in user",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while updating address of logged in user",
      err,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    // const user = await userModel.findById(req.user._id).populate("addresses");
    // const data = await addressModel.findByIdAndDelete(id)

    const address = await addressModel.findById(id);
    console.log(address);
    if (!address || address.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this address" });
    }
    const data = await addressModel.findByIdAndDelete(id);

    await userModel.updateOne(
      { _id: req.user._id },
      { $pull: { addresses: id } }
    );
    return res.status(200).send({
      success: true,
      message: "Successfully deleted address of logged in user",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while deleting address of logged in user",
      err,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("addresses");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).send({
      success: true,
      message: "Successfully getting addresses of logged in user",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "error while getting address of logged in user",
      err,
    });
  }
};
