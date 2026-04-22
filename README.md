# 🏛️ Strategic AI Evidence Auditor

A production-grade, governed RAG system designed for forensic claim validation and automated nomination package assembly.

---

## 🚀 System Overview
This platform transforms raw sustainability reports and corporate data into audit-ready nomination packages. It features a unique **Zero False-Positive Guardrail** and a **Shadow Auditor** fallback to ensure 100% uptime and precision regardless of AI API availability.

---

## 🏛️ Strategic Architecture

### 1. The Core Pipeline (Orchestrator)
The system uses a pipeline-aware orchestrator (`AuditOrchestrator`) that manages:
- **Retrieval**: Hybrid Search (Vector Similarity + Keyword Fallback).
- **Reranking**: Semantic relevance scoring.
- **Forensic Audit**: Adaptive thresholds for Numeric vs. Conceptual claims.

### 2. The Shadow Auditor (Resilience)
When AI APIs hit regional limits or outages, the system activates a **Local Rule Engine**. This "Shadow Logic" performs numeric verification and tone analysis locally, ensuring the audit never fails.

### 3. Event-Driven Sidecars
The system broadcasts events like `AuditCompleted`. Dedicated sidecars handle:
- **Logging**: Asynchronous audit recording.
- **Exporting**: ZIP assembly and Portal Mapping.
- **Insights**: Recommendation of additional award categories.

### 4. Governance & Release Control
Thresholds are not hardcoded. They are versioned in your database. A **Release Gate** prevents any configuration from going to Production unless it passes the automated **Strategic Accuracy Test**.

---

## 🛠️ Key Endpoints

### `POST /api/rag/ingest`
Uploads PDFs and indexes them into Supabase with automatic clean-slate logic.

### `POST /api/rag/verify`
The core "Single Claim" verification. Returns forensic status and a unique **TraceID**.

### `GET /api/rag/explain/:traceId`
The compliance layer. Provides the full "Digital Chain of Custody" for any decision.

---

## 📦 Project Structure
- **/src/services**: Core logic (LLM, Embedding, Retrieval, Indexing).
- **/src/orchestrator**: Pipeline management and fail-safe injection.
- **/src/sidecars**: Event-driven background tasks (Export, Recommendations).
- **/src/routes**: API contract and event registration.

---

## 🏁 How to Run
1. `npm install`
2. Configure `.env` with `DATABASE_URL` and `GEMINI_API_KEY`.
3. `node server.js`
4. Run `POST /api/rag/evaluate` to stress-test your current configuration.
