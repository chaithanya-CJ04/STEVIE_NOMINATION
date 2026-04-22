const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const evaluator = require('./evaluator');

/**
 * GATED RELEASE & CONFIG CONTROL SERVICE
 * Manages Staging, Canary, and Production deployments of AI configurations.
 */
class ReleaseService {
  /**
   * Universal Config Fetch (Context-Aware)
   */
  async getEffectiveConfig(userId = "anonymous") {
    // 1. Check for Canary Enrollment (10% Traffic)
    const isCanary = userId.length % 10 === 0; 
    
    const env = isCanary ? "CANARY" : "PRODUCTION";
    const config = await prisma.systemConfig.findFirst({
      where: { environment: env, isActive: true },
      orderBy: { version: 'desc' }
    });

    // Fallback if DB is empty or disconnected
    return config || { numericThreshold: 0.85, conceptThreshold: 0.78, version: 0 };
  }

  /**
   * The Release Gate: Promotes a STAGING config to PRODUCTION
   */
  async promoteToProduction(version) {
    console.log(`🚀 [RELEASE] Testing Version ${version} for Production Readiness...`);

    const config = await prisma.systemConfig.findUnique({ where: { version } });
    if (!config) throw new Error("Config version not found.");

    // 1. Run Gated Tests (Forensic Card)
    const report = await evaluator.runFullProductionTest();

    // 2. CHECK GATE CRITERIA
    const accuracy = parseFloat(report.accuracy);
    const hasFalsePositives = report.falsePositives > 0;

    if (accuracy < 85 || hasFalsePositives) {
      console.error(`❌ [RELEASE] Gate Rejected: Accuracy ${accuracy}% | FP Detected: ${hasFalsePositives}`);
      return { status: "REJECTED", reason: "Accuracy below threshold or False Positive found." };
    }

    // 3. APPLY PROMOTION (Atomic Transaction)
    await prisma.$transaction([
      prisma.systemConfig.updateMany({ where: { environment: "PRODUCTION" }, data: { isActive: false } }),
      prisma.systemConfig.update({ where: { version }, data: { environment: "PRODUCTION", isActive: true } })
    ]);

    return { status: "PROMOTED", version, metrics: report };
  }
}

module.exports = new ReleaseService();
