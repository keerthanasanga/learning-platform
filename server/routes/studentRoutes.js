const router = require("express").Router();
const db = require("../db");

// Enroll
router.post("/enroll", (req, res) => {
  const { user_id, course_id } = req.body;

  db.query(
    "INSERT INTO enrollments (user_id,course_id) VALUES (?,?)",
    [user_id, course_id],
    () => res.send("Enrolled")
  );
});

module.exports = router;