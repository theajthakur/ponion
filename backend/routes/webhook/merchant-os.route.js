const express = require("express");
const { handleWebhook } = require("../../controllers/webhook/merchant-os.controller");
const router = express.Router();

router.post("/", handleWebhook);

module.exports = router;
