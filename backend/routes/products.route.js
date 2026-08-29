const express = require("express");
const { searchProductsFromMenu } = require("../controllers/api/products.controller");
const router = express.Router();

router.get("/", searchProductsFromMenu);

module.exports = router;
