const express = require("express");
const router = express.Router();
const db = require("../db");

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

// ================= DELETE CONTENT =================
router.delete("/contents/:id", (req, res) => {
  db.query(
    "DELETE FROM contents WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.json({ error: err });
      }
      res.json({ message: "Content deleted" });
    }
  );
});

module.exports = router;