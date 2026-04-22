const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const embeddingService = require('./embedding');
const crypto = require('crypto');

/**
 * HIGH-PRECISION SEMANTIC INDEXER (Type-Safe Edition)
 */
class IndexingService {
  async indexChunks(chunks) {
    if (!chunks || chunks.length === 0) return;

    try {
      console.log(`🧠 Generating embeddings for ${chunks.length} chunks...`);
      const contents = chunks.map(c => c.content);
      const vectors = await embeddingService.generateBatchEmbeddings(contents);
      
      console.log(`📡 Inserting ${chunks.length} chunks into Supabase...`);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const vector = vectors[i];
        const vectorString = `[${vector.join(',')}]`;

        // 🛡️ [PRISMA BEST PRACTICE] Using Tagged Template Literals for Type Safety
        await prisma.$executeRaw`
          INSERT INTO "Chunk" (id, "documentId", content, vector, metadata)
          VALUES (
            ${crypto.randomUUID()}, 
            ${chunk.documentId}, 
            ${chunk.content}, 
            ${vectorString}::vector, 
            ${chunk.metadata || {}}::jsonb
          )
        `;
      }

      console.log(`✅ Indexing successfully completed.`);
    } catch (err) {
      console.error(`❌ Indexing error:`, err.message);
      throw err;
    }
  }
}

module.exports = new IndexingService();
