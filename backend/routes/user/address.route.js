const express = require("express");
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../../controllers/user/address.controller");

const router = express.Router();

router.get("/", getAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
