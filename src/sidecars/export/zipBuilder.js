const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

/**
 * PORTAL-READY ZIP BUILDER
 */
class ZipBuilder {
  constructor() {
    this.exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(this.exportDir)) fs.mkdirSync(this.exportDir);
  }

  async buildWithPortalAssets(manifest, summary, checklist, answers, highlights) {
    try {
      const zip = new AdmZip();
      const timestamp = Date.now();

      // Folder 1: Submission Docs
      zip.addFile('submission/manifest.json', Buffer.from(manifest));
      zip.addFile('submission/executive_summary.txt', Buffer.from(summary));
      zip.addFile('submission/judge_highlights.txt', Buffer.from(highlights));

      // Folder 2: Portal Tools (Copy-Paste)
      zip.addFile('portal_copy_paste/form_fields.json', Buffer.from(answers));
      zip.addFile('portal_copy_paste/internal_checklist.txt', Buffer.from(checklist));
      
      // Folder 3: Asset Structure
      zip.addFile('evidence/', Buffer.alloc(0));

      const filename = `nomination_portal_ready_${timestamp}.zip`;
      const outputPath = path.join(this.exportDir, filename);
      zip.writeZip(outputPath);

      console.log(`📦 [ZIP-BUILDER] Portal-Ready Package assembled: ${filename}`);
      return { status: "SUCCESS", filePath: outputPath };
    } catch (err) {
      console.error(`❌ [ZIP-BUILDER] Failed:`, err.message);
      throw err;
    }
  }
}

module.exports = new ZipBuilder();
