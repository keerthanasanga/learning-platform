// REGISTER (ONLY STUDENT)
function register() {
  fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Registration successful!");
    window.location = "login.html";
  });
}

// LOGIN (AUTO ROLE DETECT)
function login() {
  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.id) {
      localStorage.setItem("user", JSON.stringify(data));

      // AUTO REDIRECT BASED ON ROLE
      if (data.role === "admin") {
        window.location = "admin.html";
      } else {
        window.location = "dashboard.html";
      }
    } else {
      alert(data.error || "Invalid login");
    }
  });
}