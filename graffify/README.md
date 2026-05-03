# /graffify — Agent Context Hub

This folder exists so that **AI agents** (GitHub Copilot, Claude, GPT, etc.) can instantly understand the RideHub codebase **without scanning every source file**, saving tokens and reducing latency.

## Why this folder?

Reading an entire repository file-by-file is expensive in tokens. A full scan of RideHub (TypeScript source + config + lock files) costs thousands of tokens before any useful work begins. This folder provides a **pre-digested, structured summary** of the whole repo so agents can orient themselves in one or two reads.

## Files in this folder

| File | What it covers |
|---|---|
| [`context.md`](./context.md) | Repo overview, tech stack, env vars, project structure, scripts, and key file paths |
| [`architecture.md`](./architecture.md) | Pages, component tree, auth flow, API integration, and data flow |
| [`types.md`](./types.md) | All TypeScript interfaces and types used across the codebase |

## How agents should use this folder

1. **Start here** — read `context.md` first for a complete orientation.
2. **Drill into architecture** — read `architecture.md` to understand pages, components, and the request/response flow.
3. **Check types** — read `types.md` before writing or editing any TypeScript.
4. **Then** read specific source files only as needed for the exact change you are making.

> Keep these files up-to-date when adding new pages, components, types, or dependencies.
