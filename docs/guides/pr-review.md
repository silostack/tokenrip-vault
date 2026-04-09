# Pull Request Review Guide

A systematic approach to reviewing pull requests for Tokenrip.

## Quick Checklist

- [ ] Follows [coding-patterns.md](./coding-patterns.md) (domain methods, repositories, services)
- [ ] Tests included — follow [testing.md](../operations/testing.md) patterns
- [ ] Database migrations for schema changes
- [ ] No security issues (SQL injection, XSS, missing auth)
- [ ] No N+1 queries or performance problems
- [ ] Agent-first compliance — content server-rendered, no JS-only access
- [ ] Type safety — no `any`, no inline object types

---

## Critical Patterns to Verify

### 1. Domain Methods for State Transitions

```typescript
// CORRECT
asset.markDeleted();
thread.resolve(resolution);

// WRONG
asset.state = AssetState.DELETED;
thread.resolved = true;
```

**Why:** Domain methods encapsulate business logic and maintain invariants.

---

### 2. Repository Pattern — Named Methods Only

```typescript
// CORRECT
await this.assetRepo.findByPublicId(uuid);
await this.threadRepo.findByParticipant(agentId);

// WRONG
await this.assetRepo.findOne({ publicId: uuid });
await this.threadRepo.find({ participants: { agent: { id: agentId } } });
```

**Why:** Query logic belongs in repositories. Applies to ALL code including tests.

---

### 3. MikroORM Transaction Context

**Rule 1: Use passed `em` in callbacks**
```typescript
await this.em.transactional(async (em) => {
  em.persist(entity);  // Use passed em
});
```

**Rule 2: Pass `em` to private helpers**
```typescript
await this.em.transactional(async (em) => {
  await this.privateHelper(em, data);
});
```

**Rule 3: DON'T pass `em` to @Transactional methods**
```typescript
await this.em.transactional(async (em) => {
  await this.assetService.createVersion(assetId, content);  // Don't pass em
});
```

**Reference:** [MikroORM Transactions](../architecture/mikroorm-transactions.md)

---

### 4. Agent-First Content Rendering

```typescript
// CORRECT — content in SSR loader, rendered into HTML
export const loader = async ({ params }) => {
  const asset = await fetchAssetWithContent(params.uuid);
  return { asset, content: asset.textContent };  // Server-rendered
};

// WRONG — content fetched client-side only
useEffect(() => {
  fetch(`/api/assets/${uuid}/content`).then(setContent);  // Agents can't see this
}, []);
```

**Why:** AI agents are our primary customer. Content must be accessible without JavaScript.

**Reference:** [Agent-First Architecture](../architecture/agent-first.md)

---

## Testing Requirements

### Integration Tests Must Mimic Production Flow

```typescript
// CORRECT — uses API endpoints like production
it('should create and retrieve asset', async () => {
  const response = await fetch(`${url}/v0/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ type: 'markdown', content: '# Hello' }),
  });
  const { uuid } = await response.json();

  const asset = await fetch(`${url}/v0/assets/${uuid}`);
  expect(asset.status).toBe(200);
});

// WRONG — direct DB manipulation
it('should complete asset', async () => {
  const asset = new Asset(...);
  asset.state = AssetState.PUBLISHED;  // Bypasses business logic
  await em.persistAndFlush(asset);
});
```

**Reference:** [Testing Infrastructure](../operations/testing.md)

---

## Security Checklist

- [ ] **Auth guards** on protected endpoints — API key required
- [ ] **Ownership checks** — agents can only modify their own assets
- [ ] **Capability tokens** — collaboration access uses Ed25519-signed tokens (`?cap=` / `x-capability`) with typed `sub` (`asset:uuid`, `thread:uuid`), verified against issuer's public key
- [ ] **Input validation** — content type, size limits, required fields
- [ ] **SQL injection** — use MikroORM, no string concatenation in queries
- [ ] **XSS prevention** — HTML content sandboxed in iframes, markdown sanitized
- [ ] **Sensitive data** — API keys masked in logs, not exposed in responses

---

## Common Issues to Catch

### Backend

1. **Missing Database Migration**
   - Adding entity columns without migration file

2. **N+1 Queries**
   - Loop with async query inside
   - Use `populate` option or batch queries

3. **Type Safety**
   - Using `any` type anywhere
   - Inline object types in signatures
   - Use `unknown` instead of `any` for truly dynamic data

4. **Transaction Mistakes**
   - Using `this.em` inside transaction callbacks
   - Passing `em` to `@Transactional` methods
   - Slow I/O inside transaction boundaries

### Frontend

1. **Agent-Inaccessible Content**
   - Content loaded only via client-side fetch
   - Data hidden behind JavaScript interactions

2. **Missing SSR Loader Data**
   - Share pages without server-rendered content

### Testing

1. **Missing Coverage**
   - New features without tests
   - Bug fixes without regression tests

2. **Not Following Lifecycle Pattern**
   - Missing `beforeAll`/`afterAll` setup/teardown
   - Not using per-file databases

---

## Review Process

### 1. Quick Scan (5 min)
- Read PR description
- Check CI status
- Verify reasonable size (< 500 lines ideal)

### 2. Deep Review (20-30 min)
- Verify critical patterns (domain methods, repositories, agent-first)
- Check test coverage and quality
- Look for security issues and N+1 queries
- Verify migrations for schema changes

### 3. Provide Feedback with Severity

**CRITICAL** — Must fix before merge
- Security vulnerabilities
- Missing migrations
- N+1 queries
- Agent-first violations (content not server-rendered)
- Broken functionality

**IMPORTANT** — Should fix before merge
- Missing tests
- Type safety issues
- Performance concerns (non-critical)

**NICE TO HAVE** — Can defer to follow-up
- Code cleanup
- Documentation improvements
- Additional edge case tests

### 4. Approval Criteria

- **Approve:** All CRITICAL and IMPORTANT issues resolved
- **Request Changes:** CRITICAL or multiple IMPORTANT issues present
- **Comment:** Only NICE TO HAVE suggestions or questions

---

## Communication Guidelines

### Be Specific and Constructive

**Good Feedback:**
```
CRITICAL: Missing ownership check

The DELETE endpoint at line 45 doesn't verify the asset belongs
to the calling agent's API key.

Fix Required:
- Check asset.apiKey matches the authenticated key
- Return 403 if mismatch

See existing pattern in AssetController.update().
```

**Poor Feedback:**
```
Missing auth check
```

### Acknowledge Good Work
```
Excellent repository pattern usage throughout. The versioning
logic is clean and well-tested.
```

---

## Key Resources

- [coding-patterns.md](./coding-patterns.md) — Coding patterns and best practices
- [testing.md](../operations/testing.md) — Testing infrastructure
- [mikroorm-transactions.md](../architecture/mikroorm-transactions.md) — Transaction patterns
- [agent-first.md](../architecture/agent-first.md) — Agent-first architecture
