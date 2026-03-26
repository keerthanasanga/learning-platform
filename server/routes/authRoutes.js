const router = require("express").Router();
const db = require("../db");

// REGISTER (ONLY STUDENT)
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,'student')",
    [name, email, password],
    (err) => {
      if (err) return res.json({ error: "Email already exists" });
      res.json({ message: "Registered successfully" });
    }
  );
});

// LOGIN (NO ROLE INPUT)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.json({ error: err });

      if (result.length > 0) {
        res.json(result[0]); // includes role
      } else {
        res.json({ error: "Invalid credentials" });
      }
    }
  );
});

module.exports = router;