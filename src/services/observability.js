/**
 * COMPLIANCE-GRADE OBSERVABILITY ENGINE
 * Stores and retrieves exhaustive decision traces for AI reproducibility.
 */
class ObservabilityService {
  constructor() {
    this.logs = new Map(); // Using Map for O(1) trace lookups
    this.thresholds = { SLOW_RESPONSE: 5000 };
  }

  /**
   * Captures an exhaustive Audit Trace (The Chain of Custody)
   */
  logTrace(trace) {
    const traceId = `audit_trc_${Math.random().toString(36).substr(2, 9)}`;
    const entry = {
      traceId,
      timestamp: new Date().toISOString(),
      userId: trace.userId || "anonymous",
      config: trace.config, // 🛡️ CRITICAL: Stores thresholds used
      input: { claim: trace.claim },
      pipeline: {
        totalLatency: trace.stages.reduce((acc, s) => acc + s.duration, 0),
        stages: trace.stages
      },
      forensicOutcome: {
        status: trace.result.status,
        confidence: trace.result.confidence,
        reasoning: trace.result.reasoning,
        evidenceUsed: trace.result.evidenceChunks || []
      }
    };

    this.logs.set(traceId, entry);

    if (entry.pipeline.totalLatency > this.thresholds.SLOW_RESPONSE) {
      console.warn(`🚨 [HEALTH] Performance Breach at Trace: ${traceId}`);
    }

    return traceId;
  }

  /**
   * Retrieves the full "Digital Chain of Custody" for a decision
   */
  getTrace(traceId) {
    return this.logs.get(traceId) || null;
  }

  getHealthSummary() {
    return { status: "TRANSPARENT", totalTraces: this.logs.size };
  }
}

module.exports = new ObservabilityService();
