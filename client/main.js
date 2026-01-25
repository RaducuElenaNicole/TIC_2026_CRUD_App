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

  const form = document.getElementById("bookForm"); 
  if(form){
    form.style.display = "none";
    form.reset();
  }

  const booksTableVisibility = document.getElementById("booksTable");
  if(booksTableVisibility)
    booksTableVisibility.classList.add("hidden"); 

  const status = document.getElementById("status");
  if(status)
    status.textContent = "";

  const body = document.querySelector("#booksTable tbody");
  if(body)
    body.innerHTML = "";
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
  if (token) {
    showLibraryPage(); // daca userul e conectat => se deschide pagina librariei 

    const form = document.getElementById("bookForm");
    if(form)
      form.classList.add("hidden");
  }else 
    showLoginPage(); // daca userul NU e conectat => se deschide DOAR pagina pentru autentificare
}

// =======================
// authentication -> register & login
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

if (button) 
  button.addEventListener("click", () =>{
      closeBookForm();
      loadBooks();
  });

// =======================
// adaugare carte  
// =======================
// formular adaugare carte 
const addBookBtn = document.getElementById("addBookBtn");
const bookForm = document.getElementById("bookForm");
const cancelBookBtn = document.getElementById("cancelBookBtn");

function openBookForm() {
  if (!bookForm) 
    return;

  // tabelul de afisare a cartilor vreau sa apara doar la apasarea butonului => ascund tabelul 
  if(table)
    table.classList.add("hidden");

  if (statusEl) 
    statusEl.textContent = "";

  bookForm.style.display = "grid";
}

function closeBookForm() {
  if (!bookForm) return;
  //bookForm.classList.add("hidden");
  bookForm.style.display = "none";
  bookForm.reset();
}

// asigurare ca formularul de introducere a unei carti este ascuns 
closeBookForm();

if (addBookBtn) 
  addBookBtn.addEventListener("click", openBookForm);
if (cancelBookBtn) 
  cancelBookBtn.addEventListener("click", closeBookForm);

// salvare carte introdusa 
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const yearInput = document.getElementById("book-year");
const pagesInput = document.getElementById("book-pages");

if (bookForm) {
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.textContent = "";

    const payload = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      year: Number(yearInput.value),
      pages: Number(pagesInput.value),
    };

    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        statusEl.textContent = data.error || "Eroare la salvarea cartii.";
        return;
      }

      //statusEl.textContent = "Cartea a fost salvata!"; // se suprascrie
      statusEl.innerHTML = `
          <b>Cartea a fost adăugată!</b><br/>
          Titlu: ${data.title}<br/>
          Autor: ${data.author}<br/>
          An apariție: ${data.year}<br/>
          Pagini: ${data.pages}`;

      closeBookForm();

      table.classList.add("hidden");

    } catch (err) {
      statusEl.textContent = "Eroare de retea / server oprit.";
    }
  });
}

// =======================
// editare (actualizare) carte -> UPDATE  
// =======================
const editBookBtn = document.getElementById("editBookBtn");
const editPanel = document.getElementById("editPanel");
const editBookSelect = document.getElementById("editBookSelect");
const saveEditBtn = document.getElementById("saveEditBtn");
let editBookId = null;
let cachedBooks = [];

async function loadBooksForDropdown() {
  try {
    statusEl.textContent = "Se încarcă titlurile...";

    const res = await fetch(`${API_BASE}/books`);
    const books = await res.json();

    if (!res.ok) {
      statusEl.textContent = books.error || "Eroare la încărcarea cărților.";
      return;
    }

    cachedBooks = Array.isArray(books) ? books : [];

    editBookSelect.innerHTML = `<option value="">-- Alege o carte --</option>`;

    if (cachedBooks.length === 0) {
      statusEl.textContent = "Nu există cărți de editat.";
      return;
    }

    cachedBooks.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b.id;                 
      opt.textContent = b.title || "(fără titlu)";
      editBookSelect.appendChild(opt);
    });

    statusEl.textContent = "Alege o carte din urmatoare.";
  } catch (e) {
    statusEl.textContent = "Eroare de rețea / server oprit.";
  }
}

if (editBookBtn) {
  editBookBtn.addEventListener("click", () => {
    editPanel.classList.remove("hidden");
    loadBooksForDropdown();
  });
}

if (editBookSelect) {
  editBookSelect.addEventListener("change", () => {
    const id = editBookSelect.value;
    if (!id) {
      editBookId = null;
      if (saveEditBtn) saveEditBtn.classList.add("hidden");
      return;
    }

    editBookId = id;

    const book = cachedBooks.find(b => b.id === id);
    if (!book) {
      statusEl.textContent = "Cartea selectată nu a fost găsită.";
      return;
    }

    // prefill in formular (dupa selectarea cartii de user)
    titleInput.value = book.title || "";
    authorInput.value = book.author || "";
    yearInput.value = book.year ?? "";
    pagesInput.value = book.pages ?? "";

    openBookForm();

    if (saveEditBtn) 
      saveEditBtn.classList.remove("hidden");

    statusEl.textContent = `Editezi: ${book.title}`;
  });
}

if (saveEditBtn) {
  saveEditBtn.addEventListener("click", async () => {
    if (!editBookId) {
      statusEl.textContent = "Alege mai întâi o carte din dropdown.";
      return;
    }

    statusEl.textContent = "";

    const payload = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      year: Number(yearInput.value),
      pages: Number(pagesInput.value),
    };

    try {
      const res = await fetch(`${API_BASE}/books/${editBookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        statusEl.textContent = data.error || "Eroare la actualizare.";
        return;
      }

      statusEl.innerHTML = `
        <b>Cartea a fost actualizată!</b><br/>
        Titlu: ${data.title}<br/>
        Autor: ${data.author}<br/>
        An apariție: ${data.year}<br/>
        Pagini: ${data.pages}`;

      editBookSelect.value = "";
      editBookId = null;
      saveEditBtn.classList.add("hidden");
      closeBookForm();
    } catch (e) {
      statusEl.textContent = "Eroare de rețea / server oprit.";
    }
  });
}
