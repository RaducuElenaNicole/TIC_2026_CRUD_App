const express = require('express');
const cors = require('cors');
const path = require("path");

const bookRoutes = require('./routes/books');
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 5000;

// Middleware: log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware: Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());// permite citirea JSON din req.body

const CLIENT_DIR = path.resolve(__dirname, "../../client");
app.use(express.static(CLIENT_DIR));
app.get("/", (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, "index.html"));
});

// ruta test API 
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/books', bookRoutes);
app.use("/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});