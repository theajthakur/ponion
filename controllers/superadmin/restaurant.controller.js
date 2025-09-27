const User = require("../../models/User");

const handleApproveRestaurent = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({
        status: "error",
        message: "ownerId is required",
      });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found with the given ownerId!",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Invalid role of user! Only admins can be approved.",
      });
    }

    user.status = "active";
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Restaurant activated successfully!",
    });
  } catch (err) {
    console.error("Error approving restaurant:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

module.exports = { handleApproveRestaurent };
