const embeddingService = require('./embedding');

/**
 * STRATEGIC RE-RANKER (Fail-Safe Edition)
 */
class RerankingService {
  async rerank(query, candidates) {
    if (!candidates || candidates.length === 0) return [];

    try {
      console.log(`🎯 [RERANK] Evaluating ${candidates.length} candidates...`);
      
      const queryVector = await embeddingService.generateBatchEmbeddings([query]);
      
      // 🛡️ [GUARD] If API returned Null-Vectors, do NOT filter.
      // This allows keyword results to pass through at 100% confidence.
      const isNullVector = queryVector[0].every(v => v === 0);
      if (isNullVector) {
        console.log("🔦 [RERANK:PASSTHROUGH] AI Offline. Using raw keyword relevance.");
        return candidates.slice(0, 5); 
      }

      const scored = candidates.map(c => {
        const score = this._cosineSimilarity(queryVector[0], c.vector);
        return { ...c, score };
      });

      return scored
        .filter(c => c.score > 0.15) // Lower threshold for better recall
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    } catch (err) {
      console.warn("⚠️ Re-ranking failed. Using top candidates as-is.");
      return candidates.slice(0, 5);
    }
  }

  _cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    let dot = 0, mA = 0, mB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        mA += vecA[i] * vecA[i];
        mB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(mA) * Math.sqrt(mB)) || 0;
  }
}

module.exports = new RerankingService();
