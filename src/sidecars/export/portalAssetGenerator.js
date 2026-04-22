/**
 * PORTAL-READY DOCUMENT GENERATORS
 * Generates final submission assets including answers, highlights, and checklists.
 */

class PortalAssetGenerator {
  /**
   * Generates a Reviewer Checklist based on Audit Gaps
   */
  generateChecklist(results) {
    const gaps = results.filter(r => r.status !== 'SUPPORTED');
    return `
✅ INTERNAL REVIEW CHECKLIST
-----------------------------------------
[ ] Verify Summary Narrative
[ ] Confirm Page Numbers in Manifest
[ ] Address the Following Gaps:
${gaps.map(g => `   - [ ] RESOLVE: ${g.claim} (${g.status})`).join('\n')}

[ ] Executive Approval Completed
    `;
  }

  /**
   * Generates copy-paste ready answers for portal fields
   */
  generatePortalAnswers(results) {
    return JSON.stringify({
      field_executive_summary: "Generated from verified forensic metrics...",
      field_key_achievements: results
        .filter(r => r.status === 'SUPPORTED')
        .map(r => r.claim)
        .slice(0, 3),
      field_evidence_links: results
        .map(r => `Claim: ${r.claim} | Page: ${r.metadata?.page || 'N/A'}`)
    }, null, 2);
  }

  /**
   * Generates short, punchy highlights for judges
   */
  generateHighlights(results) {
    return results
      .filter(r => r.status === 'SUPPORTED')
      .map(r => `🚩 PROVEN: ${r.claim}`)
      .join('\n');
  }
}

module.exports = new PortalAssetGenerator();
