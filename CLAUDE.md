# CLAUDE.md — PM OS

AI-powered Product Management operating system.

---

## Architecture

**Cursor** auto-loads `.cursor/rules/*.mdc` (with `alwaysApply: true`) — those files are the canonical source of truth for all protocols. This file exists as a lean reference and entry point for editors that don't support `.mdc` (e.g., Claude Code).

**If your editor loaded this file but NOT the `.mdc` rules**, read these files at session start to get full protocol definitions:

| Protocol | Source file |
|---|---|
| Session Protocol (silent checks, staleness alerts, MCP fallbacks) | `.cursor/rules/session-protocol.mdc` |
| Product Context (product identity, domains, triggers, context loading) | `.cursor/rules/product-context.mdc` |
| PM Coach (next steps, career insights, improvement capture, usage tracking) | `.cursor/rules/pm-coach.mdc` |
| People Context (auto-inject stakeholder pages) | `.cursor/rules/people-context.mdc` |
| Formatting Preferences (no blockquotes, Mermaid neutral theme) | `.cursor/rules/formatting-preferences.mdc` |

---

## Workspace Map

```
pm-os/
├── .cursor/rules/            # AI rules and document templates (canonical protocols)
├── .cursor/skills/           # Detailed workflows (briefing, meeting notes, meeting prep, reviews)
│   ├── atlassian-helper/
│   ├── competitor-analysis/
│   ├── daily-review/
│   ├── meeting-notes/
│   ├── meeting-prep/
│   ├── metrics-analyzer/
│   ├── morning-briefing/
│   └── weekly-review/
├── context/
│   ├── people/               # Person pages for stakeholders
│   ├── USERS.md              # User personas
│   └── TERMINOLOGY.md        # Product terminology
├── documents/                # Generated documents output
├── frameworks/               # Strategy frameworks (Rumelt, DHM, SWOT, etc.)
├── global-context/           # Product strategy, vision, KPIs (create per domain)
│   ├── shared/               # Pillars, assumptions, glossary, invariants
│   └── {domain}/             # DOMAIN-VISION, KPIS, ROADMAP, ARCHITECTURE
├── prd-instructions/         # Alternative PRD templates
├── webapp/                   # Web dashboard (Briefing, Tasks, Commitments, Initiatives, People)
│   ├── frontend/             # React + Vite (port 3000)
│   └── backend/              # Express API (port 3002)
└── to_do's/                  # Tasks, briefings, reviews, learnings
    ├── tasks.md              # Today's tasks (Today's Three) with ^pm- IDs
    ├── week-priorities.md    # Top 3 for the week
    ├── commitments.md        # Tracked promises with ^pm- IDs
    ├── quarter-goals.md      # Quarter goals
    ├── toolkit-improvements.md # Ranked improvement ideas with impact/effort
    ├── briefings/            # Daily morning briefings
    ├── reviews/              # Daily reviews
    ├── weekly-reviews/       # Weekly syntheses
    └── learnings/            # Preferences, patterns, skill ratings, usage-log
```

---

## Document Generation Workflows

When the user requests a document, read the relevant template before generating:

| Document | Template | Output path |
|----------|----------|------------|
| PRD (Lean) | `.cursor/rules/lean-prd-template.mdc` | `documents/PRD-[feature]-[date].md` |
| PRD (Full) | `.cursor/rules/prd-template.mdc` | `documents/PRD-[feature]-[date].md` |
| One-Pager | `.cursor/rules/one-pager-template.mdc` | `documents/ONE-PAGER-[feature]-[date].md` |
| Requirements Spec | `.cursor/rules/pm-workflows.mdc` (Workflow 2) | `documents/SPEC-[feature]-[date].md` |
| User Stories | `.cursor/rules/user-story-template.mdc` | `documents/USER-STORIES-[feature]-[date].md` |
| RICE Analysis | `.cursor/rules/rice-analysis.mdc` | `documents/RICE-[topic]-[date].md` |
| Risk Analysis | `.cursor/rules/risk-analysis.mdc` | `documents/RISK-ANALYSIS-[feature]-[date].md` |
| Lean Canvas | `.cursor/rules/lean-canvas.mdc` | `documents/LEAN-CANVAS-[product]-[date].md` |
| Roadmap | `.cursor/rules/roadmap-template.mdc` | `documents/ROADMAP-[period]-[date].md` |
| Epic Plan | `.cursor/rules/epic-generator.mdc` | `documents/EPIC-PLAN-[feature]-[date].md` |
| KPI-Revenue | `.cursor/rules/kpi-revenue.mdc` | `documents/KPI-REVENUE-[feature]-[date].md` |
| Status Update | `.cursor/rules/status-update-template.mdc` | `documents/STATUS-[topic]-[date].md` |
| Personas | `.cursor/rules/persona-template.mdc` | `documents/PERSONAS-[segment]-[date].md` |
| Positioning | `.cursor/rules/product-positioning.mdc` | `documents/POSITIONING-[product]-[date].md` |
| User Journey | `.cursor/rules/user-journey.mdc` | `documents/USER-JOURNEY-[flow]-[date].md` |

**After generating any document**, automatically:
1. Update `pm-progress.json` with new phase
2. Check/create person pages in `context/people/` if people are mentioned
3. Add action items with owners to `to_do's/commitments.md`
4. Suggest next step (PM Coach Protocol 1)

### Multi-Perspective Review

When asked to review a document, apply these perspectives in sequence:
- **User Researcher** (`.cursor/rules/reviewers/user-researcher.mdc`)
- **Engineer** (`.cursor/rules/reviewers/engineer.mdc`)
- **Executive** (`.cursor/rules/reviewers/executive.mdc`)
- **Customer** (`.cursor/rules/reviewers/customer.mdc`) — optional
- **Customer Success** (`.cursor/rules/reviewers/customer-success.mdc`) — optional

Consolidate into a table: Reviewer | Feedback | Severity | Action

---

## Task Management

Files: `to_do's/tasks.md` (today), `to_do's/backlog.md` (future/P3), `to_do's/commitments.md` (tracked promises)

Priorities: P1 = urgent/blockers (max 3/day, max 2 if many meetings) | P2 = important not urgent | P3 → backlog

Task ID format: `^pm-YYYYMMDD-NNN` (e.g., `^pm-20260323-001`)
- When completed, search `to_do's/`, `documents/`, `context/people/` and mark complete everywhere
- Add timestamp: `- [x] Task text (^pm-20260323-001) ✅2026-03-23`

Pillar alignment: When adding P1 tasks, check `global-context/shared/pillars.md` and tag if connected: `[Pillar: B2B Growth]`

---

## Safety & Scope

- **Markdown only.** Don't generate code unless explicitly asked.
- **Never delete files** without confirmation.
- **Git safety:** Never commit/push without approval. Never force push.
- **Secrets:** Never include API keys, tokens, or credentials in files.
- **Scope control:** Only modify what was requested. If you notice improvements, mention but don't implement without asking.

---

## Quick Reference

| Resource | Location |
|---|---|
| Core protocols (alwaysApply) | `.cursor/rules/session-protocol.mdc`, `product-context.mdc`, `pm-coach.mdc`, `people-context.mdc` |
| Document templates | `.cursor/rules/` (prd-template, one-pager, rice-analysis, etc.) |
| PM workflows | `.cursor/rules/pm-workflows.mdc` |
| Multi-perspective reviewers | `.cursor/rules/reviewers/` |
| Skills (briefing, reviews, meetings) | `.cursor/skills/` |
| Strategy frameworks | `frameworks/` |
| People context | `context/people/` |
| Web dashboard | `webapp/` (run with `npm run dev` in backend + frontend) |

---

## Editor Compatibility

This system works with any AI coding assistant:
- **Cursor** — full experience via `.cursor/rules/*.mdc` (auto-loaded) + `.cursor/skills/`. This file is loaded but kept lean to avoid duplication.
- **Claude Code** — reads this file automatically, then follows the Architecture table above to load protocol files.
- **Other editors** — load this file as system context; it will instruct the AI to read the protocol source files.

Canonical protocols live in `.cursor/rules/`. Templates and detailed workflows live in `.cursor/rules/` and `.cursor/skills/`.
