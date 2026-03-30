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
      <p>Type: ${c.type === "video" ? "YouTube Video" : "PDF Document"}</p>
      ${
        c.type === "video"
          ? `<a href="${c.url}" target="_blank" class="view-link">🎥 View Video</a>`
          : `<a href="/${c.url}" target="_blank" class="view-link">📄 View PDF</a>`
      }
      <button onclick="deleteContent(${c.id})" class="delete-btn">Delete</button>
    `;

    list.appendChild(div);
  });
}



// ================= TOGGLE CONTENT INPUT =================
function toggleContentInput() {
  const contentType = document.getElementById("contentType").value;
  const videoInput = document.getElementById("videoInput");
  const pdfInput = document.getElementById("pdfInput");

  if (contentType === "video") {
    videoInput.style.display = "block";
    pdfInput.style.display = "none";
  } else {
    videoInput.style.display = "none";
    pdfInput.style.display = "block";
  }
}

// ================= UPDATE FILE NAME DISPLAY =================
function updateFileName() {
  const fileInput = document.getElementById("pdfFile");
  const fileName = document.getElementById("fileName");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      fileInput.value = "";
      fileName.textContent = "No file selected";
      fileName.classList.remove("selected");
      return;
    }

    fileName.textContent = `${file.name} (${fileSizeMB} MB)`;
    fileName.classList.add("selected");
  } else {
    fileName.textContent = "No file selected";
    fileName.classList.remove("selected");
  }
}

//=============== add content =========================
async function addContent() {
  console.log("Clicked Add Content");

  const title = document.getElementById("contentTitle").value;
  const contentType = document.getElementById("contentType").value;

  if (!title) {
    alert("Please enter a content title");
    return;
  }

  if (contentType === "video") {
    // Handle YouTube video
    const videoUrl = document.getElementById("videoUrl").value;

    if (!videoUrl) {
      alert("Please enter a YouTube video URL");
      return;
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(videoUrl)) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    console.log({ title, url: videoUrl, type: contentType, courseId });

    await fetch(`${API}/contents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        url: videoUrl,
        type: contentType,
        course_id: courseId
      })
    });

    alert("Video content added successfully!");

    document.getElementById("contentTitle").value = "";
    document.getElementById("videoUrl").value = "";

  } else {
    // Handle PDF upload
    const pdfFile = document.getElementById("pdfFile").files[0];

    if (!pdfFile) {
      alert("Please select a PDF file");
      return;
    }

    // Validate file type
    if (pdfFile.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (pdfFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", contentType);
    formData.append("course_id", courseId);
    formData.append("pdf", pdfFile);

    try {
      // Show loading state
      const button = document.querySelector('.add-course button');
      const originalText = button.textContent;
      button.textContent = 'Uploading...';
      button.disabled = true;

      const response = await fetch(`${API}/contents/upload`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      // Reset button
      button.textContent = originalText;
      button.disabled = false;

      if (response.ok) {
        alert("PDF uploaded successfully!");
        document.getElementById("contentTitle").value = "";
        document.getElementById("pdfFile").value = "";
        updateFileName();
      } else {
        alert("Error uploading PDF: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading PDF. Please try again.");
      // Reset button on error
      const button = document.querySelector('.add-course button');
      button.textContent = 'Add Content';
      button.disabled = false;
    }
  }

  loadContent();
}

// ================= VALIDATE YOUTUBE URL =================
function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}/;
  return youtubeRegex.test(url);
}

// ================= DELETE =================
async function deleteContent(id) {
  if (!confirm("Are you sure you want to delete this content?")) {
    return;
  }

  try {
    const res = await fetch(`${API}/contents/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Content deleted successfully!");
      loadContent();
    } else {
      const error = await res.json();
      alert("Error deleting content: " + (error.message || error.error));
    }
  } catch (err) {
    console.error("Error deleting content:", err);
    alert("Network error while deleting content. Please try again.");
  }
}

// ================= BACK =================
function goBack() {
  window.location.href = "admin.html";
}

// INIT
loadContent();