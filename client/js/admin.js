const API = "http://localhost:5000/api/admin";

// ================= FETCH FROM DB =================
async function loadCourses() {
  try {
    console.log("Loading courses from:", `${API}/courses`);
    const res = await fetch(`${API}/courses`);
    console.log("Load courses response status:", res.status);
    if (!res.ok) {
      console.error("Failed to load courses:", res.status);
      return;
    }
    const courses = await res.json();
    console.log("Loaded courses:", courses);

    renderCourses(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
  }
}

// ================= RENDER =================
function renderCourses(courses) {
  const container = document.getElementById("courseContainer");
  container.innerHTML = "";

  console.log("Rendering courses:", courses);

  courses.forEach((course) => {
    console.log("Rendering course:", course.id, course.title);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${course.title}</h3>

      <p>👥 Students: ${course.student_count || 0}</p>

      <button class="add-btn" onclick="openCourse(${course.id})">
        Content
      </button>

      <button class="delete-btn" onclick="deleteCourse(${course.id})">
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

// ================= ADD COURSE =================
async function addCourse() {
  const name = document.getElementById("courseName").value;

  if (!name) return alert("Enter course name");

  try {
    await fetch(`${API}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: name })
    });

    document.getElementById("courseName").value = "";
    loadCourses();
  } catch (err) {
    console.error("Error adding course:", err);
  }
}

// ================= DELETE =================
async function deleteCourse(id) {
  console.log("Delete button clicked for course:", id);
  if (!confirm("Are you sure you want to delete this course? This will also delete all associated content and unenroll all students.")) {
    return;
  }

  try {
    console.log("Sending DELETE request to:", `${API}/courses/${id}`);
    const res = await fetch(`${API}/courses/${id}`, {
      method: "DELETE"
    });
    console.log("Response status:", res.status);

    if (res.ok) {
      alert("Course deleted successfully!");
      loadCourses();
    } else {
      const error = await res.json();
      console.error("Delete error:", error);
      alert("Error deleting course: " + (error.message || error.error));
    }
  } catch (err) {
    console.error("Error deleting:", err);
    alert("Network error while deleting course. Please try again.");
  }
}

// ================= NAVIGATION =================
function openCourse(id) {
  localStorage.setItem("courseId", id); // keep this
  window.location.href = "course.html";
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ================= INIT =================
loadCourses();