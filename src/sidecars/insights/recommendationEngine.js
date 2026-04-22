const categoryDatabase = require('./categoryDatabase');
const embeddingService = require('../../services/embedding');

/**
 * STRATEGIC REUSE ENGINE
 * Calculates 'Content Recycling' scores and identifying gaps for new categories.
 */
class RecommendationEngine {
  async match(auditResults) {
    const verifiedClaims = auditResults
      .filter(r => r.status === 'SUPPORTED' || r.status === 'PARTIALLY_SUPPORTED')
      .map(r => r.claim);

    if (verifiedClaims.length === 0) return [];

    const claimProfile = verifiedClaims.join('. ');
    const profileVector = await embeddingService.generateBatchEmbeddings([claimProfile]);
    
    const recommendations = [];
    for (const category of categoryDatabase) {
        const categoryVector = await embeddingService.generateBatchEmbeddings([category.intent]);
        const similarity = this._cosineSimilarity(profileVector[0], categoryVector[0]);
        
        // Calculate Content Reuse Score (0-100%)
        const overlap = this._getIntersection(verifiedClaims, category.expectedEvidence);
        const reuseScore = Math.round((overlap.length / category.expectedEvidence.length) * 100);
        
        // Identify the "Gap" (Missing Evidence for 100% excellence)
        const gaps = category.expectedEvidence.filter(e => !overlap.includes(e));

        if (similarity > 0.4 || reuseScore > 50) {
            recommendations.push({
                category: category.name,
                similarity: parseFloat(similarity.toFixed(2)),
                reusePotential: `${reuseScore}%`,
                reason: `Verified proof exists for: ${overlap.join(', ') || 'semantic profile'}`,
                nextSteps: gaps.length > 0 ? `To hit 100%, provide evidence for: ${gaps.join(', ')}` : "Ready for submission!"
            });
        }
    }

    return recommendations.sort((a, b) => b.similarity - a.similarity);
  }

  _cosineSimilarity(vecA, vecB) {
    let dot = 0, mA = 0, mB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        mA += vecA[i] * vecA[i];
        mB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(mA) * Math.sqrt(mB));
  }

  _getIntersection(claims, keywords) {
    const unified = claims.join(' ').toLowerCase();
    return keywords.filter(kw => unified.includes(kw.toLowerCase()));
  }
}

module.exports = new RecommendationEngine();
