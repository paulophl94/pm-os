# CLAUDE.md — PM OS

AI-powered Product Management operating system built on Cursor.

Identity, preferences and protocols live in `.cursor/rules/*.mdc` (source of truth):

- `product-context.mdc` — Product identity, domains, paths, preferences, triggers, context loading
- `session-protocol.mdc` — Session-start protocol and MCP fallbacks
- `pm-coach.mdc` — Coaching protocols (next steps, career insights, improvement capture, skill rating)
- `pm-workflows.mdc` — Document generation workflows and post-document protocol
- `progress-tracker.mdc` — Initiative progress tracking
- `todos.mdc` — Personal task management, natural language triggers, learnings capture
- `formatting-preferences.mdc` — Formatting and Mermaid diagrams
- `.cursor/skills/` — Detailed workflows (briefing, meeting notes, reviews)

---

## Workspace Map

```
pm-os/
├── .cursor/rules/            # AI rules and document templates
├── .cursor/skills/           # Detailed workflows (briefing, meeting notes, reviews)
├── context/
│   ├── people/               # Person pages for stakeholders
│   ├── USERS.md              # User personas
│   └── TERMINOLOGY.md        # Product terminology
├── documents/                # Generated documents output
├── frameworks/               # Strategy frameworks (Rumelt, DHM, SWOT, etc.)
├── global-context/           # Product strategy, vision, KPIs (create per domain)
├── prd-instructions/         # Alternative PRD templates
└── to_do's/                  # Tasks, briefings, reviews, learnings
    ├── tasks.md              # Today's tasks (Today's Three)
    ├── week-priorities.md    # Top 3 for the week
    ├── commitments.md        # Tracked promises
    ├── quarter-goals.md      # Quarter goals
    ├── briefings/            # Daily morning briefings
    ├── reviews/              # Daily reviews
    ├── weekly-reviews/       # Weekly syntheses
    └── learnings/            # Preferences and patterns
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
| Skills (briefing, reviews, meetings) | `.cursor/skills/` |
| Strategy frameworks | `frameworks/` |
| People context | `context/people/` |
