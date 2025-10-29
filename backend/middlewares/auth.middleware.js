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
          reason: `Current Status: ${verified.status} for role: ${verified.role}`,
        });

      if (
        role === "admin" &&
        !["admin", "superadmin"].includes(verified.role)
      ) {
        return res
          .status(403)
          .json({ status: "error", message: "Admins only" });
      }

      if (role === "superadmin" && verified.role != "superadmin") {
        return res
          .status(403)
          .json({ status: "error", message: "SuperAdmins only" });
      }

      if (verified.status != "active")
        return res.status(400).json({
          status: "error",
          message: "You are restricted from loggin in!",
          reason: verified.status,
        });

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
const checkAuthSuperAdmin = tokenCheck("superadmin");

module.exports = { checkAuth, checkAuthAdmin, checkAuthSuperAdmin };
