const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

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

const handleNewUser = async (req, res) => {
  const { email, password, name, gender = "other" } = req.body;
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

module.exports = { handleAttemptLogin, handleNewUser };
