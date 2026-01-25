// =======================
// afisare carti 
// =======================
export function initReadBooks(API_BASE, ui, uiRefs) {
  const button = document.getElementById("loadBooksBtn");
  const table = document.getElementById("booksTable");
  const tableBody = document.querySelector("#booksTable tbody");
  const statusEl = document.getElementById("status");

  function clearTable() {
    if (tableBody) 
        tableBody.innerHTML = "";
  }

  function addRow(book) {
    if (!tableBody) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title || "-"}</td>
      <td>${book.author || "-"}</td>
      <td>${book.year || "-"}</td>
      <td>${book.pages || "-"}</td>`;
    tableBody.appendChild(row);
  }

  async function loadBooks() {
    if (statusEl) statusEl.textContent = "Se incarca...";
    clearTable();

    try {
      const response = await fetch(`${API_BASE}/books`);
      const books = await response.json();

      if (!Array.isArray(books)) {
        if (statusEl) statusEl.textContent = "Raspuns invalid de la server.";
        return;
      }

      if (books.length === 0) {
        statusEl.textContent = "Nu exista carti.";
        table.classList.add("hidden");
        return;
      }

      books.forEach(addRow);

      if (table) 
        table.classList.remove("hidden");

      if (statusEl) 
        statusEl.textContent = `Au fost incarcate ${books.length} carti.`;
    } catch (error) {
      if (statusEl) statusEl.textContent = "Eroare la incarcarea cartilor.";
    }
  }

  if (button) {
    button.addEventListener("click", () => {
      ui.setView("list", uiRefs);
      loadBooks();
    });
  }

  // returnam ce e util pentru celelalte module (create/update)
  return {
    table, tableBody,statusEl, addRow, clearTable, loadBooks,};
}
