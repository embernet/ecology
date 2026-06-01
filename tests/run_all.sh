#!/usr/bin/env bash
# Runs the content-section tests for Biomimicry and "But Why?".
set -e
cd "$(dirname "$0")/.."

# Rebuild the search index first so the coverage checks below test the CURRENT
# output of the builder, not a stale committed copy.
echo "== Building search index =="
npx tsx scripts/build-search-index.ts

echo "== Biomimicry & But Why? data-contract + index-coverage tests =="
node tests/test_content.mjs

echo "== Cross-link integrity tests =="
npx tsx tests/test_links.ts
