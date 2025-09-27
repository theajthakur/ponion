const jwt = require("jsonwebtoken");

const tokenCheck = (role = "user") => {
  return (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized! No Auth token found.",
      });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_KEY);

      if (!verified) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid token" });
      }

      if (verified.status != "active")
        return res.status(401).json({
          status: "error",
          message: "Your account isn't active, please contact admin!",
          reason: `Current Status: ${verified.status}`,
        });

      if (role === "admin" && verified.role !== "admin") {
        return res
          .status(403)
          .json({ status: "error", message: "Admins only" });
      }

      req.user = verified; // attach decoded payload
      next();
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Authorization token!",
      });
    }
  };
};

const checkAuth = tokenCheck("user");
const checkAuthAdmin = tokenCheck("admin");

module.exports = { checkAuth, checkAuthAdmin };
