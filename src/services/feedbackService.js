const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * HUMAN-IN-THE-LOOP FEEDBACK SERVICE
 * Captures user intelligence to refine adaptive thresholds and prompts.
 */
class FeedbackService {
  /**
   * Capture a new user interaction
   */
  async captureFeedback(data) {
    try {
      return await prisma.feedback.create({
        data: {
          claim: data.claim,
          aiDecision: data.aiDecision,
          aiSuggestion: data.aiSuggestion,
          userAction: data.userAction,
          userFinalText: data.userFinalText || null
        }
      });
    } catch (e) {
      console.error("⚠️ Feedback Capture Failed:", e.message);
    }
  }

  /**
   * Calculate Insight Metrics
   */
  async getMetrics() {
    const total = await prisma.feedback.count();
    if (total === 0) return { acceptanceRate: "0%", status: "INSUFFICIENT_DATA" };

    const accepted = await prisma.feedback.count({ where: { userAction: 'ACCEPT' } });
    const edited = await prisma.feedback.count({ where: { userAction: 'EDIT' } });
    const rejected = await prisma.feedback.count({ where: { userAction: 'REJECT' } });

    return {
      totalSignals: total,
      acceptanceRate: `${((accepted / total) * 100).toFixed(1)}%`,
      rejectionRate: `${((rejected / total) * 100).toFixed(1)}%`,
      editRate: `${((edited / total) * 100).toFixed(1)}%`,
      status: accepted / total > 0.8 ? "HEALTHY" : "NEEDS_TUNING"
    };
  }

  /**
   * Learning Hook: Recommends threshold adjustments based on feedback
   */
  async analyzeLearningPath() {
    const metrics = await this.getMetrics();
    if (parseFloat(metrics.rejectionRate) > 15) {
        return {
            recommendation: "REDUCE_THRESHOLD",
            reason: "High rejection rate suggests the Auditor is being too strict.",
            target: "Conceptual Threshold",
            suggestedAction: "Lower from 0.78 to 0.75"
        };
    }
    return { recommendation: "MAINTAIN", reason: "AI performance is within healthy human-aligned bounds." };
  }
}

module.exports = new FeedbackService();
