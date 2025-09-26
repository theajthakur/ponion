const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.json({
      status: "error",
      message: "Unauthorised!",
      reason: "No Auth token found.",
    });
  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    if (!verified)
      return res.json({ status: "error", message: "Invalid hash" });
    req.user = verified;
    next();
  } catch (error) {
    return res.json({
      status: "error",
      message: "Invalid Authorization token!",
      token,
    });
  }
};

module.exports = checkAuth;
