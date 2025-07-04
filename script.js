function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  // Retrieve existing users or create an empty array
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    document.getElementById("msg").innerText = "User already registered";
    document.getElementById("msg").style.color = "red";
    return;
  }

  // Add new user
  users.push({ email, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  // Save current session info
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);

  document.getElementById("msg").innerText = "Registered successfully";
  document.getElementById("msg").style.color = "green";

  window.location.href = role === "user" ? "user-dashboard.html" : "owner-dashboard.html";
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    user => user.email === email && user.password === password && user.role === role
  );

  if (user) {
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    document.getElementById("msg").innerText = "Logged in successfully";
    document.getElementById("msg").style.color = "green";

    window.location.href = role === "user" ? "user-dashboard.html" : "owner-dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Invalid credentials";
    document.getElementById("msg").style.color = "red";
  }
}
