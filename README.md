# Forge Git (`forge-git`)

[![CI](https://github.com/ForgeNexa/forge-git/actions/workflows/ci.yml/badge.svg)](https://github.com/ForgeNexa/forge-git/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Forge Git** is a visual Git client and GitKraken alternative featuring interactive repository topology, staging management, and diff visualization engineered under the **ForgeNexa** developer tools ecosystem.

---

## Subsystems

1. **Go Git Engine (`services/pkg/graph`)**:
   - Computes topological commit graph nodes with parent SHA resolution and branch lanes.
   - Non-destructive Git operations.
2. **Visual Client Interface (`web/`)**:
   - Interactive commit graph viewer with branch indicators.
   - Staging manager (stage/unstage specific files).
   - Side-by-side and inline diff inspector.

---

## Development

```bash
# Test the Go Git services
cd services && go test -v -race ./...

# Build the web client
cd web && bun install && bun run build
```
