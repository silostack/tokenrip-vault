# Coding Patterns & Best Practices

Runtime patterns and framework-specific best practices for the Tokenrip codebase.

## MikroORM Patterns

> **Full Guide:** [MikroORM Transactions & Context](../architecture/mikroorm-transactions.md)

| Context | Use |
|---------|-----|
| Inside `em.transactional()` callback | Use passed `em` parameter |
| Private helper from callback | Pass `em` parameter |
| Service method with `@Transactional` | Use `this.em` (automatic) |
| Passing data across services | Use IDs/DTOs, not entities |
| Across separate transactions | Re-fetch entity by ID |

**Transaction Style:**
- `@Transactional()` — Simple, DB-only methods
- `em.transactional()` — Flows with external I/O mixed with DB

**Key Rule:** Keep slow I/O OUTSIDE transactions:

```typescript
// CORRECT
async processAndStore(assetId: string): Promise<void> {
  const result = await this.externalService.process(assetId);  // Outside
  await this.em.transactional(async (em) => {
    const asset = await em.findOne(Asset, { id: assetId });
    asset.metadata = result;
    em.persist(asset);
  });
}
```

---

## Logging Patterns

Use placeholders for values, metadata for context:

```typescript
// CORRECT
this.logger.debug('Processing asset: id=%s type=%s', assetId, assetType);
this.logger.error('Failed to store asset %s: size=%d', assetId, sizeBytes, { storageKey });

// WRONG - object ignored by NestJS logger
this.logger.debug('Processing asset', { assetId, type }); // Object ignored!
```

**Placeholders:** `%s` (string), `%d` (number), `%j` (JSON), `%%` (literal %)

**Levels:** `error` (needs attention), `warn` (non-critical), `log` (business events), `debug` (detailed flow)

---

## Frontend Patterns

TanStack Start with SSR. Key separation:

| Concern | Location |
|---------|----------|
| Data fetching, server logic | Route loaders (SSR) |
| UI rendering, viewer dispatch | Components |
| Shared display logic | Viewer components (`src/components/`) |

**Agent-first rule:** Content must be server-rendered into HTML. Never hide content behind client-side fetches that agents can't execute. See `docs/architecture/agent-first.md`.

---

## Anti-Patterns

### Wrong EM Usage

```typescript
// WRONG - use em parameter, not this.em
await this.em.transactional(async (em) => {
  this.em.persist(entity);  // Wrong!
});

// CORRECT
await this.em.transactional(async (em) => {
  em.persist(entity);  // Use parameter
});
```

### Direct Field Manipulation

```typescript
// WRONG
asset.state = AssetState.DELETED;

// CORRECT - use domain methods
asset.markDeleted();
```

### Query Logic in Services

```typescript
// WRONG - inline query in service
const asset = await this.assetRepo.findOne({ publicId: uuid, apiKey: { id: keyId } });

// CORRECT - use named repository method
const asset = await this.assetRepo.findByPublicIdAndKey(uuid, keyId);
```

### Inline Object Types

```typescript
// WRONG
async validate(): Promise<{ ignored: true; reason: string } | null> { }

// CORRECT - named type
type ValidationResult = { status: 'ignored'; reason: string } | { status: 'valid' };
async validate(): Promise<ValidationResult> { }
```

### Entity Across Separate Transactions

```typescript
// WRONG - entity detached after first transaction
const asset = await this.em.transactional(async (em) => em.findOne(Asset, id));
await this.em.transactional(async (em) => {
  asset.title = 'Updated';  // Not in this EM's identity map!
  em.persist(asset);
});

// CORRECT - re-fetch in second transaction
await this.em.transactional(async (em) => {
  const asset = await em.findOneOrFail(Asset, id);
  asset.title = 'Updated';
  em.persist(asset);
});
```

### Business Logic in Repositories

**Repository:** Named queries only (`findByPublicId()`, `findByApiKey()`)
**Service:** Entity creation, orchestration, business rules

### Dynamic Imports & `any` Type

```typescript
// WRONG
const { Config } = await import('../Config.js');  // Code smell
function handle(event: any) { }  // Loses type safety

// CORRECT
import { Config } from '../Config.js';  // Top of file
function handle(event: AssetCreatedEvent) { }  // Proper types
```

### Options Objects for Simple Entities

Don't use options objects for entity constructors unless 10+ parameters or complex optionals:

```typescript
// WRONG
constructor(options: { publicId: string; type: string; ... }) { }

// CORRECT - positional parameters
constructor(publicId: string, type: string, apiKey: ApiKey) { }
```

**When options objects ARE appropriate:** Builder patterns, DTOs, 10+ parameters

---

## Checklist

### Backend
- [ ] Use passed `em` in callbacks, not `this.em`
- [ ] Pass `em` to private helpers, NOT to `@Transactional` methods
- [ ] Use domain methods for state transitions
- [ ] Use named repository methods for queries
- [ ] Keep business logic in services, not repositories
- [ ] Use static imports only
- [ ] Keep slow I/O outside transactions

### Frontend
- [ ] Content server-rendered for agent accessibility
- [ ] Route loaders handle data fetching
- [ ] Components focus on UI rendering

---

## Resources

- [MikroORM Transactions](../architecture/mikroorm-transactions.md) — Full transaction guide
- [Agent-First Architecture](../architecture/agent-first.md) — SSR and content rendering
- [MikroORM Docs](https://mikro-orm.io/docs/transactions)
