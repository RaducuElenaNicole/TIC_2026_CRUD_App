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
router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Book created',
    book: req.body
  });
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