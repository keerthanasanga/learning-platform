const API = "http://localhost:5000/api/student";
const user = JSON.parse(localStorage.getItem("user"));
const userId = user ? user.id : 1;

// ================= LOAD DATA =================
async function loadData() {
  const [allRes, myRes] = await Promise.all([
    fetch(`${API}/courses`),
    fetch(`${API}/my-courses/${userId}`)
  ]);

  const allCourses = await allRes.json();
  const myCourses = await myRes.json();

  renderCourses(allCourses, myCourses);
  renderMyCourses(myCourses);
  updateStats(allCourses, myCourses);
}

// ================= RENDER ALL COURSES =================
function renderCourses(allCourses, myCourses) {
  const container = document.getElementById("courseList");
  container.innerHTML = "";

  const enrolledIds = myCourses.map(c => c.id);

  allCourses.forEach(course => {
    const isEnrolled = enrolledIds.includes(course.id);

    const div = document.createElement("div");
    div.className = "course";

    div.innerHTML = `
      <h3>${course.title}</h3>
      ${
        isEnrolled
          ? `<button class="enrolled" disabled>Enrolled ✅</button>`
          : `<button class="enroll" onclick="enroll(${course.id})">Enroll</button>`
      }
    `;

    container.appendChild(div);
  });
}

// ================= RENDER MY COURSES =================
function renderMyCourses(courses) {
  const container = document.getElementById("myCourses");

  // 🔥 Add Back Button at top
  container.innerHTML = `
    <button class="back-btn" onclick="showAllCourses()">← Back to All Courses</button>
    <h2>My Courses</h2>
  `;

  if (courses.length === 0) {
    container.innerHTML += "<p>No enrolled courses</p>";
    return;
  }

  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course";

    div.innerHTML = `
      <h3>${course.title}</h3>
      <button class="view" onclick="openCourse(${course.id})">View</button>
    `;

    container.appendChild(div);
  });
}

// ================= ENROLL =================
async function enroll(courseId) {
  await fetch(`${API}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, course_id: courseId })
  });

  loadData();
}

// ================= TOGGLE VIEW =================
function showMyCourses() {
  document.getElementById("courseList").classList.add("hidden");
  document.getElementById("myCourses").classList.remove("hidden");
}



// =================show all courses =================
function showAllCourses() {
  document.getElementById("courseList").classList.remove("hidden");
  document.getElementById("myCourses").classList.add("hidden");
}

// ================= OPEN COURSE =================
function openCourse(id) {
  console.log("Opening course:", id); // 🔍 ADD THIS
  localStorage.setItem("courseId", id);
  window.location.href = "studentcourse.html";
}

// ================= STATS =================
function updateStats(all, my) {
  document.getElementById("totalCourses").innerText = all.length;
  document.getElementById("enrolledCount").innerText = my.length;
  document.getElementById("availableCount").innerText = all.length - my.length;
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// INIT
loadData();