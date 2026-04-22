const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

/**
 * FAIL-SAFE EMBEDDING SERVICE
 * Gracefully handles regional API failures by falling back to Null Vectors.
 */
class EmbeddingService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    this.model = "embedding-001";
  }

  async generateBatchEmbeddings(texts) {
    try {
      console.log(`📡 [AI:EMBED] Requesting vectors for ${texts.length} inputs...`);
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const results = await Promise.all(
        texts.map(text => model.embedContent(text).then(res => res.embedding.values))
      );
      return results;
    } catch (err) {
      console.warn(`⚠️ [AI:OFFLINE] Regional Error: ${err.message}. Generating Null-Vectors to enable Keyword Fallback.`);
      
      // Return Zero-Vectors (768 dimensions for pgvector)
      // This allows the DB insert to succeed, while Retrieval.js catches the inaccuracy.
      return texts.map(() => new Array(768).fill(0));
    }
  }
}

module.exports = new EmbeddingService();
