#!/bin/bash
# Sync CLI source to published tokenrip-cli repo

SOURCE="packages/cli"
TARGET="../tokenrip-cli"

echo "Syncing $SOURCE → $TARGET"

mkdir -p "$TARGET/src"
rsync -a \
  --delete \
  --exclude '__tests__/' \
  --exclude '*.test.ts' \
  --exclude '*.spec.ts' \
  "$SOURCE/src/" "$TARGET/src/"
cp -r "$SOURCE/dist" "$TARGET/" 2>/dev/null
cp "$SOURCE/package.json" "$TARGET/"
cp "$SOURCE/tsconfig.json" "$TARGET/"
cp "$SOURCE/tsconfig.cjs.json" "$TARGET/"
cp "$SOURCE/README.md" "$TARGET/"
cp "$SOURCE/CLI.md" "$TARGET/" 2>/dev/null
cp "$SOURCE/AGENTS.md" "$TARGET/" 2>/dev/null
cp "$SOURCE/SKILL.md" "$TARGET/" 2>/dev/null
rsync -a --delete "$SOURCE/assets/" "$TARGET/assets/" 2>/dev/null

echo "✓ Sync complete"
