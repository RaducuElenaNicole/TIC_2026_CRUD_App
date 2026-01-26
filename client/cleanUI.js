// =======================
// UI VISIBILITY
// =======================

export function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
}

export function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
}

export function hideDisplay(el) {
  if (!el) return;
  el.style.display = "none";
}

export function showDisplay(el, display = "grid") {
  if (!el) return;
  el.style.display = display;
}

export function setView(mode, refs) {
  const {
    table, bookForm, editPanel, saveEditBtn, statusEl, submitAddBtn, cancelBookBtn, deletePanel, deletedBooksTable,
  } = refs;

  // ascund tot
  hide(table);
  hide(editPanel);
  hide(saveEditBtn);
  hide(bookForm);
  hideDisplay(bookForm);
  hide(deletePanel);
  hide(deletedBooksTable);


  if (statusEl) 
    statusEl.textContent = "";

  // default: butoanele de salvare si renuntare sunt vizibile
  if (submitAddBtn) 
    submitAddBtn.classList.remove("hidden");
  if (cancelBookBtn) 
    cancelBookBtn.classList.remove("hidden");

  if (mode === "list") {
    show(table);
    return;
  }

  if (mode === "add") {
    if (bookForm) {
      bookForm.reset();
      bookForm.classList.remove("hidden");
      showDisplay(bookForm, "grid");
    }
    return;
  }

  if (mode === "edit") {
    show(editPanel);
    // formularul de editare a unei carti nu contine butoanele de salvare si de renuntare 
    // cele necesare la foemularul de creare a unei carti 
    if (submitAddBtn) 
      submitAddBtn.classList.add("hidden");
    if (cancelBookBtn) 
      cancelBookBtn.classList.add("hidden");

    return;
  }

  if (mode === "delete") {
        show(deletePanel);
        return;
  }

  if (mode === "deleted") {
    show(deletedBooksTable);
    return;
  }
}