const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Restaurant = require("../../models/Restaurant");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");

const {
  emailVerificationTemplate,
} = require("../../lib/template/email.verify.template");
const sendEmail = require("../../utils/email.utils");
const ActivationLink = require("../../models/ActivationLink");
const validateImage = require("../../utils/fileType.utils");
const uploadToCloudinary = require("../../utils/cloudinary.utils");

const sendVerificationEmail = async (name, userId, to) => {
  try {
    const subject = "Verify your PONION Account";
    const activationId = uuidv4();
    await ActivationLink.create({ activationId, userId });
    const link = `${process.env.SERVER_URL}/auth/verify/${activationId}`;
    sendEmail({ to, subject, html: emailVerificationTemplate(name, link) });
    return true;
  } catch (error) {
    console.log(error, error?.message);
    return false;
  }
};

const handleAttemptLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password)
    return res.json({
      status: "error",
      message: `No user found with ${email}`,
    });
  const verified = await bcrypt.compare(password, user.password);
  if (!verified)
    return res.json({
      status: "error",
      message: `Your password for ${email} is incorrect!`,
    });
  let tokenUser = user.toObject();
  function reason(reason) {
    const err = {
      active: "Your account is active. You can log in successfully.",
      disabled:
        "Your account has been disabled. Please contact the Administrator for assistance.",
      pending_email:
        "Your email is pending verification. Please verify it before attempting to log in. Contact the Administrator if you continue to face this issue.",
    };

    return err[reason] || "You are restricted from logging in!";
  }

  if (tokenUser.status != "active")
    return res.status(400).json({
      status: "error",
      message: reason(tokenUser.status),
    });
  if (user.role == "admin") {
    const restaurant = await Restaurant.findOne({ owner: user._id });
    if (restaurant) tokenUser.restaurant = restaurant;
  }

  delete tokenUser.password;
  const token = jwt.sign(tokenUser, process.env.JWT_KEY);
  return res.json({
    status: "success",
    message: "Login successfull",
    data: {
      token,
      account_status: user.status,
    },
  });
};

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(50).required(),
  gender: Joi.string().valid("male", "female", "other").default("other"),
});

const handleNewUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password, name, gender } = value;
  if (!email || !password || !name || !gender)
    return res.json({
      status: "error",
      message: "Missing required arguments!",
    });
  const user = await User.findOne({ email });
  if (user)
    return res.json({
      status: "error",
      message: `An user with email: ${email} already exists!`,
    });
  const hashedPass = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPass,
    gender,
  });
  if (!newUser)
    return res.json({
      status: "error",
      message: "There is an error while creating your account!",
    });
  sendVerificationEmail(name.split(" ")[0], newUser._id, email);

  return res.json({
    status: "success",
    message: "Account created successfully!",
  });
};

const restaurantUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(50).required(),
  gender: Joi.string().valid("male", "female", "other").default("other"),
  restaurantName: Joi.string().min(2).max(100).required(),
  address: Joi.object({
    lat: Joi.string().required(),
    lng: Joi.string().required(),
    raw: Joi.string().min(5).max(100).required(),
  }).required(),
});

const handleNewRestaurantUser = async (req, res) => {
  const { error, value } = restaurantUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password, name, gender, restaurantName, address } = value;

  try {
    // -------------------------
    // 1. Check duplicate user
    // -------------------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: `A user with email: ${email} already exists!`,
      });
    }

    // -------------------------
    // 2. Validate image
    // -------------------------
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Restaurant banner image is required",
      });
    }

    const { valid, message } = await validateImage(req.file.buffer);
    if (!valid) {
      return res.status(400).json({
        status: "error",
        message,
      });
    }

    // -------------------------
    // 3. Upload banner to Cloudinary
    // -------------------------
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'restaurant_banners',
      format: 'webp',
      transformation: [
        { width: 1600, height: 600, crop: 'fill' },
        { quality: 'auto' },
      ],
    });

    console.log(uploadResult);

    // -------------------------
    // 4. Create user
    // -------------------------
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
      gender,
      role: "admin",
    });

    // -------------------------
    // 5. Create restaurant
    // -------------------------
    const restaurantId = uuidv4();

    await Restaurant.create({
      restaurantId,
      owner: newUser._id,
      name: restaurantName,
      address,
      banner: uploadResult.secure_url, // Cloudinary URL
      bannerPublicId: uploadResult.public_id, // OPTIONAL (recommended)
    });

    return res.status(201).json({
      status: "success",
      message: "Account and restaurant created successfully!",
      data: {
        userId: newUser._id,
      },
    });

  } catch (err) {
    console.error("Error creating restaurant user:", err);

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const verifyUserByEmail = async (req, res) => {
  try {
    const { verificationId } = req.params;

    if (!verificationId || typeof verificationId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing verification ID.",
      });
    }

    const activation = await ActivationLink.findOne({
      activationId: verificationId,
    });
    if (!activation) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification link.",
      });
    }

    const dateCreated = activation.createdAt;
    const expireTime = 24 * 60 * 60 * 1000; // 1 day in ms
    const expiryDate = new Date(dateCreated.getTime() + expireTime);

    if (expiryDate < new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Verification link has expired.",
      });
    }

    const user = await User.findById(activation.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    if (user.status === "active") {
      return res.status(200).json({
        status: "success",
        message: "Account is already activated.",
      });
    }

    await User.updateOne({ _id: user._id }, { $set: { status: "active" } });
    await ActivationLink.deleteOne({ activationId: verificationId });

    return res.status(200).json({
      status: "success",
      message: "Account activated successfully!",
    });
  } catch (error) {
    console.error("Error in verifyUserByEmail:", error);
    return res.status(500).json({
      status: "error",
      message:
        "Something went wrong while verifying account. Please try again later.",
    });
  }
};

module.exports = {
  handleAttemptLogin,
  handleNewUser,
  handleNewRestaurantUser,
  verifyUserByEmail,
};
