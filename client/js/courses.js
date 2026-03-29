const API_URL = 'http://localhost:3000/student';

fetch(`${API_URL}/courses`)
  .then(res => res.json())
  .then(courses => {
    const container = document.getElementById('coursesList');
    courses.forEach(c => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${c.title}</h3>
                       <p>${c.description}</p>
                       <button onclick="loadLessons(${c.id})">View Lessons</button>
                       <div id="lessons-${c.id}"></div>`;
      container.appendChild(div);
    });
  });

function loadLessons(courseId) {
  fetch(`${API_URL}/lessons/${courseId}`)
    .then(res => res.json())
    .then(lessons => {
      const container = document.getElementById(`lessons-${courseId}`);
      container.innerHTML = lessons.map(l => `
        <div>
          <h4>${l.title}</h4>
          ${l.video_url ? `<a href="${l.video_url}" target="_blank">Watch Video</a>` : ''}
          ${l.pdf_file ? `<a href="/pdfs/${l.pdf_file}" target="_blank">Download PDF</a>` : ''}
        </div>
      `).join('');
    });
}