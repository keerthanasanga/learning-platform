function loadCourses() {
  fetch("http://localhost:5000/api/courses")
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach(c => {
        html += `<p>${c.title}</p>`;
      });
      document.getElementById("courses").innerHTML = html;
    });
}