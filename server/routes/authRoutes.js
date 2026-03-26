const router = require("express").Router();
const db = require("../db");

// LOGIN WITH ROLE CHECK
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=? AND role=?",
    [email, password, role],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.json({ message: "Invalid credentials" });
      }
    }
  );
});

module.exports = router;