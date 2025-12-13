const express = require("express");
const {
  handleCreateNewMenuItem,
  handleRemoveMenuItem,
  handleListMenuItems,
} = require("../../controllers/admin/menu.controller");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + " - " + file.originalname);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, });

router.post(
  "/menu/upload",
  upload.single("thumbnail"),
  handleCreateNewMenuItem
);

module.exports = router;
