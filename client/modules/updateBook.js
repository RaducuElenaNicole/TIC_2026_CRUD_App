// =======================
// editare (actualizare) carte -> UPDATE  
// =======================
export function initUpdateBook(API_BASE, createBookRefs, ui, uiRefs) {
  const editBookBtn = document.getElementById("editBookBtn");
  const editPanel = document.getElementById("editPanel");
  const editBookSelect = document.getElementById("editBookSelect");
  const saveEditBtn = document.getElementById("saveEditBtn");

  const statusEl = document.getElementById("status");

  let editBookId = null;
  let cachedBooks = [];

  // refuri din createBook
  const {
    openBookForm, closeBookForm, titleInput,authorInput, yearInput, pagesInput,
    } = createBookRefs;

  async function loadBooksForDropdown() {
    try {
      if (statusEl) statusEl.textContent = "Se incarca titlurile...";

      const res = await fetch(`${API_BASE}/books`);
      const books = await res.json();

      if (!res.ok) {
        if (statusEl) 
            statusEl.textContent = books.error || "Eroare la incarcarea cartilor!";
        return;
      }

      cachedBooks = Array.isArray(books) ? books : [];
      
      editBookSelect.innerHTML = `<option value="">-- Alege o carte --</option>`;

      if (cachedBooks.length === 0) {
        if (statusEl) 
            statusEl.textContent = "Nu exista carti de editat.";
        return;
      }

      cachedBooks.forEach((b) => {
        const opt = document.createElement("option");
        opt.value = b.id;
        opt.textContent = b.title || "(fara titlu)";
        editBookSelect.appendChild(opt);
      });

      statusEl.textContent = "Alege o carte din urmatoare.";
    } catch (e) {
      statusEl.textContent = "Eroare de rețea / server oprit.";
    }
  }

  // click pe butonul de editare carte
  if (editBookBtn) {
    editBookBtn.addEventListener("click", () => {
      ui.setView("edit", uiRefs);
      loadBooksForDropdown();
    });
  }

  // selectare carte din dropdown
  if (editBookSelect) {
    editBookSelect.addEventListener("change", () => {
      const id = editBookSelect.value;

      if (!id) {
        editBookId = null;
        if (saveEditBtn) 
            saveEditBtn.classList.add("hidden");
        return;
      }

      editBookId = id;

      const book = cachedBooks.find((b) => b.id === id);
      if (!book) {
        if (statusEl) 
            statusEl.textContent = "Cartea selectata nu a fost gasita.";
        return;
      }

      // prefill în formular (dupa selectarea cartii de catre user)
      titleInput.value = book.title || "";
      authorInput.value = book.author || "";
      yearInput.value = book.year ?? "";
      pagesInput.value = book.pages ?? "";

      createBookRefs.bookForm.classList.remove("hidden");
      ui.showDisplay(createBookRefs.bookForm, "grid");
      
      if (saveEditBtn) 
        ui.show(saveEditBtn); // pentru modificarea cartii => doar butonul de actualizare 

      statusEl.textContent = `Editezi: ${book.title}`;
    });
  }

  // butonul resposabil de salvarea modificarilor 
  if (saveEditBtn) {
    saveEditBtn.addEventListener("click", async () => {
      if (!editBookId) {
        if (statusEl) 
            statusEl.textContent = "EROARE! Trebuie sa alegi o carte din dropdown!";
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
        const token = localStorage.getItem("token");
        if (!token) {
              statusEl.textContent = "Nu esti logat. Fa login ca sa poti edita.";
              return;
        }

        const res = await fetch(`${API_BASE}/books/${editBookId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`},
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          if (statusEl) statusEl.textContent = data.error || "Eroare la actualizare.";
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

        ui.hideDisplay(createBookRefs.bookForm);
        createBookRefs.bookForm.classList.add("hidden");
        ui.hide(saveEditBtn);
        ui.show(uiRefs.editPanel);
        
      } catch (e) {
        statusEl.textContent = "Eroare de rețea / server oprit.";
      }
    });
  }

  return {
    loadBooksForDropdown,
  };
}