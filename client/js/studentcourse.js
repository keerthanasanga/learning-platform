const API = "http://localhost:5000/api/student";

const courseId = Number(localStorage.getItem("courseId"));
const user = JSON.parse(localStorage.getItem("user"));
const userId = user ? user.id : 1;
// debug log
console.log("FINAL → courseId:", courseId, "userId:", userId);

// ================= YOUTUBE EMBED HELPER =================
function getYouTubeEmbedUrl(url) {
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  // If it's already an embed URL, return as is
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Fallback: return original URL (might not work for embedding)
  return url;
}

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
      <p>${c.type === "video" ? "Video Content" : "PDF Document"}</p>
      ${
        c.type === "video"
          ? `<iframe width="400" height="250" src="${getYouTubeEmbedUrl(c.url)}" allowfullscreen></iframe>`
          : `<a href="/${c.url}" target="_blank" class="pdf-link">📄 Open PDF Document</a>`
      }
    `;

    list.appendChild(div);
  });
}

// INIT
loadContent();