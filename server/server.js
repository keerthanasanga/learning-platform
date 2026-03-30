const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pdfs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//admin
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

//student
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);


// Serve uploaded PDFs
app.use("/uploads", express.static("uploads"));

// Serve client files
app.use(express.static("client"));

const db = require("./db");

// ✅ START SERVER (VERY IMPORTANT)
app.listen(5000, () => {
  console.log("🔥 Server running on port 5000");
});