const router = require("express").Router();

router.get("/dashboard", (req, res) => {
  res.send("Admin Dashboard API");
});

module.exports = router;