const API = "http://localhost:5000/api/admin";
const courseId = localStorage.getItem("courseId");

// ================= LOAD CONTENT =================
async function loadContent() {
  const res = await fetch(`${API}/contents/${courseId}`);
  const data = await res.json();

  renderContent(data);
}

// ================= RENDER =================
function renderContent(contents) {
  const list = document.getElementById("contentList");
  list.innerHTML = "";

  if (!contents || contents.length === 0) {
    list.innerHTML = "<p>No content added yet</p>";
    return;
  }

  contents.forEach((c) => {
    const div = document.createElement("div");
    div.className = "content-card";

    div.innerHTML = `
      <h3>${c.title}</h3>
      <p>Type: ${c.type}</p>
      <a href="${c.url}" target="_blank">📂 Open</a>
      <button onclick="deleteContent(${c.id})">Delete</button>
    `;

    list.appendChild(div);
  });
}



//=============== add content =========================
async function addContent() {
  console.log("Clicked Add Content"); // 🔍

  const title = document.getElementById("contentTitle").value;
  const url = document.getElementById("contentLink").value;
  const type = document.getElementById("type").value;

  if (!title || !url) {
    alert("Fill all fields");
    return;
  }

  console.log({ title, url, type, courseId }); // 🔍 check values

  await fetch(`${API}/contents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      url,
      type,
      course_id: courseId
    })
  });

  alert("Content Added!");

  document.getElementById("contentTitle").value = "";
  document.getElementById("contentLink").value = "";

  loadContent();
}

// ================= DELETE =================
async function deleteContent(id) {
  await fetch(`${API}/contents/${id}`, {
    method: "DELETE"
  });

  loadContent();

}

// ================= BACK =================
function goBack() {
  window.location.href = "admin.html";
}

// INIT
loadContent();