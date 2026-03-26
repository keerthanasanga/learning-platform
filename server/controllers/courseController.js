
exports.addCourse = (req, res) => {
    const { title, description } = req.body;

    db.query(
        "INSERT INTO courses (title, description) VALUES (?, ?)",
        [title, description],
        (err) => {
            if (err) return res.json({ message: "Error" });
            res.json({ message: "Course added" });
        }
    );
};

exports.getCourses = (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        res.json(result);
    });
};