const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

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

const db = require("./db");

// ✅ START SERVER (VERY IMPORTANT)
app.listen(5000, () => {
  console.log("🔥 Server running on port 5000");
});