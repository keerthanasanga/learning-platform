const router = require("express").Router();
const multer = require("multer");

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    } else {
      cb(null, "uploads/pdfs/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 🎥 Upload Video
router.post("/upload-video", upload.single("video"), (req, res) => {
  res.json({ message: "Video uploaded successfully" });
});

// 📄 Upload PDF
router.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  res.json({ message: "PDF uploaded successfully" });
});

module.exports = router;