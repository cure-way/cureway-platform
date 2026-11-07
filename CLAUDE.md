# CureWay — Contributor Guide

Project guidance for AI coding assistants and contributors working in this repository.

## Git

Never add Co-Authored-By, Claude-Session, or 'Generated with Claude Code' lines to commit messages or PR descriptions.

Before every commit, set the committing identity to the repository owner:

```bash
git config user.name  "Ayman Ismail"
git config user.email "accounts@aymanismail.com"
```

Commits must never be authored or committed as `Claude <noreply@anthropic.com>`.
Note the address is `aymanismail.com`, not the `.me` address that appears in older
commits in this history.

Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit subjects
(`feat(scope):`, `fix(scope):`, `chore:`, `docs:`, `refactor:`).

Branch naming:

- `feature/<name>` / `feat/<name>` — new features
- `fix/<description>` — bug fixes
- `refactor/<scope>` — refactoring
- `chore/<scope>` — tooling, config, maintenance
- `docs/<topic>` — documentation

Do not commit directly to `main`, and do not force-push shared branches you did not create.
