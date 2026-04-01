# Rename "Artifact" to "Asset" Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename every occurrence of "artifact/Artifact/artifacts" to "asset/Asset/assets" across the entire monorepo — models, services, controllers, frontend components, state, CLI, tests, docs, and DB schema.

**Architecture:** This is a mechanical rename. The only non-trivial part is the database migration (table rename + column rename). Everything else is string replacement + file/directory renames. Route paths change from `/v0/artifacts` to `/v0/assets`. No behavior changes.

**Tech Stack:** TypeScript, NestJS, MikroORM, Next.js (TanStack Router), Jotai, Bun, PostgreSQL

---

## Rename Mapping Reference

| Old | New |
|-----|-----|
| `Artifact` | `Asset` |
| `artifact` | `asset` |
| `artifacts` | `assets` |
| `ArtifactType` | `AssetType` |
| `ArtifactRepository` | `AssetRepository` |
| `ArtifactService` | `AssetService` |
| `ArtifactController` | `AssetController` |
| `ArtifactMetadata` | `AssetMetadata` |
| `ArtifactViewer` | `AssetViewer` |
| `ArtifactToolbar` | `AssetToolbar` |
| `parentArtifactId` | `parentAssetId` |
| DB table: `artifact` | DB table: `asset` |
| DB column: `parent_artifact_id` | DB column: `parent_asset_id` |
| Route: `/v0/artifacts` | Route: `/v0/assets` |

---

## Task 1: Create DB Migration for Table and Column Rename

**Files:**
- Create: `apps/backend/migrations/Migration<timestamp>.ts` (use `bunx mikro-orm migration:create --name rename-artifact-to-asset`)

**Step 1: Generate migration scaffold**

```bash
cd apps/backend && bunx mikro-orm migration:create --name rename-artifact-to-asset
```

Expected: New file created at `apps/backend/migrations/Migration<timestamp>RenameArtifactToAsset.ts`

**Step 2: Edit the migration to rename table and column**

Replace the generated empty `up()`/`down()` with:

```typescript
override async up(): Promise<void> {
  this.addSql(`alter table "artifact" rename to "asset";`);
  this.addSql(`alter table "asset" rename column "parent_artifact_id" to "parent_asset_id";`);
}

override async down(): Promise<void> {
  this.addSql(`alter table "asset" rename column "parent_asset_id" to "parent_artifact_id";`);
  this.addSql(`alter table "asset" rename to "artifact";`);
}
```

**Step 3: Run the migration**

```bash
cd apps/backend && bunx mikro-orm migration:up
```

Expected: `Migration...RenameArtifactToAsset: migrated successfully`

---

## Task 2: Rename Backend Source Files

**Files:**
- Rename: `apps/backend/src/db/models/Artifact.ts` → `apps/backend/src/db/models/Asset.ts`
- Rename: `apps/backend/src/db/repositories/artifact.repository.ts` → `apps/backend/src/db/repositories/asset.repository.ts`
- Rename: `apps/backend/src/api/controller/artifact.controller.ts` → `apps/backend/src/api/controller/asset.controller.ts`
- Rename: `apps/backend/src/api/service/artifact.service.ts` → `apps/backend/src/api/service/asset.service.ts`

**Step 1: Rename files**

```bash
mv apps/backend/src/db/models/Artifact.ts apps/backend/src/db/models/Asset.ts
mv apps/backend/src/db/repositories/artifact.repository.ts apps/backend/src/db/repositories/asset.repository.ts
mv apps/backend/src/api/controller/artifact.controller.ts apps/backend/src/api/controller/asset.controller.ts
mv apps/backend/src/api/service/artifact.service.ts apps/backend/src/api/service/asset.service.ts
```

---

## Task 3: Update Backend Source File Content

**Files:**
- Modify: `apps/backend/src/db/models/Asset.ts`
- Modify: `apps/backend/src/db/repositories/asset.repository.ts`
- Modify: `apps/backend/src/api/controller/asset.controller.ts`
- Modify: `apps/backend/src/api/service/asset.service.ts`
- Modify: `apps/backend/src/db/models/index.ts`
- Modify: `apps/backend/src/api/api.module.ts`

**Step 1: Bulk replace in backend source files**

```bash
# Replace in all backend source files (excluding dist and migrations)
find apps/backend/src -name "*.ts" | xargs sed -i '' \
  -e 's/ArtifactRepository/AssetRepository/g' \
  -e 's/ArtifactController/AssetController/g' \
  -e 's/ArtifactService/AssetService/g' \
  -e 's/ArtifactType/AssetType/g' \
  -e 's/Artifact/Asset/g' \
  -e 's/artifact\.repository/asset.repository/g' \
  -e 's/artifact\.controller/asset.controller/g' \
  -e 's/artifact\.service/asset.service/g' \
  -e 's/parentArtifactId/parentAssetId/g' \
  -e "s|v0/artifacts|v0/assets|g" \
  -e 's/artifact/asset/g' \
  -e 's/artifacts/assets/g'
```

**Step 2: Verify Asset.ts looks correct**

Open `apps/backend/src/db/models/Asset.ts` and confirm:
- Class is `Asset` (not `Artifact`)
- Enum is `AssetType`
- Import `AssetRepository` from `../repositories/asset.repository`
- Property `parentAssetId` (not `parentArtifactId`)
- `@Entity({ repository: () => AssetRepository })`

**Step 3: Verify asset.controller.ts routes**

Open `apps/backend/src/api/controller/asset.controller.ts` and confirm:
- `@Controller('v0/assets')` (not `v0/artifacts`)
- Class is `AssetController`

**Step 4: Verify api.module.ts imports**

Open `apps/backend/src/api/api.module.ts` and confirm it imports `Asset`, `AssetController`, `AssetService`.

---

## Task 4: Update MikroORM Snapshot

**Files:**
- Modify: `apps/backend/migrations/.snapshot-tokenrip.json`

**Step 1: Replace in snapshot**

```bash
sed -i '' \
  -e 's/parent_artifact_id/parent_asset_id/g' \
  -e 's/"artifact"/"asset"/g' \
  -e 's/Artifact/Asset/g' \
  apps/backend/migrations/.snapshot-tokenrip.json
```

**Step 2: Verify snapshot**

Check the snapshot no longer contains `artifact` anywhere:
```bash
grep -i artifact apps/backend/migrations/.snapshot-tokenrip.json
```
Expected: no output

---

## Task 5: Rename Frontend Files and Directory

**Files:**
- Rename dir: `apps/frontend/src/_jotai/artifact/` → `apps/frontend/src/_jotai/asset/`
- Rename: `artifact.atoms.ts` → `asset.atoms.ts`
- Rename: `artifact.actions.ts` → `asset.actions.ts`
- Rename: `apps/frontend/src/components/ArtifactViewer.tsx` → `AssetViewer.tsx`
- Rename: `apps/frontend/src/components/ArtifactToolbar.tsx` → `AssetToolbar.tsx`

**Step 1: Rename directory and files**

```bash
mv apps/frontend/src/_jotai/artifact apps/frontend/src/_jotai/asset
mv apps/frontend/src/_jotai/asset/artifact.atoms.ts apps/frontend/src/_jotai/asset/asset.atoms.ts
mv apps/frontend/src/_jotai/asset/artifact.actions.ts apps/frontend/src/_jotai/asset/asset.actions.ts
mv apps/frontend/src/components/ArtifactViewer.tsx apps/frontend/src/components/AssetViewer.tsx
mv apps/frontend/src/components/ArtifactToolbar.tsx apps/frontend/src/components/AssetToolbar.tsx
```

---

## Task 6: Update Frontend Source File Content

**Files:**
- Modify: `apps/frontend/src/_jotai/asset/asset.atoms.ts`
- Modify: `apps/frontend/src/_jotai/asset/asset.actions.ts`
- Modify: `apps/frontend/src/components/AssetViewer.tsx`
- Modify: `apps/frontend/src/components/AssetToolbar.tsx`
- Modify: `apps/frontend/src/components/MetadataSheet.tsx`
- Modify: `apps/frontend/src/app/s/$uuid.tsx`
- Modify: `apps/frontend/src/lib/api.ts`
- Modify: `apps/frontend/src/app/__root.tsx`

**Step 1: Bulk replace in all frontend source files**

```bash
find apps/frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  -e 's/ArtifactMetadata/AssetMetadata/g' \
  -e 's/ArtifactViewer/AssetViewer/g' \
  -e 's/ArtifactToolbar/AssetToolbar/g' \
  -e 's/ArtifactToolbarProps/AssetToolbarProps/g' \
  -e 's/artifactAtom/assetAtom/g' \
  -e 's/isLoadingArtifactAtom/isLoadingAssetAtom/g' \
  -e 's/artifactErrorAtom/assetErrorAtom/g' \
  -e 's/useArtifactActions/useAssetActions/g' \
  -e 's/fetchArtifact/fetchAsset/g' \
  -e 's/getArtifactContentUrl/getAssetContentUrl/g' \
  -e 's|_jotai/artifact/artifact|_jotai/asset/asset|g' \
  -e 's|v0/artifacts|v0/assets|g' \
  -e 's/SharedArtifact/SharedAsset/g' \
  -e 's/ArtifactType/AssetType/g' \
  -e 's/artifact/asset/g' \
  -e 's/artifacts/assets/g' \
  -e 's/Artifact/Asset/g'
```

**Step 2: Verify $uuid.tsx imports**

Open `apps/frontend/src/app/s/$uuid.tsx` and confirm:
- Imports from `../_jotai/asset/asset.atoms` and `../_jotai/asset/asset.actions`
- API path uses `/v0/assets/${uuid}`
- References `assetAtom`, `isLoadingAssetAtom`, `assetErrorAtom`

**Step 3: Verify api.ts**

Open `apps/frontend/src/lib/api.ts` and confirm:
- Interface is `AssetMetadata`
- Function is `getAssetContentUrl()`

---

## Task 7: Update CLI Package

**Files:**
- Modify: `packages/cli/src/cli.ts`
- Modify: `packages/cli/src/commands/upload.ts`
- Modify: `packages/cli/src/commands/publish.ts`
- Modify: `packages/cli/src/commands/status.ts`
- Modify: `packages/cli/package.json`

**Step 1: Bulk replace in CLI source files**

```bash
find packages/cli/src -name "*.ts" | xargs sed -i '' \
  -e 's/ArtifactType/AssetType/g' \
  -e 's/Artifact/Asset/g' \
  -e 's|v0/artifacts|v0/assets|g' \
  -e 's/artifact/asset/g' \
  -e 's/artifacts/assets/g'
```

**Step 2: Update package.json description**

```bash
sed -i '' 's/artifacts/assets/g; s/artifact/asset/g' packages/cli/package.json
```

---

## Task 8: Rename and Update Test Files

**Files:**
- Rename: `tests/integration/artifact-read.test.ts` → `tests/integration/asset-read.test.ts`
- Modify: all `tests/integration/*.test.ts`

**Step 1: Rename test file**

```bash
mv tests/integration/artifact-read.test.ts tests/integration/asset-read.test.ts
```

**Step 2: Bulk replace in all test files**

```bash
find tests -name "*.ts" | xargs sed -i '' \
  -e 's/ArtifactType/AssetType/g' \
  -e 's/ArtifactMetadata/AssetMetadata/g' \
  -e 's/Artifact/Asset/g' \
  -e 's|v0/artifacts|v0/assets|g' \
  -e 's/artifact/asset/g' \
  -e 's/artifacts/assets/g'
```

---

## Task 9: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Modify: `apps/backend/CLAUDE.md`
- Modify: `apps/frontend/CLAUDE.md`
- Modify: `packages/cli/README.md`
- Modify: `packages/cli/skill/SKILL.md`
- Modify: `docs/api/endpoints.md`
- Modify: `docs/architecture/frontend.md`
- Modify: `docs/architecture/cli-internals.md`
- Modify: `docs/architecture/mikroorm-transactions.md`
- Modify: `docs/operations/testing.md`

**Step 1: Bulk replace in all markdown/docs**

```bash
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" | xargs sed -i '' \
  -e 's/ArtifactType/AssetType/g' \
  -e 's/ArtifactMetadata/AssetMetadata/g' \
  -e 's/ArtifactController/AssetController/g' \
  -e 's/ArtifactService/AssetService/g' \
  -e 's/ArtifactRepository/AssetRepository/g' \
  -e 's/ArtifactViewer/AssetViewer/g' \
  -e 's/ArtifactToolbar/AssetToolbar/g' \
  -e 's/Artifact/Asset/g' \
  -e 's|v0/artifacts|v0/assets|g' \
  -e 's/artifact/asset/g' \
  -e 's/artifacts/assets/g'
```

**Step 2: Verify CLAUDE.md files updated**

Check `apps/backend/CLAUDE.md` — API endpoint table should show `/v0/assets`.

---

## Task 10: Build Backend and Run Tests

**Step 1: Clean dist and rebuild backend**

```bash
cd apps/backend && rm -rf dist && bun run build
```

Expected: Build succeeds with no errors. Any "Cannot find module" error means an import path wasn't updated — grep for the old name and fix.

**Step 2: Run all tests from monorepo root**

```bash
cd /Users/si/projects/maxi/tokenrip && bun test
```

Expected: All tests pass. Route tests should use `/v0/assets`.

**Step 3: Grep for any remaining "artifact" occurrences in source**

```bash
grep -ri "artifact" apps/ packages/ tests/ --include="*.ts" --include="*.tsx" --include="*.json" | grep -v dist/ | grep -v node_modules/
```

Expected: Only migration files and this plan file — nothing in source code.
