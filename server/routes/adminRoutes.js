const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

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

// ================= GET COURSES =================
router.get("/courses", (req, res) => {
  const sql = `
    SELECT courses.id, courses.title,
    COUNT(enrollments.user_id) AS student_count
    FROM courses
    LEFT JOIN enrollments ON courses.id = enrollments.course_id
    GROUP BY courses.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

// ================= ADD COURSE =================
router.post("/courses", (req, res) => {
  const { title } = req.body;

  db.query("INSERT INTO courses (title) VALUES (?)", [title], (err) => {
    if (err) return res.json({ error: err });
    res.json({ message: "Course added" });
  });
});

// ================= ADD CONTENT =================
router.post("/contents", (req, res) => {
  const { title, url, type, course_id } = req.body;

  db.query(
    "INSERT INTO contents (title, url, type, course_id) VALUES (?, ?, ?, ?)",
    [title, url, type, course_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.json({ error: err });
      }
      res.json({ message: "Content added" });
    }
  );
});

// ================= GET CONTENT BY COURSE =================
router.get("/contents/:courseId", (req, res) => {
  const courseId = req.params.courseId;

  db.query(
    "SELECT * FROM contents WHERE course_id = ?",
    [courseId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ error: err });
      }
      res.json(results);
    }
  );
});

// ================= UPLOAD PDF CONTENT =================
router.post("/contents/upload", upload.single("pdf"), (req, res) => {
  const { title, type, course_id } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res.status(400).json({ message: "No PDF file uploaded" });
  }

  // Convert Windows path separators to forward slashes for web URLs
  const webPath = filePath.replace(/\\/g, "/");

  db.query(
    "INSERT INTO contents (title, url, type, course_id) VALUES (?, ?, ?, ?)",
    [title, webPath, type, course_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving PDF to database" });
      }
      res.json({ message: "PDF uploaded successfully", filePath: webPath });
    }
  );
});

// ================= DELETE COURSE =================
router.delete("/courses/:id", (req, res) => {
  const courseId = req.params.id;
  console.log("Deleting course:", courseId);

  // Delete enrollments first
  db.query("DELETE FROM enrollments WHERE course_id = ?", [courseId], (err) => {
    if (err) {
      console.error("Error deleting enrollments:", err);
      return res.status(500).json({ error: err.message });
    }

    // Delete contents
    db.query("DELETE FROM contents WHERE course_id = ?", [courseId], (err) => {
      if (err) {
        console.error("Error deleting contents:", err);
        return res.status(500).json({ error: err.message });
      }

      // Delete course
      db.query("DELETE FROM courses WHERE id = ?", [courseId], (err) => {
        if (err) {
          console.error("Error deleting course:", err);
          return res.status(500).json({ error: err.message });
        }
        console.log("Course deleted successfully:", courseId);
        res.json({ message: "Course deleted" });
      });
    });
  });
});

// ================= DELETE CONTENT =================
router.delete("/contents/:id", (req, res) => {
  const contentId = req.params.id;

  db.query("DELETE FROM contents WHERE id = ?", [contentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({ message: "Content deleted successfully" });
  });
});

module.exports = router;