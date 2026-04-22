require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ragRouter = require('./src/routes/rag');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Main RAG Endpoint
app.use('/api/rag', ragRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: "up", system: "Full-RAG-Pipeline" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`
🚀 RAG System is running!
📅 Server started at: ${new Date().toLocaleString()}
🔌 Endpoint: http://localhost:${PORT}/api/rag

Workflow:
1. POST /api/rag/ingest (form-data: pdf)
2. POST /api/rag/ask    (json: { query: "..." })
  `);
});
