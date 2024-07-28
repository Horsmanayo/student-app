const { storage } = require("../storage/storage");
const multer = require("multer");
const { Router } = require("express");
const upload = multer({ storage });

const router = Router();

router.post("/upload", upload.single("image"), (req, res) => {
  res.status(200).send({
    status: "success",
    message: "Image uploaded successfully",
    url: req.file.path,
  });
});

module.exports = router;
