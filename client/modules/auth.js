// =======================
// authentication -> register & login
// =======================
export function initAuth(API_BASE) {
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

    const form = document.getElementById("bookForm");
    if (form) {
      form.style.display = "none";
      form.reset();
    }

    const booksTableVisibility = document.getElementById("booksTable");
    if (booksTableVisibility) booksTableVisibility.classList.add("hidden");

    const status = document.getElementById("status");
    if (status) status.textContent = "";

    const body = document.querySelector("#booksTable tbody");
    if (body) body.innerHTML = "";
  }

  // salvare token + email => dupa refresh, userul e logat
  function saveAuth(token, email) {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  }

  // la logout se sterge tokenul si email
  function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }

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

  // logout
  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      showMessage("Logged out!", false);
      showLoginPage();
    });
  }

  function boot() {
    const token = localStorage.getItem("token");
    if (token) {
      showLibraryPage();

      const form = document.getElementById("bookForm");
      if (form) form.classList.add("hidden");
    } else {
      showLoginPage();
    }
  }

  boot();
}