const express = require("express");
const router = express.Router();
const db = require("../db");

// ================= GET ALL COURSES =================
router.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

// ================= ENROLL =================
router.post("/enroll", (req, res) => {
  const { user_id, course_id } = req.body;

  db.query(
    "INSERT INTO enrollments (user_id, course_id) VALUES (?,?)",
    [user_id, course_id],
    (err) => {
      if (err) return res.json({ error: "Already enrolled" });
      res.json({ message: "Enrolled successfully" });
    }
  );
});


// ================= GET ENROLLED COURSES =================
router.get("/my-courses/:userId", (req, res) => {
  const sql = `
    SELECT courses.id, courses.title
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.user_id = ?
  `;

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});




// ================= GET COURSE CONTENT FOR STUDENT =================
router.get("/course-content/:courseId", (req, res) => {
  const courseId = Number(req.params.courseId);
  const userId = Number(req.query.userId);

  console.log("BACKEND → userId:", userId, "courseId:", courseId);

  const checkEnroll = `
    SELECT * FROM enrollments 
    WHERE user_id = ? AND course_id = ?
  `;

  db.query(checkEnroll, [userId, courseId], (err, enrollResult) => {
    if (err) return res.status(500).json(err);

    console.log("ENROLL RESULT:", enrollResult);

    if (enrollResult.length === 0) {
      return res.json({ error: "NOT_ENROLLED" });
    }

    const getContent = `SELECT * FROM contents WHERE course_id = ?`;

    db.query(getContent, [courseId], (err, contentResult) => {
      if (err) return res.status(500).json(err);

      console.log("CONTENT RESULT:", contentResult);

      res.json(contentResult);
    });
  });
});
module.exports = router;