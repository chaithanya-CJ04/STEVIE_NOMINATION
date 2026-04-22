const { ManifestGenerator, SummaryGenerator } = require('./export/documentGenerators');
const portalGenerator = require('./export/portalAssetGenerator');
const zipBuilder = require('./export/zipBuilder');

/**
 * Nomination Package Sidecar - PORTAL EDITION
 */
class ExportService {
  async handleAudit(event) {
    // Real-time logging only
  }

  async handleFullPackage(results) {
    try {
      console.log(`🚀 [SIDE-CAR:EXPORTER] Building FULL Portal-Ready Package...`);
      
      const manifest = ManifestGenerator.generate(results);
      const summary = SummaryGenerator.generate(results);
      
      // New Portal-Ready Assets
      const checklist = portalGenerator.generateChecklist(results);
      const answers = portalGenerator.generatePortalAnswers(results);
      const highlights = portalGenerator.generateHighlights(results);
      
      const result = await zipBuilder.buildWithPortalAssets(
        manifest, 
        summary, 
        checklist, 
        answers, 
        highlights
      );
      
      return result;
    } catch (e) {
      console.error("📦 [SIDE-CAR:EXPORTER] Portal Package failed:", e.message);
    }
  }
}

module.exports = new ExportService();
