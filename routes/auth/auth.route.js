const express = require("express");
const { status } = require("express/lib/response");
const router = express.Router();

router.get("/login", (req, res) => {
  return res.json({ status: "success" });
});

module.exports = router;
