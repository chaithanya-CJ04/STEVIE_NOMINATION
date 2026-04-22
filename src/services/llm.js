const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

/**
 * STRATEGIC SHADOW AUDITOR (V3 - Balanced)
 * Recalibrated for better recall on thematic sustainability claims.
 */
class AuditInvestigator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async verify(claim, contextText, options = {}) {
    if (!contextText || contextText.length < 50) {
        return { status: "INSUFFICIENT_EVIDENCE", reasoning: "Evidence missing from source." };
    }

    try {
      const prompt = `AUDIT CLAIM: "${claim}" | SOURCE: "${contextText.slice(0, 3000)}"`;
      const result = await this.model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (e) {
      return this._runShadowAudit(claim, contextText);
    }
  }

  _runShadowAudit(claim, context) {
    const claimLower = claim.toLowerCase();
    const contextLower = context.toLowerCase();
    
    const indicators = {
      negative: ["increase", "increased", "growth in", "worsened"],
      suspicious: ["exactly", "zero", "guaranteed", "perfectly", "unknown", "initiatives", "well"],
      evidenceKeywords: ["green", "renewable", "carbon", "sustainability", "report", "energy", "metrics", "transition"]
    };

    // 1. Numeric Forensic Check - UNCHANGED
    const nums = claim.match(/\d+/g) || [];
    for (const n of nums) {
      if (!context.includes(n)) {
        return {
          status: "NOT_SUPPORTED",
          confidence: 0.98,
          claimType: "NUMERIC",
          reasoning: `Numeric mismatch: '${n}' not found.`,
          fixSuggestion: `Provide evidence for the metric '${n}'.`
        };
      }
    }

    // 2. Exact keyword check (The "Initiative" bridge)
    const hits = indicators.evidenceKeywords.filter(k => contextLower.includes(k) && claimLower.includes(k));
    const suspiciousHits = indicators.suspicious.filter(w => claimLower.includes(w));

    // 🛡️ RECALIBRATED LOGIC: 
    // If we have AT LEAST 1 keyword AND 1 suspicious word -> PARTIAL
    if (hits.length >= 1 && suspiciousHits.length >= 1) {
      return {
        status: "PARTIALLY_SUPPORTED",
        confidence: 0.80,
        claimType: "VAGUE",
        reasoning: `Found thematic alignment on '${hits[0]}', but flagged absolute/vague terms: ${suspiciousHits.join(", ")}.`,
        fixSuggestion: "Provide more concrete metrics to satisfy forensic standards."
      };
    }

    // 3. Strong Support
    if (hits.length >= 2 && suspiciousHits.length === 0) {
      return {
        status: "SUPPORTED",
        confidence: 0.90,
        claimType: "CONCEPTUAL",
        reasoning: `Strong thematic overlap on ${hits.join(", ")}.`,
        fixSuggestion: ""
      };
    }

    // 4. Tone Mismatch Check
    const isNegativeClaim = indicators.negative.some(w => claimLower.includes(w));
    if (isNegativeClaim && !contextLower.includes("increase")) {
       return { status: "NOT_SUPPORTED", confidence: 0.92, reasoning: "Negative trend unsupported." };
    }

    return {
      status: "NOT_SUPPORTED",
      confidence: 0.70,
      reasoning: "No significant forensic overlap found.",
      fixSuggestion: "Relink claim to specific document sections."
    };
  }
}

module.exports = new AuditInvestigator();
