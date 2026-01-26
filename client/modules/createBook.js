// =======================
// adaugare carte  
// =======================
export function initCreateBook(API_BASE, ui, uiRefs) {
  const addBookBtn = document.getElementById("addBookBtn");
  const bookForm = document.getElementById("bookForm");
  const cancelBookBtn = document.getElementById("cancelBookBtn");

  const titleInput = document.getElementById("book-title");
  const authorInput = document.getElementById("book-author");
  const yearInput = document.getElementById("book-year");
  const pagesInput = document.getElementById("book-pages");

  const table = document.getElementById("booksTable");
  const statusEl = document.getElementById("status");

  function openBookForm() {
    if (!bookForm) 
        return;

    // tabelul de afisare a cartilor vreau sa apara doar la apasarea butonului => ascund tabelul
    if (table) 
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

  // asigurare ca formularul e ascuns
  closeBookForm();

  if (addBookBtn) 
    addBookBtn.addEventListener("click", ()=> {
      ui.setView("add", uiRefs);
      //openBookForm(); -> setview face 
  });

  if (cancelBookBtn) 
    cancelBookBtn.addEventListener("click", closeBookForm);

  if (bookForm) {
    bookForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (statusEl) 
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
            statusEl.textContent = "Nu esti logat. Fa login ca sa poti adauga o carte.";
            return;
        }

        const res = await fetch(`${API_BASE}/books`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          if (statusEl) 
            statusEl.textContent = data.error || "Eroare la salvarea cartii.";
          return;
        }

        //statusEl.textContent = "Cartea a fost salvata!"; // se suprascrie
        if (statusEl) {
          statusEl.innerHTML = `
            <b>Cartea a fost adaugata!</b><br/>
            Titlu: ${data.title}<br/>
            Autor: ${data.author}<br/>
            An apariție: ${data.year}<br/>
            Pagini: ${data.pages}`;
        }

        closeBookForm();

        table.classList.add("hidden");
      } catch (err) {
        if (statusEl) statusEl.textContent = "Eroare de retea / server oprit.";
      }
    });
  }

  return {
    bookForm, openBookForm, closeBookForm,
    titleInput, authorInput, yearInput, pagesInput,
    cancelBookBtn,
  };
}
