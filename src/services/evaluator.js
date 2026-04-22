const evalDataset = require('./evalDataset');
const retrievalService = require('./retrieval');
const rerankingService = require('./reranking');
const eventDispatcher = require('../core/events/dispatcher');
const orchestrator = require('../orchestrator/auditOrchestrator');
const llmService = require('./llm');

/**
 * STRATEGIC SYSTEM QA - V2 (Sync Edition)
 */
class SystemQA {
  async runFullProductionTest() {
    console.log("\n🚀 INITIALIZING STRATEGIC SYSTEM AUDIT...");
    
    // Pass the actual services to the orchestrator factory
    const auditOrchestrator = new orchestrator(retrievalService, rerankingService, llmService);
    
    const stats = {
      total: evalDataset.length,
      correctStatus: 0,
      correctFixType: 0,
      hasSuggestion: 0,
      results: []
    };

    console.log(`🧵 Stress Testing: Launching ${stats.total} audit traces...`);

    const taskPromises = evalDataset.map(async (test) => {
      try {
        // Core Fix: Use the new unified pipeline trace
        const { result: audit } = await auditOrchestrator.runFullAuditTrace(test.claim, "QA_TEST_RUNNER");
        
        const statusPassed = audit.status === test.expected;
        if (statusPassed) stats.correctStatus++;

        const fixTypePassed = audit.fixType === test.expectedFixType;
        if (fixTypePassed) stats.correctFixType++;

        const hasFix = !!audit.fixSuggestion && audit.fixSuggestion.length > 5;
        if (hasFix) stats.hasSuggestion++;

        return { 
            claim: test.claim, 
            actual: audit.status, 
            statusPassed, 
            fixTypePassed, 
            suggestion: audit.fixSuggestion 
        };
      } catch (err) {
        console.error(`❌ Claim Failure: ${test.claim} | ${err.message}`);
        return { claim: test.claim, error: err.message, statusPassed: false };
      }
    });

    const results = await Promise.all(taskPromises);
    stats.results = results;

    const report = {
      accuracy: `${(stats.correctStatus / stats.total * 100).toFixed(2)}%`,
      suggestionQuality: {
        accuracy: `${(stats.correctFixType / stats.total * 100).toFixed(2)}%`,
        coverage: `${(stats.hasSuggestion / stats.total * 100).toFixed(2)}%`,
        issues: results.filter(r => !r.statusPassed).map(r => ({
            claim: r.claim,
            type: "ACCURACY_FAIL",
            description: `Expected ${evalDataset.find(d => d.claim === r.claim)?.expected}, but got ${r.actual}`
        }))
      }
    };

    console.log(`\n=========================================`);
    console.log(`🏁 STRATEGIC AUDIT COMPLETE`);
    console.log(`📊 STATUS ACCURACY: ${report.accuracy}`);
    console.log(`=========================================\n`);

    eventDispatcher.publish('FullAuditCompleted', results);
    return report;
  }
}

module.exports = new SystemQA();
