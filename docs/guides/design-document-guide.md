# Design Document Guide

Standards for technical design documents in Tokenrip.

---

## Core Principles

### 1. Architecture, Not Implementation

Design documents provide guidance on **what** to build and **why**, not how to implement it.

- Describe the problem and solution approach
- Show high-level flows and integration points
- Reference existing patterns and services
- Don't write actual TypeScript code
- Don't specify exact file paths or routes
- Don't make implementation decisions for the engineer

**Rule of Thumb:** If the engineer could implement it multiple valid ways, you're at the right abstraction level.

### 2. Pseudo-Code Over TypeScript

**BAD:**
```typescript
async createVersion(assetId: string, content: Buffer): Promise<AssetVersion> {
  const asset = await this.assetRepo.findByPublicId(assetId);
  const version = new AssetVersion(asset, content.length);
  await this.storageService.store(version.storageKey, content);
  this.em.persist(version);
}
```

**GOOD:**
```
createVersion(assetId, content):
  1. Look up asset by public ID
  2. Create new version with size metadata
  3. Store content via StorageService
  4. Persist version entity
```

### 3. Domain Methods for State Transitions

**BAD:** `asset.state = AssetState.DELETED`

**GOOD:** `asset.markDeleted()`

### 4. Business-Level Service Methods

**BAD:** `storageService.putObject(key, buffer, metadata)`

**GOOD:** `StorageService.store(storageKey, content)`

### 5. Extend Existing Modules

Before creating new modules/services/controllers, check if existing ones can be extended.

**BAD:** Create PolicyModule, PolicyController, PolicyService

**GOOD:** Add policy methods to existing AssetService, endpoints to AssetController

Create new only when: truly independent domain, would cause circular dependencies, or existing exceeds ~1000 lines.

---

## Document Structure

### 1. Problem Statement

- What problem exists?
- Why does it matter?
- 2-3 concrete scenarios with current vs desired behavior

### 2. Current Architecture

- Relevant services and entities
- Key fields/methods impacted
- Links to architecture docs

### 3. Proposed Solution

- Design principles
- State machines (if new states)
- High-level flow
- Integration points

### 4. Implementation Overview

- Pseudo-code for key flows
- Which services need new methods
- Which repositories need new queries
- Which domain methods to add

### 5. Edge Cases & Error Handling

Brief description + handling approach for each edge case. No detailed code.

### 6. Testing Strategy

**Integration Tests:** Describe end-to-end flows

- Create asset → publish version → retrieve content → verify metadata

**Edge Cases:** List scenarios to test (not test code)

- Asset with no versions → returns 404
- Concurrent version creation → sequences correctly

### 7. Future Considerations

Features explicitly NOT in scope, potential enhancements, open questions.

### 8. Implementation Checklist

High-level tasks:

- [ ] Add field to entity
- [ ] Add service method
- [ ] Add repository query
- [ ] Add controller endpoint
- [ ] Write integration tests

---

## Architecture Patterns

### Repository Pattern

Always use named repository methods, never inline queries.

**BAD:** `repository.findOne({ publicId: uuid })`

**GOOD:** `repository.findByPublicId(uuid)`

### Background Jobs

Jobs handle scheduling only. Business logic belongs in services.

```
// Job
async doJob() {
  if (!this.enabled) return
  await this.service.processBusinessLogic()  // Delegate
}
```

### Agent-First

Content must be server-rendered. Never rely on client-side JavaScript for content that agents need to access. See `docs/architecture/agent-first.md`.

---

## Common Pitfalls

1. **Writing implementation code** — Use pseudo-code
2. **Calling private methods** — Use business-level APIs
3. **Direct field manipulation** — Use domain methods
4. **Including logging statements** — Engineer adds logging
5. **Writing detailed test code** — List scenarios only
6. **Creating unnecessary modules** — Extend existing first
7. **Specifying exact file paths** — Let implementor decide
8. **Over-specifying edge cases** — Brief description + approach

---

## Review Checklist

### Abstraction Level

- [ ] Engineer could implement multiple valid ways?
- [ ] Pseudo-code instead of TypeScript?
- [ ] Architectural guidance, not prescriptive?

### Domain-Driven Design

- [ ] Domain methods for state transitions?
- [ ] No direct field manipulation?
- [ ] Business-level service methods?

### Code Organization

- [ ] No exact file paths specified?
- [ ] Extended existing modules/services?
- [ ] Followed repository pattern?

### Completeness

- [ ] Problem statement with scenarios?
- [ ] Integration points documented?
- [ ] Edge cases at right level?
- [ ] Test scenarios defined?
