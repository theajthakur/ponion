const Address = require("../../models/Address");

const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const addresses = await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      label,
      flatNo,
      street,
      landmark,
      city,
      district,
      state,
      pincode,
      country = "India",
      isDefault = false,
    } = req.body;

    // Validate required fields
    const requiredFields = { flatNo, street, city, district, state, pincode };
    for (const [field, val] of Object.entries(requiredFields)) {
      if (!val || (typeof val === "string" && !val.trim())) {
        return res
          .status(400)
          .json({ success: false, message: `${field} is required` });
      }
    }

    // Validate pincode format
    if (!PINCODE_REGEX.test(String(pincode).trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format. Must be a 6-digit Indian PIN code",
      });
    }

    // If setting as default, unset default on user's existing addresses
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      userId,
      label: label ? label.trim() : undefined,
      flatNo: flatNo.trim(),
      street: street.trim(),
      landmark: landmark ? landmark.trim() : undefined,
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pincode: String(pincode).trim(),
      country: country ? country.trim() : "India",
      isDefault: Boolean(isDefault),
    });

    return res.status(201).json({ success: true, address });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const addressId = req.params.id;

    const existingAddress = await Address.findOne({ _id: addressId, userId });
    if (!existingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found for this user" });
    }

    const {
      label,
      flatNo,
      street,
      landmark,
      city,
      district,
      state,
      pincode,
      country,
      isDefault,
    } = req.body;

    // Validate required fields
    const requiredFields = { flatNo, street, city, district, state, pincode };
    for (const [field, val] of Object.entries(requiredFields)) {
      if (!val || (typeof val === "string" && !val.trim())) {
        return res
          .status(400)
          .json({ success: false, message: `${field} is required` });
      }
    }

    // Validate pincode format
    if (!PINCODE_REGEX.test(String(pincode).trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format. Must be a 6-digit Indian PIN code",
      });
    }

    const setAsDefault = isDefault !== undefined ? Boolean(isDefault) : existingAddress.isDefault;

    if (setAsDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId } },
        { isDefault: false }
      );
    }

    existingAddress.label = label !== undefined ? (label ? label.trim() : undefined) : existingAddress.label;
    existingAddress.flatNo = flatNo.trim();
    existingAddress.street = street.trim();
    existingAddress.landmark = landmark !== undefined ? (landmark ? landmark.trim() : undefined) : existingAddress.landmark;
    existingAddress.city = city.trim();
    existingAddress.district = district.trim();
    existingAddress.state = state.trim();
    existingAddress.pincode = String(pincode).trim();
    if (country) existingAddress.country = country.trim();
    existingAddress.isDefault = setAsDefault;

    await existingAddress.save();

    return res.status(200).json({ success: true, address: existingAddress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found for this user" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
