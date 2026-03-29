const API = "http://localhost:5000/api/student";

const courseId = Number(localStorage.getItem("courseId"));
const user = JSON.parse(localStorage.getItem("user"));
const userId = user ? user.id : 1;
// debug log
console.log("FINAL → courseId:", courseId, "userId:", userId);

// ================= LOAD CONTENT =================
async function loadContent() {
  console.log("Course ID:", courseId);
  console.log("User ID:", userId);

  const res = await fetch(
    `${API}/course-content/${courseId}?userId=${userId}`
  );

  const data = await res.json();
  console.log("Response:", data);

  renderContent(data);
}

// ================= RENDER =================
function renderContent(contents) {
  const list = document.getElementById("contentList");
  list.innerHTML = "";

if (contents.error === "NOT_ENROLLED") {
  list.innerHTML = "<p>You are not enrolled in this course ❌</p>";
  return;
}

if (!contents || contents.length === 0) {
  list.innerHTML = "<p>No content available</p>";
  return;
}

  contents.forEach((c) => {
    const div = document.createElement("div");
    div.className = "content-card";

    div.innerHTML = `
      <h3>${c.title}</h3>
      <p>${c.type}</p>
      ${
        c.type === "video"
          ? `<iframe width="400" height="250" src="${c.url}" allowfullscreen></iframe>`
          : `<a href="${c.url}" target="_blank">📄 Open PDF</a>`
      }
    `;

    list.appendChild(div);
  });
}

// INIT
loadContent();