const User = require("../../models/User");

const handleShowUserProfile = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });
    user = user.toObject();
    delete user.password;
    return res.json({
      status: "success",
      user,
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: "Something went wrong!",
      reason: error.message || "fetching User data",
    });
  }
};
module.exports = { handleShowUserProfile };
