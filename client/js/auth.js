// ================= REGISTER =================
function register() {
  fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim()
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Register response:", data);

    if (data.message) {
      alert(data.message);
      window.location.href = "login.html";
    } else {
      alert(data.error || "Registration failed");
    }
  })
  .catch(err => {
    console.error("Register error:", err);
    alert("Server error");
  });
}


// ================= LOGIN =================
function login(e) {
  e.preventDefault();

  console.log("🔥 Login clicked");

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim()
    })
  })
  .then(async res => {
    console.log("Status:", res.status);

    // Handle non-JSON safely
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ Not JSON response:", text);
      throw new Error("Invalid server response");
    }
  })
  .then(data => {
    console.log("Login response:", data);

    if (data && data.role) {

      // Save user
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } else {
      alert(data.error || "Invalid login credentials");
    }
  })
  .catch(err => {
    console.error("❌ Login error:", err);
    alert("Server error or API not found");
  });
}