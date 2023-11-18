const { Router } = require("express");
const {
  handleCreateFolder,
  handleFileUpload,
  handleFileDelete,
} = require("./file.controller");

const router = Router();

router.post("/create/folder", handleCreateFolder);
router.post("/create/sub_folder", handleCreateFolder);
router.delete("/remove/file", handleFileDelete)
router.post("/upload/file", handleFileUpload);

module.exports = router;
