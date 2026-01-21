const express = require('express');
const cors = require('cors');

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

// Ruta de test (FOARTE IMPORTANTĂ)
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});