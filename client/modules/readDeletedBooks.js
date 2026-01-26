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
    const token = localStorage.getItem("token");
    if (!token) {
        statusEl.textContent = "Nu esti logat. Fa login ca sa vezi cartile sterse.";
        return;
    }

    ui.setView("deleted", uiRefs);
    if (statusEl) statusEl.textContent = "Se încarcă cărțile șterse...";
    clearTable();

    try {
      const res = await fetch(`${API_BASE}/books/deleted`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
      });
      const books = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            statusEl.textContent = "Nu ai acces. Te rog fa login din nou.";
        } else {
            statusEl.textContent = books.error || "Eroare la încărcare.";
        }
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