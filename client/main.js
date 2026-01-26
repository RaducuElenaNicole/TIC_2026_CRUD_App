const API_BASE = "http://localhost:5000";

import { hide, show, setView, hideDisplay, showDisplay } from "./cleanUI.js";

import { initAuth } from "./modules/auth.js";
import { initReadBooks } from "./modules/readBooks.js";
import { initCreateBook } from "./modules/createBook.js";
import { initUpdateBook } from "./modules/updateBook.js";
import { initDeleteBook } from "./modules/deleteBook.js";
import { initReadDeletedBooks } from "./modules/readDeletedBooks.js";

initAuth(API_BASE);

const table = document.getElementById("booksTable");
const bookForm = document.getElementById("bookForm");
const editPanel = document.getElementById("editPanel");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelBookBtn = document.getElementById("cancelBookBtn");
const statusEl = document.getElementById("status");
const deletePanel = document.getElementById("deletePanel");
const deletedBooksTable = document.getElementById("deletedBooksTable");

const submitAddBtn = bookForm ? bookForm.querySelector('button[type="submit"]') : null;

const ui = { hide, show, setView, hideDisplay, showDisplay };

const uiRefs = {
  table, bookForm, editPanel, saveEditBtn, statusEl, submitAddBtn, cancelBookBtn, deletePanel, deletedBooksTable};

const readBooks = initReadBooks(API_BASE, ui, uiRefs);
const createBook = initCreateBook(API_BASE, ui, uiRefs);
const updateBook = initUpdateBook(API_BASE, createBook, ui, uiRefs);
const deletedBook = initDeleteBook(API_BASE, ui, uiRefs);
const deletedBooks = initReadDeletedBooks(API_BASE, ui, uiRefs);