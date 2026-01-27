const express = require('express');
const router = express.Router();

const db = require("../db");

const { validateToken } = require("../middleware/validateToken");

// GET /books  -> ia toate cartile din Firestore - ruta pt afisarea cartilor 
// ruta publica, neprotejata
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('books').get();

    const books = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /books/deleted -> ruta pentru afisarea cartilor sterse 
// -> cartile sterse se vor muta din colectia books in colectia deleted_books
router.get("/deleted", validateToken, async (req, res) => {
  try {
    const snapshot = await db.collection("deleted_books").orderBy("deletedAt", "desc").get();

    const books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(books);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /books/:id
// ruta publica 
router.get("/:id", async (req, res) => {
  try {
    const ref = db.collection("books").doc(req.params.id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Cartea nu exista" });
    }
    return res.json({ id: snap.id, ...snap.data() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /books
// ruta pt adaugarea unei carti 
router.post("/", validateToken, async (req, res) => {
  try {
    // datele pentru noua carte intrudusa de utilizator din frontend
    const { title, author, year, pages } = req.body; 

    // !year => 0 este false si daca introduc 0 la la campurile number nu e ok => trebuie == undefined
    if (!title || !author || year == undefined || pages == undefined) {
      return res.status(400).json({ error: "EROARE! Unul dintre campuri nu a fost completat!" });
    }

    const userId = req.user.userId;

    // salvarea cartii introduse in bd 
    // docRef -> referinta catre documentul creat in Firestore 
    const docRef = await db.collection("books").add({
      title, author, year, pages,
      createdAt: new Date(),
      createdBy: userId,
    });

    // citesc documentul; snap = DocumentSnapshot
    const snap = await docRef.get();

    return res.status(201).json({ id: docRef.id, ...snap.data() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /books/:id
router.put("/:id", validateToken, async (req, res) => {
  try {
    const { title, author, year, pages } = req.body;

    if (!title || !author || year == undefined || pages == undefined) {
      return res.status(400).json({ error: "EROARE! Unul dintre campuri nu a fost completat!" });
    }

    //referinta catre documentul din firestore care trebuie sa fie modificat 
    const ref = db.collection("books").doc(req.params.id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Cartea nu exista" });
    }

    await ref.update({
      title, author, year, pages, updatedAt: new Date(),
    });

    const updated = await ref.get();
    return res.json({ id: updated.id, ...updated.data() });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /books/:id
// ruta pentru stergerea si mutarea cartii 
router.delete("/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const bookRef = db.collection("books").doc(id);
    const snap = await bookRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Cartea nu exista." });
    }

    // pastrez datele cartii care urmeaza sa fie stearsa 
    const bookData = snap.data();

    // cartea stearsa se muta in colectia deleted_books
    await db.collection("deleted_books").add({
      ...bookData,
      deletedAt: new Date(),
      deletedBy: req.user.userId,
    });

    await bookRef.delete();

    return res.json({
      message: "Cartea a fost stearsa cu succes.",
      book: { id, ...bookData },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;