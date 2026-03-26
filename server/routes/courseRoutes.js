const router = require("express").Router();
const db = require("../db");

// Add course
router.post("/add", (req, res) => {
  const { title, description } = req.body;

  db.query(
    "INSERT INTO courses (title,description) VALUES (?,?)",
    [title, description],
    () => res.send("Course Added")
  );
});

// Get courses
router.get("/", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    res.json(result);
  });
});

module.exports = router;