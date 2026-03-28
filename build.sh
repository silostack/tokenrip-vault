#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Installing dependencies..."
cd "$ROOT_DIR"
bun install

echo "==> Building CLI (@tokenrip/cli)..."
cd "$ROOT_DIR/packages/cli"
bun run build

echo "==> Building backend..."
cd "$ROOT_DIR/apps/backend"
bun run build

echo "==> Building frontend..."
cd "$ROOT_DIR/apps/frontend"
bun run build

echo "==> All builds complete."
