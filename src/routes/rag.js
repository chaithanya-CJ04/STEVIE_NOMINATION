const express = require('express');
const multer = require('multer');
const ingestionService = require('../services/ingestion');
const retrievalService = require('../services/retrieval');
const rerankingService = require('../services/reranking');
const llmService = require('../services/llm');
const observability = require('../services/observability');
const evaluator = require('../services/evaluator');
const feedbackService = require('../services/feedbackService');

// Event-Driven Sidecars
const eventDispatcher = require('../core/events/dispatcher');
const AuditOrchestrator = require('../orchestrator/auditOrchestrator');
const { AuditLogger, ExportAssembler, CategorySuggester } = require('../sidecars/auditListeners');
const exportService = require('../sidecars/exportService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🛠️ Step 1: Initialize Orchestrator & Register Listeners
const auditor = new AuditOrchestrator(retrievalService, rerankingService, llmService);

eventDispatcher.subscribe('AuditCompleted', (data) => AuditLogger.handle(data));
eventDispatcher.subscribe('FullAuditCompleted', (data) => exportService.handleFullPackage(data));
eventDispatcher.subscribe('FullAuditCompleted', (data) => CategorySuggester.handleFullAudit(data));
eventDispatcher.subscribe('AuditCompleted', (data) => ExportAssembler.handle(data));

/**
 * Endpoint: System Health Monitor (Observability)
 */
router.get('/health', (req, res) => {
  res.json(observability.getHealthSummary());
});

/**
 * Endpoint: PRO Ingestion (With Auto-Cleanup)
 */
router.post('/ingest', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });
    const result = await ingestionService.processPDF(req.file.buffer, req.file.originalname);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ingestion failed", details: err.message });
  }
});

/**
 * Endpoint: Forensic Claim Verification (With Traceability)
 */
router.post('/verify', async (req, res) => {
  try {
    const { claim, userId } = req.body;
    if (!claim) return res.status(400).json({ error: "Claim is required" });
    const { result, evidence } = await auditor.runFullAuditTrace(claim, userId);
    res.json({ claim, audit: result, topEvidence: evidence.map(e => ({ chunkId: e.chunkId, text: e.text })) });
  } catch (err) {
    res.status(500).json({ error: "Pipeline failure", details: err.message });
  }
});

/**
 * Endpoint: Run Advanced Evaluation & Failure Analysis
 */
router.post('/evaluate', async (req, res) => {
  try {
    console.log("🚀 Initializing Strategic System Audit...");
    const report = await evaluator.runFullProductionTest();
    res.json({ message: "Forensic Audit Complete.", timestamp: new Date().toISOString(), report });
  } catch (err) {
    res.status(500).json({ error: "Audit failed", details: err.message });
  }
});

/**
 * Endpoint: Explainable Audit (Compliance Trace)
 */
router.get('/explain/:traceId', (req, res) => {
  const trace = observability.getTrace(req.params.traceId);
  if (!trace) return res.status(404).json({ error: "Audit trace not found." });
  res.json({ message: "Forensic Decision Trace Found", trace });
});

/**
 * Endpoint: Human-in-the-Loop Feedback Capture
 */
router.post('/feedback', async (req, res) => {
  try {
    const feedback = await feedbackService.captureFeedback(req.body);
    res.json({ status: "SUCCESS", message: "Intelligence signal captured", signal: feedback });
  } catch (err) {
    res.status(500).json({ error: "Failed to capture signal", details: err.message });
  }
});

/**
 * Endpoint: Strategic Learning Insights
 */
router.get('/learning', async (req, res) => {
  try {
    const metrics = await feedbackService.getMetrics();
    const insights = await feedbackService.analyzeLearningPath();
    res.json({ metrics, insights });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve insights", details: err.message });
  }
});

module.exports = router;
