# RAG Pipeline System Design: 10M Docs, Zero Hallucination

> Source: https://x.com/adxtyahq/status/2057410759236386866
> Context: Google L5 interview system design question

**Key insight:** At 10M docs, retrieval quality matters more than the frontier model itself.

---

## The 10-Step Pipeline

### 1. Ingest + Normalize
Remove duplicates, standardize formats, extract metadata, maintain version history.

### 2. Hybrid Retrieval (BM25 + Embeddings)
BM25 handles exact keyword matching; embeddings capture semantic meaning. Semantic search alone struggles with precision at massive scale.

### 3. ANN Retrieval + Reranking
ANN (Approximate Nearest Neighbor) quickly pulls top candidate chunks from millions of docs. A reranker rescoring step then improves relevance by deeply comparing query vs. retrieved chunks.

### 4. Source Confidence Scoring
Every retrieved chunk gets scored on freshness, trust level, overlap, and retrieval consistency. Low-confidence context must never heavily influence generation.

### 5. Constrained Generation
The model is only allowed to answer using retrieved context — nothing invented outside of what was retrieved.

### 6. Citation-Backed Responses
Every major claim links back to exact chunks, documents, or timestamps.

### 7. Hallucination Fallback Layer
If retrieval confidence drops below a threshold, return: "Insufficient evidence found." Do not generate.

### 8. Continuous Evals
Run adversarial queries, retrieval recall benchmarks, and hallucination tests continuously.

### 9. Caching + Memory Layer
Cache high-frequency queries and retrieval paths. Improves latency and output consistency.

### 10. Observability Everywhere
Trace retrieval paths, chunk rankings, token attribution, and failure points.

---
further reference taken from an Upwork posting: https://www.upwork.com/freelance-jobs/apply/Senior-LLM-Engineer_~022059788885494097301/

Senior LLM Engineer — Document Extraction Pipeline (6 weeks, $25-35K fixed) Build a production pipeline that extracts structured data from 100-300 page regulated PDFs into validated Excel. Architecture is decided. 3 ground-truth examples in hand. You execute. STACK: Anthropic API (tool use, caching, async), Pydantic v2, RAG (BM25 + section routing), Document AI (you benchmark Azure DI vs Docling vs LandingAI Week 1), RAGAS, Python 3.11+ asyncio, PostgreSQL. REQUIRED: - Production Anthropic API experience (not just OpenAI) - Pydantic v2 schema-driven extraction - Page citation verification mechanisms — designed or implemented - RAG with documented BM25 vs vector tradeoff reasoning - RAGAS or equivalent eval framework PREFERRED: Regulated industry (clinical/legal/financial), 21 CFR Part 11 or SOC 2 audit trail experience. SCREENING QUESTION (required, 300 words): For document extraction where every output must cite a specific page, how do you prevent the LLM from hallucinating page numbers? Describe your validation approach. "Lower temperature" or "better prompts" answers will be filtered out. MILESTONES: 1. Week 2 — Layer 1 working, ≥95% enumeration accuracy (20%) 2. Week 4 — Full first build, ≥90% field accuracy, citation verifier live (40%) 3. Week 6 — All 3 ground-truth docs passing, RAGAS CI live, audit logs compliant, handoff complete (40%) WE PROVIDE: Architecture spec, ground truth, canonical reference, schemas, API credits, daily access to technical PO, scaffolded GitHub repo. WE EXPECT: Daily async standup, weekly demo, code reviewed before merge, docs as you build. NOT: A research project. Autonomous AI. Greenfield. A UI project. APPLY WITH: 1. Two production LLM systems shipped (with metrics) 2. Screening question answer 3. 6-week availability confirmation