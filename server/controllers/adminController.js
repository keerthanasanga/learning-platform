const db = require("../db");

// Stats
exports.getStats = async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) AS count FROM users");
    const [courses] = await db.query("SELECT COUNT(*) AS count FROM courses");
    const [enrollments] = await db.query("SELECT COUNT(*) AS count FROM enrollments");
    res.json({
      users: users[0].count,
      courses: courses[0].count,
      enrollments: enrollments[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const [courses] = await db.query("SELECT * FROM courses ORDER BY created_at DESC");
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// Add course with files
exports.addCourse = async (req, res) => {
  const { title, description } = req.body;
  const pdfs = req.files["pdfs"] || [];
  const videos = req.files["videos"] || [];

  try {
    const [result] = await db.query(
      "INSERT INTO courses (title, description) VALUES (?, ?)",
      [title, description]
    );
    const courseId = result.insertId;

    const files = [...pdfs, ...videos];
    for (const file of files) {
      const type = file.mimetype === "application/pdf" ? "pdf" : "video";
      await db.query(
        "INSERT INTO course_files (course_id, file_path, file_type) VALUES (?, ?, ?)",
        [courseId, file.path, type]
      );
    }

    res.json({ message: "Course added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding course" });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM courses WHERE id = ?", [id]);
    res.json({ message: "Course deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting course" });
  }
};
