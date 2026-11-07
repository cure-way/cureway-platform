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

## Styling

Tailwind's container scale is remapped to breakpoint widths in this project:
`max-w-md` is 768px and `max-w-2xl` is 1440px, not 448px and 672px. Use an
explicit value such as `max-w-[28rem]` for dialogs, cards and other non-page
containers. See docs/design-system/TOKENS.md.

Typography uses the `text-t-*` scale (36/30/25/21/17/14/12/10/8). There is no
`text-t-16`, `-18`, `-20` or `-24`; those silently apply no font size. Keep
readable text at 12px or larger on mobile.
