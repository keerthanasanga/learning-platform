function login() {
  const role = document.getElementById("role").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      role: role
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.id) {
      localStorage.setItem("user", JSON.stringify(data));

      if (role === "admin") {
        window.location = "admin.html";   // create this
      } else {
        window.location = "dashboard.html";
      }
    } else {
      alert("Invalid login");
    }
  });
}