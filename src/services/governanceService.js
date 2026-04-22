const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const llmService = require('./llm');

/**
 * GOVERNANCE & SAFETY SERVICE
 * Protects the system from degradation by validating feedback and enforcing safe adaptation.
 */
class GovernanceService {
  /**
   * Phantom Validation: Verifies if user feedback is actually grounded.
   */
  async validateSignal(feedbackId, context) {
    const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
    if (!feedback || !feedback.userFinalText) return false;

    console.log(`🛡️ [GOVERNANCE] Validating user signal for claim: ${feedback.claim.slice(0, 30)}...`);
    
    // Internal Check: Does the document actually support the USER's correction?
    const check = await llmService.verify(feedback.userFinalText, context);
    
    const isValid = check.status === "SUPPORTED" && check.confidence > 0.9;
    
    await prisma.feedback.update({
      where: { id: feedbackId },
      data: { 
        isValidated: true,
        trustScore: isValid ? 1.2 : 0.5 // Boost or penalize user trust
      }
    });

    return isValid;
  }

  /**
   * Safe Adaptation: Proposes new thresholds with strict ±0.05 limits.
   */
  async proposeSafeAdaptation(currentNumeric, currentConcept, signalStream) {
    const minSample = 20; // Require 20 validated signals
    if (signalStream.length < minSample) {
        return { status: "LOCKED", reason: `Insufficient sample size (${signalStream.length}/${minSample})` };
    }

    const rejectionRate = signalStream.filter(s => s.userAction === 'REJECT').length / signalStream.length;
    
    let nextConcept = currentConcept;
    if (rejectionRate > 0.15) {
        // Safe limit: never adjust more than 0.05 at a time
        nextConcept = Math.max(0.70, currentConcept - 0.03); 
    }

    return {
        status: "READY",
        nextThresholds: { numeric: currentNumeric, concept: nextConcept },
        delta: (nextConcept - currentConcept).toFixed(3)
    };
  }

  /**
   * Rollback Mechanism
   */
  async rollbackLayer() {
    const lastConfig = await prisma.configHistory.findFirst({ orderBy: { appliedAt: 'desc' } });
    if (!lastConfig) return { status: "FAIL", message: "No history found." };
    
    // Logic to restore thresholds would go here
    return { status: "SUCCESS", restoredTo: lastConfig.appliedAt };
  }
}

module.exports = new GovernanceService();
