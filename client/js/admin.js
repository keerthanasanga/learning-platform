const API = "http://localhost:5000/api/admin";

// ================= FETCH FROM DB =================
async function loadCourses() {
  try {
    const res = await fetch(`${API}/courses`);
    const courses = await res.json();

    renderCourses(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
  }
}

// ================= RENDER =================
function renderCourses(courses) {
  const container = document.getElementById("courseContainer");
  container.innerHTML = "";

  courses.forEach((course) => {

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
  try {
    await fetch(`${API}/courses/${id}`, {
      method: "DELETE"
    });

    loadCourses();
  } catch (err) {
    console.error("Error deleting:", err);
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