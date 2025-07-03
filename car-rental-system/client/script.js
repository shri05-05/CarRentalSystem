const API_BASE = "http://localhost:5000/api/auth"; // adjust if needed

async function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await res.json();
  document.getElementById("msg").innerText = data.message || "Registered";

  if (res.ok) {
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    window.location.href = role === "user" ? "user-dashboard.html" : "owner-dashboard.html";
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await res.json();
  document.getElementById("msg").innerText = data.message || "Logged in";

  if (res.ok) {
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    window.location.href = role === "user" ? "user-dashboard.html" : "owner-dashboard.html";
  } else {
    document.getElementById("msg").style.color = "red";
  }
}
