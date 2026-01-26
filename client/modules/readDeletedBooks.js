// =======================
// afisare carti sterse 
// =======================
export function initReadDeletedBooks(API_BASE, ui, uiRefs) {
  const loadDeletedBooksBtn = document.getElementById("loadDeletedBooksBtn");
  const deletedTable = document.getElementById("deletedBooksTable");
  const deletedTbody = document.querySelector("#deletedBooksTable tbody");
  const statusEl = document.getElementById("status");

  function clearTable() {
    if (deletedTbody) deletedTbody.innerHTML = "";
  }

  function addRow(book) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${book.title || "-"}</td>
      <td>${book.author || "-"}</td>
      <td>${book.year ?? "-"}</td>
      <td>${book.pages ?? "-"}</td>`;
      
    deletedTbody.appendChild(tr);
  }

  async function loadDeletedBooks() {
    ui.setView("deleted", uiRefs);
    if (statusEl) statusEl.textContent = "Se încarcă cărțile șterse...";
    clearTable();

    try {
      const res = await fetch(`${API_BASE}/books/deleted`);
      const books = await res.json();

      if (!res.ok) {
        if (statusEl) statusEl.textContent = books.error || "Eroare la încărcare.";
        return;
      }

      if (!Array.isArray(books) || books.length === 0) {
        if (statusEl) statusEl.textContent = "Nu există cărți șterse.";
        return;
      }

      books.forEach(addRow);

      statusEl.textContent = `Au fost încărcate ${books.length} cărți șterse.`;
    } catch {
      statusEl.textContent = "Eroare de rețea / server oprit.";
    }
  }

  if (loadDeletedBooksBtn) {
    loadDeletedBooksBtn.addEventListener("click", loadDeletedBooks);
  }
}