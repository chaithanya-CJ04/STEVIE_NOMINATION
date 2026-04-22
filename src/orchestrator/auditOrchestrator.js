const eventDispatcher = require('../core/events/dispatcher');
const observability = require('../services/observability');
const releaseService = require('../services/releaseService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * PRODUCTION-GRADE AUDIT ORCHESTRATOR
 * Manages the traceable pipeline from retrieval to forensic verification.
 */
class AuditOrchestrator {
  constructor(retrieval, reranking, auditor) {
    this.retrieval = retrieval;
    this.reranking = reranking;
    this.auditor = auditor;
  }

  async runFullAuditTrace(claim, userId = "anonymous") {
    const traceData = { userId, claim, stages: [] };

    // 1. Versioned Global Config
    const config = await releaseService.getEffectiveConfig(userId);
    traceData.config = config;

    // 2. Stages: Retrieval & Reranking
    const t1Start = Date.now();
    let candidates = await this.retrieval.retrieve(claim, 30);
    traceData.stages.push({ name: "RETRIEVAL", duration: Date.now() - t1Start });

    const t2Start = Date.now();
    let evidence = await this.reranking.rerank(claim, candidates);
    traceData.stages.push({ name: "RERANKING", duration: Date.now() - t2Start });

    // 3. Evidence Injection & Forensic Audit
    let contextText = evidence.map(c => c.text).join('\n\n');
    if (contextText.length < 50) {
      const backupChunks = await prisma.chunk.findMany({ take: 10 });
      contextText = backupChunks.map(c => c.content).join('\n\n');
    }

    const t3Start = Date.now();
    const result = await this.auditor.verify(claim, contextText, {
      numericThreshold: config.numericThreshold,
      conceptThreshold: config.conceptThreshold
    });
    traceData.stages.push({ name: "AUDIT", duration: Date.now() - t3Start });

    // 4. Observability & Event Broadcast
    traceData.result = result;
    const traceId = observability.logTrace(traceData);
    eventDispatcher.publish('AuditCompleted', { claim, ...result, traceId, timestamp: new Date().toISOString() });

    return { result, evidence: evidence.slice(0, 3), traceId };
  }
}

module.exports = AuditOrchestrator;
