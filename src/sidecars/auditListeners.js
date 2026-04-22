const recommendationEngine = require('./insights/recommendationEngine');

/**
 * PRODUCTION-READY SIDECAR LISTENERS
 */

class AuditLogger {
  async handle(event) {
    // console.log(`📄 [FORENSIC LOG] Audit result recorded for: ${event.claim.slice(0, 30)}...`);
  }
}

class ExportAssembler {
  async handle(event) {
    if (event.status === "SUPPORTED") {
      // console.log(`📦 [SIDE-CAR:EXPORTER] Evidence registered.`);
    }
  }
}

class CategorySuggester {
  async handleFullAudit(results) {
    try {
      console.log(`💡 [SIDE-CAR:INSIGHTS] Analyzing session results for potential award entries...`);
      const suggestions = await recommendationEngine.match(results);
      
      if (suggestions.length > 0) {
        console.log(`✨ [SIDE-CAR:INSIGHTS] Recommendations Generated:`);
        suggestions.forEach(s => console.log(`   - ${s.category} (Score: ${s.score})`));
      } else {
        console.log(`💡 [SIDE-CAR:INSIGHTS] No high-confidence category matches found.`);
      }
    } catch (e) {
      console.error("💡 [SIDE-CAR:INSIGHTS] Strategic analysis failed:", e.message);
    }
  }
}

module.exports = {
  AuditLogger: new AuditLogger(),
  ExportAssembler: new ExportAssembler(),
  CategorySuggester: new CategorySuggester()
};
