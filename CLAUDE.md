# CLAUDE.md — PM OS

AI-powered Product Management operating system built on Cursor.

Identity, preferences and protocols live in `.cursor/rules/*.mdc` (source of truth):

- `product-context.mdc` — Product identity, domains, paths, preferences, triggers, context loading
- `session-protocol.mdc` — Session-start protocol, feature discovery, session continuity, MCP fallbacks
- `pm-coach.mdc` — Coaching protocols (next steps, career insights, improvement capture, skill rating, usage tracking)
- `pm-workflows.mdc` — Document generation workflows and post-document protocol
- `progress-tracker.mdc` — Initiative progress tracking
- `todos.mdc` — Personal task management, task IDs, commitment IDs, natural language triggers
- `formatting-preferences.mdc` — Formatting and Mermaid diagrams
- `.cursor/skills/` — Detailed workflows (briefing, meeting notes, reviews, career review)

---

## Workspace Map

```
pm-os/
├── .cursor/rules/            # AI rules and document templates
├── .cursor/skills/           # Detailed workflows (briefing, meeting notes, reviews, career)
├── context/
│   ├── people/               # Person pages for stakeholders
│   ├── USERS.md              # User personas
│   └── TERMINOLOGY.md        # Product terminology
├── documents/                # Generated documents output
├── examples/                 # Sample outputs for each template (demo mode)
├── frameworks/               # Strategy frameworks (Rumelt, DHM, SWOT, etc.)
├── global-context/           # Product strategy, vision, KPIs (create per domain)
├── prd-instructions/         # Alternative PRD templates
└── to_do's/                  # Tasks, briefings, reviews, learnings
    ├── tasks.md              # Today's tasks (with #T-MMDD-N IDs)
    ├── week-priorities.md    # Top 3 for the week
    ├── commitments.md        # Promise tracker (with ^c-YYYYMMDD-NNN IDs)
    ├── quarter-goals.md      # Quarter goals
    ├── toolkit-backlog.md    # Self-improving system backlog (^imp-NNN IDs)
    ├── session-log.md        # Session continuity context
    ├── briefings/            # Daily morning briefings
    ├── reviews/              # Daily reviews
    ├── weekly-reviews/       # Weekly syntheses
    └── learnings/            # Preferences, patterns, career evidence, usage log
```

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
| Document templates | `.cursor/rules/` (prd-template, one-pager, rice-analysis, etc.) |
| PM workflows | `.cursor/rules/pm-workflows.mdc` |
| Multi-perspective reviewers | `.cursor/rules/reviewers/` |
| Skills (briefing, reviews, meetings, career) | `.cursor/skills/` |
| Strategy frameworks | `frameworks/` |
| Sample outputs (demo mode) | `examples/` |
| People context | `context/people/` |
| Toolkit improvement backlog | `to_do's/toolkit-backlog.md` |
| Session continuity log | `to_do's/session-log.md` |
| Career evidence library | `to_do's/learnings/career-evidence.md` |
| Usage tracking (feature discovery) | `to_do's/learnings/usage-log.md` |
| Changelog | `CHANGELOG.md` |
