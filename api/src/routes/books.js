const express = require('express');
const router = express.Router();

const db = require("../db");

// GET /books  -> ia toate cartile din Firestore
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

// GET /books/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, title: 'Test Book' });
});

// POST /books
router.post("/", async (req, res) => {
  try {
    // datele pentru noua carte intrudusa de utilizator din frontend
    const { title, author, year, pages } = req.body; 

    // !year => 0 este false si daca introduc 0 la la campurile number nu e ok => trebuie == undefined
    if (!title || !author || year == undefined || pages == undefined) {
      return res.status(400).json({ error: "EROARE! Unul dintre campuri nu a fost completat!" });
    }

    // salvarea cartii introduse in bd 
    const docRef = await db.collection("books").add({
      title, author, year, pages,
      createdAt: new Date(),
    });

    const snap = await docRef.get();

    return res.status(201).json({ id: docRef.id, ...snap.data() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /books/:id
router.put('/:id', (req, res) => {
  res.json({
    message: 'Book updated',
    id: req.params.id,
    data: req.body
  });
});

// DELETE /books/:id
router.delete('/:id', (req, res) => {
  res.json({
    message: 'Book deleted',
    id: req.params.id
  });
});

module.exports = router;