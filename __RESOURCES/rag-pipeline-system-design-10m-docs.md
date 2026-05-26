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
