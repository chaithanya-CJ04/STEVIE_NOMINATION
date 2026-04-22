const pdf = require('pdf-parse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const indexingService = require('./indexing');

/**
 * PRODUCTION-GRADE PDF INGESTION
 * Now with 'Auto-Cleanup' to prevent empty or broken indexes.
 */
class IngestionService {
  async processPDF(buffer, filename) {
    try {
      console.log(`🚀 Starting Ingestion: ${filename}`);

      // 🛑 AUTOMATIC CLEANUP: Clear old version if it exists
      await prisma.document.deleteMany({ where: { filename } });
      console.log(`🧹 Cleared old version of ${filename}`);

      const data = await pdf(buffer);
      const text = data.text;

      // Create Document Record
      const doc = await prisma.document.create({
        data: { filename }
      });

      // Split into logical chunks (approx 500 characters)
      const rawChunks = this._chunkText(text, 500);
      const chunks = rawChunks.map((c, i) => ({
        documentId: doc.id,
        content: c,
        metadata: { page: Math.floor(i / 10) + 1, sequence: i }
      }));

      console.log(`📡 Saving ${chunks.length} chunks to Supabase...`);
      await indexingService.indexChunks(chunks);

      return { status: "SUCCESS", filename, chunks: chunks.length };
    } catch (err) {
      console.error(`❌ Ingestion failed:`, err.message);
      throw err;
    }
  }

  _chunkText(text, size) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.substring(i, i + size));
    }
    return chunks;
  }
}

module.exports = new IngestionService();
