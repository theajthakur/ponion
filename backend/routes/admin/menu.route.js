const express = require("express");
const {
  handleCreateNewMenuItem,
  handleRemoveMenuItem,
  handleListMenuItems,
} = require("../../controllers/admin/menu.controller");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

router.post(
  "/menu/upload",
  upload.single("thumbnail"),
  handleCreateNewMenuItem
);

module.exports = router;
