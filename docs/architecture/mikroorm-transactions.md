# MikroORM Transactions & Context

How transactions, EntityManagers, and identity maps work in our NestJS + MikroORM stack, and the conventions we follow.

## Table of Contents

1. [How MikroORM Context Works](#how-mikroorm-context-works)
2. [Transaction Boundaries](#transaction-boundaries)
3. [External I/O and Transactions](#external-io-and-transactions)
4. [Passing Data Across Boundaries](#passing-data-across-boundaries)
5. [Flushing Strategy](#flushing-strategy)
6. [Repository Boundaries](#repository-boundaries)
7. [Rules of Thumb](#rules-of-thumb)
8. [Common Patterns](#common-patterns)
9. [Anti-Patterns](#anti-patterns)

---

## How MikroORM Context Works

### Global Context is Disabled

Our MikroORM configuration has **`allowGlobalContext: false`** (see `apps/backend/src/db/mikro-orm.config.ts`). This enforces proper EntityManager scoping:

- **All code must run within a request context** - no implicit global EM access
- Using `em` or repositories without context throws:
  `"Using global EntityManager instance methods for context specific actions is disallowed"`
- This prevents stale entity issues, identity map leaks, and transaction boundary confusion

**Required context providers:**

| Scenario                  | Solution                                                          |
|---------------------------|-------------------------------------------------------------------|
| HTTP requests             | Automatic via `@mikro-orm/nestjs`                                 |
| Event handlers            | `@EnsureRequestContext()` decorator                               |
| Cron jobs/background work | `@EnsureRequestContext()` or `@CreateRequestContext()`            |
| Module initialization     | `@CreateRequestContext()` decorator                               |

**IMPORTANT: `@EnsureRequestContext()` and `@Transactional()` are mutually exclusive.**

- **Use `@Transactional()`** when the method performs database operations and needs transaction boundaries
- **Use `@EnsureRequestContext()`** for entry points (event handlers, cron jobs) that call other services which handle their own transactions
- **NEVER use both decorators on the same method** - `@Transactional()` already creates a request context, making `@EnsureRequestContext()` redundant

```typescript
// ✅ CORRECT - @Transactional creates context automatically
@Transactional()
async createAsset(data: CreateAssetDto): Promise<Asset> {
  // Has both context and transaction
}

// ✅ CORRECT - @EnsureRequestContext for entry point that delegates
@OnEvent(EventType.SOMETHING)
@EnsureRequestContext()
async handleEvent(event: SomeEvent): Promise<void> {
  await this.someService.process(event.id);  // Service has @Transactional
}

// ❌ INCORRECT - Redundant decorators
@OnEvent(EventType.SOMETHING)
@EnsureRequestContext()
@Transactional()
async handleEvent(event: SomeEvent): Promise<void> {
  // @Transactional already provides context!
}
```

### Request Context & Per-Request EntityManager

MikroORM is designed around **one EntityManager + identity map per request**. In our NestJS setup:

- `@mikro-orm/nestjs` plus `RequestContext` gives us a request-scoped EM
- Injected `EntityManager` and repositories automatically use that request-scoped EM
- `@EnsureRequestContext()` **is required** for entry points outside HTTP (event handlers, jobs)

```typescript
@Injectable()
export class AssetService {
  constructor(
    private readonly em: EntityManager,  // Request-scoped via context
  ) {}
}
```

### Transactions Create Forked EMs with Shared Identity Map

When you call `em.transactional()` or use `@Transactional()`:

1. **A new EM is created** (forked from the current one)
2. **The forked EM is bound to the async context** (like RequestContext)
3. **Identity map is shared** - created with `clear: false` by default, so all managed entities from the parent EM are available
4. **Auto-flush on commit** - MikroORM flushes the inner EM before committing

```typescript
// Entity loaded in request context
const asset = await this.em.findOne(Asset, { id: assetId });

await this.em.transactional(async (em) => {
  // asset IS in the forked EM's identity map - this works!
  asset.title = 'Updated Title';
  em.persist(asset);  // Changes will be tracked and persisted
});
```

### Context Propagation

Inside `em.transactional()` or a `@Transactional()` method, **any use of the injected EM or repositories respects the inner context**:

```typescript
await this.em.transactional(async (em) => {
  // Both of these use the transaction's EM automatically:
  const asset = await this.em.findOne(Asset, { id });  // Uses transaction EM via context propagation
  this.em.persist(newEntity);  // Also uses transaction EM
});
```

You don't need to thread `em` through every method call - repositories and `this.em` automatically use the current transaction context.

### Nested @Transactional Methods

| Propagation Mode     | Behavior                                       |
|----------------------|------------------------------------------------|
| `REQUIRED` (default) | Reuses existing transaction & EM               |
| `REQUIRES_NEW`       | Creates fresh EM + separate DB transaction     |
| `NESTED`             | Creates savepoint within existing transaction  |
| `MANDATORY`          | Requires existing transaction (throws if none) |

```typescript
@Transactional({ propagation: TransactionPropagation.REQUIRED })
async outerMethod(): Promise<void> {
  await this.innerService.innerMethod();  // Shares same transaction
}

@Transactional({ propagation: TransactionPropagation.REQUIRED })
async innerMethod(): Promise<void> {
  // Same EM, same transaction as outerMethod
}
```

### Detached Entities

Entities become "detached" when used in a **different** EM context (not the forked transactional EM, but a truly separate one):

- **Separate transactions**: Entity loaded in Transaction A, used in Transaction B (after A commits)
- **Background workers**: Code running outside RequestContext with independent EMs
- **Explicit fork**: `em.fork({ clear: true, useContext: false })`

Calling `em.persist(detachedEntity)` on a detached entity **will attach it and take a new snapshot** - it's only a no-op if the entity is already managed by that EM.

---

## Transaction Boundaries

### Make Transaction Boundary Methods Explicit

For each service, have a small number of methods that explicitly define transaction boundaries:

```typescript
// Option 1: @Transactional decorator
@Transactional()
async createAsset(data: CreateAssetDto): Promise<Asset> {
  // All DB work here shares one transaction
}

// Option 2: em.transactional for tight, surgical transactions
async processAsset(assetId: string): Promise<void> {
  // Do external I/O outside transaction
  const metadata = await this.externalService.fetchMetadata(assetId);

  // Tight transaction for DB writes only
  await this.em.transactional(async (em) => {
    const asset = await em.findOne(Asset, { id: assetId });
    asset.metadata = metadata;
    em.persist(asset);
  });
}
```

### Avoid Mixing Styles in the Same Code Path

Pick one style per code path for clarity:

```typescript
// Avoid this - confusing mix of styles
@Transactional()
async confusingMethod(): Promise<void> {
  await this.em.transactional(async (em) => {  // Nested manual transaction
    // ...
  });
}

// Better: pick one approach
@Transactional()
async clearMethod(): Promise<void> {
  // All DB work here, no inner em.transactional
}

// Or: use em.transactional when you need tight control
async orchestrationMethod(): Promise<void> {
  const data = await this.fetchExternalData();  // I/O outside
  await this.em.transactional(async (em) => {
    // DB work inside
  });
}
```

### When to Use Each Style

| Style                | Use When                                                                   |
|----------------------|----------------------------------------------------------------------------|
| `@Transactional()`   | Simple, DB-only methods; called from controllers or other services         |
| `em.transactional()` | Surgical, small transactions inside larger flows that include external I/O |

---

## External I/O and Transactions

### Keep Slow I/O Outside DB Transactions

External API calls, file operations, or any slow I/O should stay outside transactions to avoid holding DB locks unnecessarily:

```typescript
// Good: I/O outside, DB inside
async processAndStore(assetId: string): Promise<void> {
  // 1. External I/O (may be slow) - OUTSIDE transaction
  const result = await this.externalService.process(assetId);

  // 2. Tight transaction for DB writes only
  await this.em.transactional(async (em) => {
    const asset = await em.findOne(Asset, { id: assetId });
    asset.metadata = result;
    em.persist(asset);
  });
}

// Bad: holding DB lock during slow I/O
@Transactional()
async slowMethod(): Promise<void> {
  const result = await this.externalService.process(id);  // Holds lock!
  // ...
}
```

---

## Passing Data Across Boundaries

### Within a Service/Transaction: Entities Are Fine

Inside one service and one transaction context, passing entity instances is convenient and safe:

```typescript
@Transactional()
async processAsset(assetId: string): Promise<void> {
  const asset = await this.em.findOne(Asset, { id: assetId });

  // Fine to pass entity to private helper within same transaction
  await this.validate(asset);
  await this.updateMetadata(asset);
}

private async validate(asset: Asset): Promise<void> {
  // Same transaction context, entity is managed
}
```

### Across Service Boundaries: Prefer IDs/DTOs

When calling other services, especially those with their own `@Transactional`:

```typescript
// Prefer this
@Transactional()
async handleAsset(assetId: string): Promise<void> {
  const asset = await this.em.findOne(Asset, { id: assetId });
  asset.title = 'Updated';
  this.em.persist(asset);

  // Pass ID to other service
  await this.otherService.notify(assetId);
}

// Instead of passing entity across service boundaries
```

**Why prefer IDs/DTOs across boundaries:**

1. Makes data dependencies explicit
2. Supports future refactoring (workers, queues, microservices)
3. Works correctly even with different propagation modes
4. Easier to test and reason about

### Side-Effect Services: Always Pass DTOs

Services that perform side effects (email, webhooks, external APIs) don't need ORM entities:

```typescript
// Good: Pass only needed data
await this.notificationService.send({
  assetId: asset.id,
  title: asset.title,
  type: asset.type,
});
```

---

## Flushing Strategy

### Auto-Flush Behavior

- `em.transactional()` auto-flushes at the end of the callback
- `@Transactional()` auto-flushes at the end of the method

Inside transactional contexts, call `em.persist()` as needed - no manual flush required unless:

### When to Manually Flush

1. **Need IDs mid-transaction** for follow-on logic:

```typescript
await this.em.transactional(async (em) => {
  const asset = new Asset(...);
  em.persist(asset);
  await em.flush();  // Get asset.id

  // Now use asset.id
  await this.createRelatedRecord(asset.id);
});
```

2. **Before external side-effects** to ensure durability:

```typescript
@Transactional()
async createAndNotify(data: CreateDto): Promise<Asset> {
  const asset = new Asset(data);
  this.em.persist(asset);
  await this.em.flush();  // Ensure DB state is durable

  // Now safe to send notification - asset exists in DB
  await this.notificationService.send(asset.id);
  return asset;
}
```

3. **Before calling methods that may create nested contexts:**

```typescript
@Transactional()
async processAsset(assetId: string): Promise<void> {
  const asset = await this.em.findOne(Asset, { id: assetId });
  asset.title = 'Processing';
  this.em.persist(asset);

  await this.em.flush();  // Commit before nested call

  await this.otherService.processDetails(assetId);  // Has its own @Transactional
}
```

---

## Repository Boundaries

### Services Must Not Do Direct DB Access

All database access — including raw SQL — belongs in repository classes. Services orchestrate business logic and delegate data access to repositories. Never use `em.getKnex()` or `em.getConnection().execute()` directly in a service.

```typescript
// ✅ CORRECT - Service delegates to repository
async getSummary(apiKeyId: string): Promise<SummaryDto> {
  const counts = await this.assetRepository.getCountsByType(apiKeyId);
  return { counts };
}

// ❌ INCORRECT - Service does direct DB access
async getSummary(apiKeyId: string): Promise<SummaryDto> {
  const knex = this.em.getKnex();
  const result = await knex.raw('SELECT COUNT(*) FROM asset WHERE ...');
  return { count: parseInt(result.rows[0].count) };
}
```

> **Note:** Tokenrip currently uses direct `em` calls in services (no repository classes). As the backend grows, extract data access into dedicated repository classes.

### Aggregation Queries in Repositories

MikroORM lacks native aggregation support (SUM, COUNT, GROUP BY). For these queries, use `em.getConnection().execute()` with parameterized raw SQL in repository methods:

```typescript
// ✅ CORRECT - Parameterized raw SQL via em.getConnection().execute()
const rows = await this.em.getConnection().execute<Array<{ total: string }>>(
  `SELECT COUNT(*) as total FROM asset WHERE api_key_id = ?`,
  [apiKeyId]
);

// ❌ INCORRECT - em.getKnex() query builder
const knex = this.em.getKnex();
const result = await knex('asset').count().where('api_key_id', apiKeyId);
```

**Why `em.getConnection().execute()` over `em.getKnex()`:** It uses MikroORM's connection pool directly, keeps SQL explicit and reviewable, and avoids mixing two query-building abstractions.

---

## Rules of Thumb

### 1. Use @Transactional as Your Main Tool

For most DB-centric methods, `@Transactional()` is the right choice:

```typescript
@Transactional()
async createAsset(...): Promise<Asset> {
  // DB work
}
```

### 2. Use em.transactional for Surgical Transactions

Inside larger orchestration flows that include external I/O:

```typescript
async orchestrateFlow(): Promise<void> {
  const externalData = await this.fetchFromService();  // Outside

  await this.em.transactional(async (em) => {
    // Tight DB transaction
  });

  await this.notifyExternalSystem();  // Outside
}
```

### 3. Keep Slow I/O Outside Transactions

```typescript
// Do this
const data = await this.externalService.fetch();
await this.em.transactional(async (em) => { /* write */ });

// Not this
await this.em.transactional(async (em) => {
  const data = await this.externalService.fetch();  // Holding lock while waiting on I/O
  /* write */
});
```

### 4. Entities Within, IDs Across

- **Within** a single service/transaction: entities are fine
- **Across** service boundaries: prefer IDs/DTOs

### 5. Identify Transaction Boundary Methods

Annotate and keep them small:

```typescript
/**
 * Transaction boundary: Creates asset and persists storage key.
 */
@Transactional()
async createFromContent(...): Promise<Asset> {
  // Clear, focused transaction
}
```

---

## Common Patterns

### Event Handler with Context

```typescript
@OnEvent(EventType.ASSET_CREATED)
@EnsureRequestContext()
async handleAssetCreated(event: AssetCreatedEvent): Promise<void> {
  await this.processingService.process(event.assetId);
}
```

### Service Method Calling Another Service

```typescript
@Transactional()
async handleAssetComplete(assetId: string): Promise<void> {
  const asset = await this.em.findOne(Asset, { id: assetId });
  asset.metadata = { processed: true };
  this.em.persist(asset);

  // Pass ID - other service has its own @Transactional
  // With REQUIRED propagation, shares same transaction
  await this.otherService.recordCompletion(assetId);
}
```

### I/O + Tight Transaction Pattern

```typescript
async processAsset(assetId: string): Promise<void> {
  // 1. External I/O outside transaction
  const result = await this.externalService.process(assetId);

  // 2. Early return if no changes needed
  if (!result.hasChanges) return;

  // 3. Tight transaction for writes
  await this.em.transactional(async (em) => {
    const asset = await em.findOne(Asset, { id: assetId });
    asset.metadata = result.data;
    em.persist(asset);
  });
}
```

---

## Anti-Patterns

### Mixing @Transactional with Inner em.transactional

```typescript
// Avoid
@Transactional()
async confusingMethod(): Promise<void> {
  await this.em.transactional(async (em) => {
    // Nested transaction - confusing
  });
}
```

### Long Transactions with I/O Inside

```typescript
// Avoid
@Transactional()
async slowMethod(): Promise<void> {
  const data = await this.externalService.fetch();  // Holds DB lock during I/O!
  // ...
}
```

### Inconsistent em Parameter Usage

```typescript
// Avoid
private async helper(em: EntityManager, entity: Asset): Promise<void> {
  // em passed but not used
  await this.em.findOne(Asset, { id: entity.id });  // Uses injected EM instead
}
```

If you pass `em`, use it. If you don't need it, don't pass it.

### Using Entity from Separate Transaction

```typescript
// Avoid
async processAsset(assetId: string): Promise<void> {
  // Transaction 1
  const asset = await this.em.transactional(async (em) => {
    return await em.findOne(Asset, { id: assetId });
  });
  // Transaction 1 commits - asset now detached

  // Transaction 2
  await this.em.transactional(async (em) => {
    asset.title = 'Updated';  // asset not in this EM's identity map
    em.persist(asset);
  });
}

// Better: re-fetch in second transaction
async processAsset(assetId: string): Promise<void> {
  await this.em.transactional(async (em) => {
    await this.updateStatus(assetId);
  });

  await this.em.transactional(async (em) => {
    const asset = await em.findOneOrFail(Asset, { id: assetId });  // Fresh fetch
    asset.title = 'Updated';
    em.persist(asset);
  });
}
```

---

## Summary

| Concept                 | Key Point                                                           |
|-------------------------|---------------------------------------------------------------------|
| **Request Context**     | One EM per request; injected EM/repos use it automatically          |
| **Transactional Fork**  | Shares identity map with parent; entities are available             |
| **Context Propagation** | Repos/EM inside transaction use the transaction's EM                |
| **Nested Transactions** | `REQUIRED` = same EM; `REQUIRES_NEW` = fresh EM                    |
| **External I/O**        | Keep slow I/O outside transactions; use tight transactions for DB writes |
| **Passing Data**        | Entities within service; IDs/DTOs across services                   |
| **Flushing**            | Auto on commit; manual only when needed for IDs or side-effects     |

---

## References

- [MikroORM Transactions](https://mikro-orm.io/docs/transactions)
