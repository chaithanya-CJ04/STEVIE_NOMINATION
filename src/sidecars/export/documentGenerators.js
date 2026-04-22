/**
 * FORENSIC DOCUMENT GENERATORS
 * Transforms audit events into structured submission assets.
 */

class ManifestGenerator {
  generate(results) {
    return JSON.stringify({
      version: "2.0",
      generatedAt: new Date().toISOString(),
      auditSummary: {
        totalClaims: results.length,
        supported: results.filter(r => r.status === 'SUPPORTED').length,
        unsupported: results.filter(r => r.status === 'NOT_SUPPORTED').length
      },
      claims: results.map(r => ({
        claim: r.claim,
        verdict: r.status,
        reasoning: r.reasoning,
        evidenceMapping: r.evidenceChunks || [],
        flags: r.flags || []
      }))
    }, null, 2);
  }
}

class SummaryGenerator {
  generate(results) {
    const supported = results.filter(r => r.status === 'SUPPORTED').length;
    const risks = results.filter(r => r.status === 'NOT_SUPPORTED').map(r => r.claim);

    return `
=========================================
🏆 NOMINATION EXECUTIVE SUMMARY 🏆
=========================================
Generated: ${new Date().toLocaleString()}

📊 PERFORMANCE METRICS:
-----------------------------------------
Total Claims Analyzed: ${results.length}
Verified Support: ${supported}
Evidence Gaps Found: ${results.length - supported}

⚠️ KEY RISKS & CONTRADICTIONS:
-----------------------------------------
${risks.length > 0 ? risks.map(c => `- [FAILED] ${c}`).join('\n') : "None detected."}

⚖️ AUDITOR VERDICT:
-----------------------------------------
This nomination package contains forensic-grade evidence mapping.
All supported claims have been verified against the provided source assets.
=========================================
    `;
  }
}

module.exports = {
  ManifestGenerator: new ManifestGenerator(),
  SummaryGenerator: new SummaryGenerator()
};
