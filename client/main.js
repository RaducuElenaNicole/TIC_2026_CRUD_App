const API_BASE = "http://localhost:5000"; 

const authSection = document.getElementById("auth-section");
const libraryPage = document.getElementById("library-page");
const msg = document.getElementById("auth-message");

function showMessage(text, isError = true) {
  if (!msg) return;
  msg.style.color = isError ? "red" : "green";
  msg.textContent = text;
}

function showLoginPage() {
  authSection.style.display = "block";
  libraryPage.style.display = "none";
}

function showLibraryPage() {
  authSection.style.display = "none";
  libraryPage.style.display = "block";
  showMessage("");
}

function saveAuth(token, email) {
  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
}

// verific daca user s-a conectat (daca e logat in app)
function boot() {
  const token = localStorage.getItem("token");
  if (token) 
    showLibraryPage(); // daca userul e conectat => se deschide pagina librariei 
  else 
    showLoginPage(); // daca userul NU e conectat => se deschide DOAR pagina pentru autentificare
}

// =======================
// authentification -> register & login
// =======================

// register
const registerBtn = document.getElementById("register-button");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    try {
      showMessage("");

      const firstName = document.getElementById("register-firstName").value.trim();
      const lastName = document.getElementById("register-lastName").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data.error ||
          (data.errors && data.errors[0] && data.errors[0].msg) ||
          "Register failed";
        showMessage(errMsg, true);
        return;
      }

      saveAuth(data.token, data.user.email);
      showMessage("Registered successfully!", false);
      showLibraryPage();
    } catch (e) {
      showMessage("Network error / server not running");
    }
  });
}

// login
const loginBtn = document.getElementById("login-button");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      showMessage("");

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data.error ||
          (data.errors && data.errors[0] && data.errors[0].msg) ||
          "Login failed";
        showMessage(errMsg, true);
        return;
      }

      saveAuth(data.token, data.user.email);
      showMessage("Logged in!", false);
      showLibraryPage();
    } catch (e) {
      showMessage("Network error / server not running");
    }
  });
}

// Logout -> buton din topbar
const logoutBtn = document.getElementById("logout-button");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearAuth();
    showMessage("Logged out!", false);
    showLoginPage();
  });
}

boot();

// =======================
// afisare carti 
// =======================
const button = document.getElementById("loadBooksBtn");
const table = document.getElementById("booksTable");
const tableBody = document.querySelector("#booksTable tbody");
const statusEl = document.getElementById("status");

function clearTable() {
  tableBody.innerHTML = "";
}

function addRow(book) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${book.title || "-"}</td>
    <td>${book.author || "-"}</td>
    <td>${book.year || "-"}</td>
    <td>${book.pages || "-"}</td>
  `;
  tableBody.appendChild(row);
}

async function loadBooks() {
  statusEl.textContent = "Se incarca...";
  clearTable();

  try {
    const response = await fetch(`${API_BASE}/books`);
    const books = await response.json();

    if (!Array.isArray(books)) {
      statusEl.textContent = "Raspuns invalid de la server.";
      return;
    }

    if (books.length === 0) {
      statusEl.textContent = "Nu exista carti.";
      table.classList.add("hidden");
      return;
    }

    books.forEach(addRow);

    table.classList.remove("hidden");
    statusEl.textContent = `Au fost incarcate ${books.length} carti.`;
  } catch (error) {
    statusEl.textContent = "Eroare la incarcarea cartilor.";
  }
}

if (button) button.addEventListener("click", loadBooks);