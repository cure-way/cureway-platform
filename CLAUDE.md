# CureWay — Contributor Guide

Project guidance for AI coding assistants and contributors working in this repository.

## Git

Never add Co-Authored-By, Claude-Session, or 'Generated with Claude Code' lines to commit messages or PR descriptions.

Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit subjects
(`feat(scope):`, `fix(scope):`, `chore:`, `docs:`, `refactor:`).

Branch naming:

- `feature/<name>` / `feat/<name>` — new features
- `fix/<description>` — bug fixes
- `refactor/<scope>` — refactoring
- `chore/<scope>` — tooling, config, maintenance
- `docs/<topic>` — documentation

Do not commit directly to `main`, and do not force-push shared branches you did not create.
