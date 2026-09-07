# speccraft

[![npm version](https://img.shields.io/npm/v/@rspl/speccraft.svg)](https://www.npmjs.com/package/@rspl/speccraft)
[![npm downloads](https://img.shields.io/npm/dm/@rspl/speccraft.svg)](https://www.npmjs.com/package/@rspl/speccraft)
[![CI](https://github.com/RishabhSoftwarePrivateLimited/spec-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/RishabhSoftwarePrivateLimited/spec-craft/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@rspl/speccraft.svg)](LICENSE)

**speccraft** is a CLI scaffolding tool for spec-driven development (SDD) — Rishabh Software Private Limited's stage-gated workflow that takes one business spec through LLD, decomposition, implementation, testing, and validation. Drop it into any project and pair it with the agent tooling you already use: Claude Code, Gemini CLI, or GitHub Copilot.

## Quickstart

```
npx @rspl/speccraft my-app
```

## What it does

- Drops in `spec/` — the full stage-gated SDD workflow (business spec → LLD → decompose → implement → test → validate), agent-agnostic and always installed.
- Ships `/speccraft.orchestrate` to run that whole workflow end to end from one business spec file. Run it plain for a human-reviewed pass with an approval gate at every stage, or as `/speccraft.orchestrate auto <business-spec-file>.md` for a fully unattended run — the agent reviews and resolves every gate itself and logs each decision (including how it resolved any conflict) for you to audit afterward. See [docs/command-reference.md](docs/command-reference.md).
- Ships guided setup commands so you never hand-author stack decisions: `/speccraft.plan-foundation <business-spec-file> "<tech stack>"` drafts the architecture foundation for a **new** project from a business spec plus a stated tech stack (Layer Scope, locked stack decisions, seed `rules`/`skills`, scaffold contract), while `/speccraft.onboard [path]` does the same for an **existing** codebase by scanning it instead. Both stop at one human review gate — nothing is locked until you say `approved`.
- Lets you pick which agent tooling to add: **Claude Code**, **Gemini CLI**, **GitHub Copilot**, and/or a plain **agent-agnostic** skills layer — install only what you use.
- Selecting Claude Code or Gemini CLI also makes their 13 commands available **globally** (`~/.claude/commands/`, `~/.gemini/commands/`) in the same run, never overwriting a command you already have.
- Everything is copy-once and yours: no ongoing dependency on this tool after scaffolding, and re-running it never silently clobbers existing files.

## Live Examples

Two fully-built, runnable projects showing the workflow end to end — real generated `spec/`, real application code, every stage gate actually reviewed by a human, not mockups.

| | |
|---|---|
| [examples/greenfield-demo/](examples/greenfield-demo/) | Brand-new project: stack locked from a blank `ARCH-DECISIONS.md`, one story (a task tracker) built start to finish. See its [WALKTHROUGH.md](examples/greenfield-demo/WALKTHROUGH.md). |
| [examples/brownfield-demo/](examples/brownfield-demo/) | Existing app onboarded via `/speccraft.onboard`, then extended with a new story on top of the discovered stack and conventions. See its [WALKTHROUGH.md](examples/brownfield-demo/WALKTHROUGH.md). |

## Docs

| | |
|---|---|
| [docs/setup.md](docs/setup.md) | Prerequisites + first-run walkthrough |
| [docs/greenfield-setup.md](docs/greenfield-setup.md) | Using the workflow on a new project |
| [docs/brownfield-setup.md](docs/brownfield-setup.md) | Using the workflow on an existing project |
| [docs/usage.md](docs/usage.md) | Every CLI flag, non-interactive usage |
| [docs/architecture.md](docs/architecture.md) | How the tool works, for contributors |
| [docs/command-reference.md](docs/command-reference.md) | Every command shipped, per agent |
| [docs/faq.md](docs/faq.md) | Common questions |
| [docs/publishing.md](docs/publishing.md) | npm publish flow (maintainers) |
| [troubleshoot/README.md](troubleshoot/README.md) | Known failure modes, symptom → fix |
| [examples/](examples/) | Static install-selection trees plus the two live demos above |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: see [SECURITY.md](SECURITY.md), not public issues.
