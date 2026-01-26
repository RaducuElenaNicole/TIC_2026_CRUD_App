// =======================
// stergere carte 
// =======================
export function initDeleteBook(API_BASE, ui, uiRefs) {
  const deleteBookBtn = document.getElementById("deleteBookBtn");
  const deletePanel = document.getElementById("deletePanel");
  const deleteBookSelect = document.getElementById("deleteBookSelect");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const statusEl = document.getElementById("status");

  let cachedBooks = [];
  let selectedBook = null;

  async function loadBooksForDelete() {
    try {
      statusEl.textContent = "Se încarcă cărțile...";

      const res = await fetch(`${API_BASE}/books`);
      const books = await res.json();

      if (!res.ok) {
        statusEl.textContent = books.error || "Eroare la încărcare.";
        return;
      }

      cachedBooks = books;

      deleteBookSelect.innerHTML = `<option value="">-- Alege o carte de șters --</option>`;

      books.forEach((b) => {
        const opt = document.createElement("option");
        opt.value = b.id;
        opt.textContent = b.title;
        deleteBookSelect.appendChild(opt);
      });

      statusEl.textContent = "";
    } catch {
      statusEl.textContent = "Eroare de rețea.";
    }
  }

  // apasarea butonul de stergere a cartii selectate 
  if (deleteBookBtn) {
    deleteBookBtn.addEventListener("click", () => {
      ui.setView("delete", uiRefs);
      confirmDeleteBtn.classList.add("hidden");
      selectedBook = null;
      loadBooksForDelete();
    });
  }

  // selectare carte
  if (deleteBookSelect) {
    deleteBookSelect.addEventListener("change", () => {
      const id = deleteBookSelect.value;

      if (!id) {
        confirmDeleteBtn.classList.add("hidden");
        selectedBook = null;
        return;
      }

      selectedBook = cachedBooks.find((b) => b.id === id);
      confirmDeleteBtn.classList.remove("hidden");
    });
  }

  // confirmare stergere
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (!selectedBook) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
            statusEl.textContent = "Nu esti logat. Fa login ca sa poti sterge.";
            return;
        }

        const res = await fetch(
          `${API_BASE}/books/${selectedBook.id}`, {
            method: "DELETE", 
            headers: {
                "Authorization": `Bearer ${token}`,
            },
           });

        const data = await res.json();

        if (!res.ok) {
          statusEl.textContent = data.error || "Eroare la ștergere.";
          return;
        }

        const deleted = selectedBook;

        confirmDeleteBtn.classList.add("hidden");
        deleteBookSelect.value = "";
        selectedBook = null;

        await loadBooksForDelete(); // reincarcare dropdown cu cartile ramase (cele care ar putea sa mai fie sterse)

        statusEl.innerHTML = `
          <b>Cartea a fost ștearsă cu succes!</b><br/>
          Titlu: ${deleted.title}<br/>
          Autor: ${deleted.author}<br/>
          An: ${deleted.year}<br/>
          Pagini: ${deleted.pages}`;
      } catch {
        statusEl.textContent = "Eroare de rețea.";
      }
    });
  }
}