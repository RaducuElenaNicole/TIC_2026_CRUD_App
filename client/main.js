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
    const response = await fetch("/books");
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

button.addEventListener("click", loadBooks);