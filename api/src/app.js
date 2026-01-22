const express = require('express');
const cors = require('cors');
const path = require("path");

const bookRoutes = require('./routes/books');

const app = express();
const PORT = 5000;

// Middleware: log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware: Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', '..', 'client')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"));
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/books', bookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});