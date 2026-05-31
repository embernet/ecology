#!/usr/bin/env bash
# Runs the content-section tests for Biomimicry and "But Why?".
set -e
cd "$(dirname "$0")/.."

echo "== Biomimicry & But Why? data-contract tests =="
node tests/test_content.mjs
