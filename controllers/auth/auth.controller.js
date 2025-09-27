const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Restaurant = require("../../models/Restaurant");
const Joi = require("joi");

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
  password: Joi.string().min(6).required(), // you can enforce stronger rules if needed
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

  return res.json({
    status: "success",
    message: "Account created successfully!",
  });
};

const restaurantUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // you can enforce stronger rules if needed
  name: Joi.string().min(2).max(50).required(),
  gender: Joi.string().valid("male", "female", "other").default("other"),
  restaurantName: Joi.string().min(2).max(100).required(),
  address: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
});

const handleNewRestaurantUser = async (req, res) => {
  // Validate request body
  const { error, value } = restaurantUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password, name, gender, restaurantName, address } = value;

  try {
    // Check duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: `A user with email: ${email} already exists!`,
      });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
      gender,
      role: "admin",
    });

    // Create restaurant linked to user
    await Restaurant.create({
      owner: newUser._id,
      name: restaurantName,
      address: {
        lat: address.lat,
        lng: address.lng,
      },
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

module.exports = { handleAttemptLogin, handleNewUser, handleNewRestaurantUser };
