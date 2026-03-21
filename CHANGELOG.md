# Changelog

All notable changes to PM OS are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.1.0] - 2026-03-21

Major enhancement release inspired by comparative analysis with [Dex](https://github.com/davekilleen/Dex). Adds self-improving capabilities, career development, cross-file tracking, and session continuity.

### Added

- **Session Continuity** — `to_do's/session-log.md` persists context between sessions. `session-protocol.mdc` restores where you left off. Daily review automatically saves session context.
- **Commitment IDs** — Commitments now use unique IDs (`^c-YYYYMMDD-NNN`) for cross-file tracking between meeting notes, person pages, and commitments.md.
- **Task IDs** — Important tasks use `#T-MMDD-N` format for traceability across tasks.md, meeting notes, and person pages.
- **Self-Improving System** — Structured `toolkit-backlog.md` replaces informal improvement capture. Weekly review surfaces top 3 pending improvements by impact.
- **Usage Tracking** — `usage-log.md` records every template, skill, reviewer, and framework used. Enables feature discovery and progressive disclosure.
- **Feature Discovery** — Session protocol suggests unused templates/skills weekly based on a 4-tier maturity path (Core → Analysis → Strategic → Advanced).
- **Career Evidence Capture** — `career-evidence.md` accumulates career evidence categorized by competency. Daily review prompts for capture.
- **Career Review Skill** — New skill with 4 modes: Weekly Report, Monthly Reflection, Self-Review, and Promotion Assessment.
- **Enhanced Onboarding** — `context-generator.mdc` now configures daily rituals, tool integrations, creates initial person pages, and seeds planning files.
- **Demo Mode** — `examples/` directory with sample PRD, One-Pager, RICE Analysis, Meeting Notes, and Daily Review for new users to explore.
- **Commitment Query Commands** — "Mostrar commitments", "Commitments de [pessoa]", "Commitments velhos" for structured querying.

### Changed

- **pm-coach.mdc** — Protocol 4 now writes to structured `toolkit-backlog.md` with IDs instead of informal `toolkit-improvements.md`. Added Protocol 6 for silent usage tracking.
- **meeting-notes SKILL.md** — Action items now include task IDs (`#T-MMDD-N`) and commitment IDs (`^c-YYYYMMDD-NNN`).
- **daily-review SKILL.md** — Added Steps 8-9: session log update and career evidence check.
- **weekly-review SKILL.md** — Added Steps 9-11: toolkit improvements surfacing, usage log update, and skill ratings summary.
- **todos.mdc** — Added Task IDs section, Commitment IDs section, and commitment query commands.
- **session-protocol.mdc** — Added Feature Discovery and Session Continuity sections.
- **README.md** — Complete rewrite with pain points table, "A Day With PM OS" storytelling, expanded comparison vs Dex, cross-file tracking documentation.

---

## [1.0.0] - 2026-02-08

Initial public release.

### Added

- 14 document templates (PRD, One-Pager, User Stories, RICE, Risk Analysis, Lean Canvas, Roadmap, Epic Plan, KPI-Revenue, Status Update, Personas, Positioning, User Journey)
- 6 multi-perspective reviewers (Engineer, Executive, User Researcher, Data Analyst, Customer Success, Merchant)
- 6 strategy frameworks (Rumelt, Gibson Biddle DHM, Devil's Advocate, Impact Estimation, SWOT, Presentation Best Practices)
- 8 workflow skills (Morning Briefing, Daily Review, Weekly Review, Meeting Notes, Competitor Analysis, Metrics Analyzer, Product Research, Atlassian Helper)
- PM coaching system (next steps, career insights, English improvement, workflow improvement capture, skill ratings)
- Planning hierarchy (quarter goals → week priorities → daily tasks)
- Commitment tracker with staleness detection
- Person pages with meeting history
- Session protocol with staleness checks and MCP graceful degradation
- Context Loading Protocol (DOMAIN-VISION → Invariantes → Glossário before any document)
- Progress tracker for product initiatives (pm-progress.json)
- Learnings capture (preferences and anti-patterns)
