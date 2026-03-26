const API = "http://localhost:5000/api";

// 🔓 Logout
function logout() {
    localStorage.removeItem("user");
    window.location = "login.html";
}

// ➕ Add Course
function addCourse() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;

    fetch(`${API}/courses/add`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ title, description })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadCourses();
    });
}

// 📚 Load Courses
function loadCourses() {
    fetch(`${API}/courses`)
    .then(res => res.json())
    .then(data => {
        let output = "";
        data.forEach(c => {
            output += `<p>${c.id} - ${c.title}</p>`;
        });
        document.getElementById("courses").innerHTML = output;
    });
}

// 🎥 Upload Video
function uploadVideo() {
    let file = document.getElementById("video").files[0];
    let courseId = document.getElementById("courseId").value;

    let formData = new FormData();
    formData.append("video", file);
    formData.append("courseId", courseId);

    fetch(`${API}/admin/upload-video`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

// 📄 Upload PDF
function uploadPDF() {
    let file = document.getElementById("pdf").files[0];
    let courseId = document.getElementById("courseIdPdf").value;

    let formData = new FormData();
    formData.append("pdf", file);
    formData.append("courseId", courseId);

    fetch(`${API}/admin/upload-pdf`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

// auto load courses
loadCourses();