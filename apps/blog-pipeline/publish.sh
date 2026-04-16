#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./publish.sh <path-to-markdown-file>"
  exit 1
fi

cd "$(dirname "$0")"
ANTHROPIC_MODEL=claude-sonnet-4-6 bun run src/cli.ts "$1"
