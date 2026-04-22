const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const embeddingService = require('./embedding');

/**
 * TYPE-SAFE HYBRID RETRIEVAL (Production Edition)
 */
class RetrievalService {
  async retrieve(query, limit = 30) {
    try {
      const queryVector = await embeddingService.generateBatchEmbeddings([query]);
      const isNullVector = queryVector[0].every(v => v === 0);

      if (!isNullVector) {
        const vectorString = `[${queryVector[0].join(',')}]`;
        const results = await prisma.$queryRaw`
          SELECT id, content as text, metadata, (vector <=> ${vectorString}::vector) as distance 
          FROM "Chunk" 
          ORDER BY distance ASC 
          LIMIT ${limit}
        `;
        if (results && results.length > 0) return results;
      }
    } catch (err) {
      // Silent fail to trigger keyword fallback
    }

    // 2. Keyword Fallback
    const tokens = query.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(t => t.length > 3);
    const keywordResults = await prisma.chunk.findMany({
      where: { OR: tokens.map(token => ({ content: { contains: token, mode: 'insensitive' } })) },
      take: limit
    });

    if (keywordResults.length > 0) return keywordResults.map(r => ({ ...r, text: r.content }));

    // 3. Global Fail-Safe
    const generalContext = await prisma.chunk.findMany({ take: 5, orderBy: { id: 'desc' } });
    return generalContext.map(r => ({ ...r, text: r.content }));
  }
}

module.exports = new RetrievalService();
