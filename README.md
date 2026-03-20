# PM OS — An AI Operating System for Product Managers

**An AI-powered operating system for Product Managers, built on Cursor.** Document generation, daily planning, meeting intelligence, stakeholder tracking, multi-perspective reviews — all configured for your specific product. Fork it, configure your context, start shipping better documents in 10 minutes.

Built by a PM who uses this system every day to manage two product domains at a LATAM e-commerce platform. Open source (MIT). No coding required.

---

## What Pain This Removes

| Problem | How PM OS Solves It |
|---------|---------------------|
| **Context scattered across 6-8 tools** | One workspace with persistent memory. The AI resumes where yesterday left off. |
| **30 min every morning reconstructing state** | Morning briefing pulls calendar, meetings, Jira, and commitments automatically. |
| **Forgotten promises destroy credibility** | Staleness detection flags commitments >3 days and tasks >5 days with no update. |
| **Documents lack strategic alignment** | Context Loading Protocol reads your vision, KPIs, and roadmap before generating anything. |
| **PRDs approved without stress-testing** | Multi-perspective review simulates Engineer, Executive, Researcher, Customer, and CS feedback. |
| **No system for compounding knowledge** | Daily and weekly reviews capture learnings. Each session makes the next one better. |
| **Generic AI output, no product depth** | Product context file teaches the AI your product, users, terminology, and constraints. |

---

## 3-Tier Setup

Start light, grow into the full system.

### Tier 1 — Rules Only (5 minutes)

Fork the repo, fill in `product-context.mdc` with your product details, and start generating documents.

**What you get:**
- 14 document templates (PRD, One-Pager, User Stories, RICE, Risk Analysis, Lean Canvas, Roadmap, Epic Plan, KPI-Revenue, Status Update, Personas, Positioning, User Journey, Feature Docs)
- 6 multi-perspective reviewers (Engineer, Executive, User Researcher, Data Analyst, Customer, Customer Success)
- 6 strategy frameworks (Rumelt, Gibson Biddle DHM, Devil's Advocate, Impact Estimation, SWOT, Presentation Best Practices)
- PM coaching (automatic next-step suggestions, career insights)

### Tier 2 — Personal OS (15 minutes)

Set up the planning system and daily workflows.

**What you add:**
- Morning briefing, daily review, weekly review skills
- Meeting notes processor with person page updates
- Planning hierarchy: quarter goals -> week priorities -> daily tasks
- Commitment tracker with staleness detection
- Learnings capture (preferences and anti-patterns)

### Tier 3 — Full Integration (30 minutes)

Connect your tools via MCP servers.

**What you add:**
- Jira/Linear integration for live initiative tracking
- Calendar integration for automated meeting prep
- Meeting transcription (Fireflies, Otter, etc.) for automated summaries
- Slack for async communication

---

## Quick Start

### 1. Get the code

```bash
git clone https://github.com/paulophl94/pm-os.git
cd pm-os
```

Open the folder in [Cursor](https://cursor.com).

### 2. Configure your product context

Open Cursor's chat panel and type:

```
Help me fill in the product context
```

This runs the Context Generator wizard — answer a few questions about your product, and the AI fills in `.cursor/rules/product-context.mdc` for you.

Or edit `product-context.mdc` manually — replace the `<!-- TODO -->` markers with your product details.

### 3. Start generating

```
Create a PRD for [your feature]
```

The AI reads your product context, loads relevant strategy files, and generates a document aligned with your product's vision and constraints.

---

## What's Included

### Document Templates

| Command | Output | Template |
|---------|--------|----------|
| "Create PRD for [feature]" | Full PRD (15 sections) | `prd-template.mdc` |
| "Generate One-Pager for [feature]" | Strategic 1-2 page doc | `one-pager-template.mdc` |
| "Write user stories for [feature]" | Stories + Gherkin acceptance criteria | `user-story-template.mdc` |
| "Prioritize using RICE" | RICE scoring with recommendations | `rice-analysis.mdc` |
| "Analyze risks of [feature]" | Risk matrix with mitigations | `risk-analysis.mdc` |
| "Create Lean Canvas for [product]" | 9-section strategy canvas | `lean-canvas.mdc` |
| "Create roadmap for [quarter]" | Quarterly strategic plan | `roadmap-template.mdc` |
| "Generate epic plan for [feature]" | Epic structure with sub-epics | `epic-generator.mdc` |
| "Connect KPIs to revenue" | KPI-revenue linkage + North Star | `kpi-revenue.mdc` |
| "Generate status update" | Executive communication | `status-update-template.mdc` |
| "Create personas for [segment]" | Ideal + Skeptical personas | `persona-template.mdc` |
| "Create elevator pitch" | Positioning + JTBD pitch | `product-positioning.mdc` |
| "Map user journey for [flow]" | End-to-end journey map | `user-journey.mdc` |

### Multi-Perspective Reviews

Simulate a review committee before any human sees your document:

| Command | Reviewer | Focus |
|---------|----------|-------|
| "Review as engineer" | Staff Engineer | Technical feasibility, edge cases, scalability |
| "Review as executive" | VP of Product | Strategic alignment, ROI, resource justification |
| "Review as user researcher" | Senior UX Researcher | User need validation, adoption risks |
| "Review as data analyst" | Senior Data Analyst | Metrics definition, experiment design |
| "Review as customer" | 3 personas (Small/Growth/Enterprise) | Value clarity, ease of use |
| "Review as customer success" | CS Lead | Support impact, adoption, communication |

### Daily Workflow Skills

| Skill | When | What It Does |
|-------|------|-------------|
| **Morning Briefing** | Start of day | Pulls calendar, meetings, tracker, commitments. Generates Today's Three (max 3 P1). |
| **Daily Review** | End of day | Compares planned vs actual, captures learnings, preps tomorrow. |
| **Weekly Review** | Friday | Synthesizes the week, evaluates quarter progress, suggests next week's Top 3. |
| **Meeting Notes** | After any meeting | Extracts decisions, action items, updates person pages and commitments. |
| **Competitor Analysis** | As needed | Web research, feature matrix, battlecard, strategic implications. |
| **Metrics Analyzer** | Per feature | Impact estimation, experiment design, measurement plan. |

### Strategy Frameworks

| Framework | When to Use |
|-----------|-------------|
| **Rumelt Strategy Kernel** | Diagnose strategic problems, define guiding policy |
| **Gibson Biddle DHM** | Prioritize by Delight, Hard-to-copy, Margin-enhancing |
| **Devil's Advocate** | Stress-test strategies, identify blind spots |
| **Impact Estimation** | Quantify expected feature impact, size opportunities |
| **SWOT Analysis** | Map competitive position |
| **Presentation Best Practices** | Prepare product presentations, storytelling |

---

## How the Planning System Works

Everything connects — from strategic goals down to today's work:

```
%%{init: {'theme': 'neutral'}}%%
flowchart TD
    quarterGoals[Quarter Goals] --> weekPriorities[Week Priorities]
    weekPriorities --> dailyPlan[Daily Plan / Today's Three]
    quarterGoals -.-> tasks[Tasks Backlog]
    weekPriorities -.-> tasks
    tasks --> dailyPlan
    dailyPlan --> dailyReview[Daily Review]
    dailyReview -.->|Tomorrow| dailyPlan
    dailyReview -.->|Friday| weeklyReview[Weekly Review]
    weeklyReview -.->|Next week| weekPriorities
```

**Quarter Goals** (3-5 outcomes over 3 months) -> **Week Priorities** (Top 3 this week) -> **Daily Plan** (Today's Three) -> **Daily Review** (what happened) -> **Weekly Review** (patterns, next week's priorities).

Work backwards from impact: *What would make you incredibly satisfied three months from now?*

---

## The System That Improves Itself

PM OS captures learnings and improves over time:

- **Daily reviews** capture what worked and what didn't -> stored in `learnings/`
- **Weekly reviews** synthesize patterns across meetings and decisions
- **Preferences** (communication style, meeting habits) accumulate automatically
- **Anti-patterns** (mistakes to avoid) get flagged before they repeat

Day 1: helpful but generic. Week 2: knows your preferences. Month 1: adapted to your work style.

---

## Project Structure

```
pm-os/
├── .cursor/
│   ├── rules/                     # AI rules and document templates
│   │   ├── product-context.mdc    # YOUR product (fill this first)
│   │   ├── pm-coach.mdc           # Coaching protocols
│   │   ├── pm-workflows.mdc       # Document generation workflows
│   │   ├── session-protocol.mdc   # Session-start checks
│   │   ├── formatting-preferences.mdc
│   │   ├── progress-tracker.mdc   # Initiative progress
│   │   ├── todos.mdc              # Task management
│   │   ├── context-generator.mdc  # Setup wizard
│   │   ├── prd-template.mdc       # PRD template
│   │   ├── one-pager-template.mdc
│   │   ├── user-story-template.mdc
│   │   ├── rice-analysis.mdc
│   │   ├── risk-analysis.mdc
│   │   ├── lean-canvas.mdc
│   │   ├── persona-template.mdc
│   │   ├── roadmap-template.mdc
│   │   ├── epic-generator.mdc
│   │   ├── kpi-revenue.mdc
│   │   ├── status-update-template.mdc
│   │   ├── product-positioning.mdc
│   │   ├── user-journey.mdc
│   │   └── reviewers/             # Multi-perspective review personas
│   └── skills/                    # Workflow automations
│       ├── morning-briefing/
│       ├── daily-review/
│       ├── weekly-review/
│       ├── meeting-notes/
│       ├── competitor-analysis/
│       ├── metrics-analyzer/
│       └── atlassian-helper/
├── context/                       # Product context
│   ├── people/                    # Person pages (stakeholders)
│   ├── USERS.md                   # User personas
│   └── TERMINOLOGY.md            # Product terminology
├── documents/                     # Generated documents output
├── frameworks/                    # Strategy frameworks
├── to_do's/                       # Planning system
│   ├── tasks.md                   # Today's tasks
│   ├── week-priorities.md         # Top 3 for the week
│   ├── quarter-goals.md           # Quarter goals
│   ├── commitments.md             # Promise tracker
│   ├── briefings/                 # Morning briefings
│   ├── reviews/                   # Daily reviews
│   ├── weekly-reviews/            # Weekly syntheses
│   └── learnings/                 # Preferences and anti-patterns
├── CLAUDE.md                      # AI workspace instructions
├── README.md
├── QUICK-START.md                 # Decision tree for templates
└── COMMANDS.md                    # Full command reference
```

---

## Why PM OS vs Other Options

| Dimension | PM OS | Dex | Notion Templates | ChatGPT |
|-----------|-------|-----|-------------------|---------|
| **Built for** | Product Managers | Any role (31 presets) | Anyone | Anyone |
| **Platform** | Cursor-native | Claude Code + Cursor | Notion | Browser |
| **Depth** | 14 PM templates, 6 reviewers, 6 frameworks | General COS workflows | Static templates | No templates |
| **Planning system** | Quarter -> Week -> Day with staleness detection | Quarter -> Week -> Day | Manual | None |
| **License** | MIT (use anywhere) | PolyForm Noncommercial | Varies | N/A |
| **Setup** | 5-30 min (3 tiers) | 10-30 min | Minutes | None |
| **Compound learning** | Yes (daily/weekly reviews) | Yes (hooks + learnings) | No | No |
| **Cost** | Free + Cursor ($0-20/mo) | Free + Claude Code ($20/mo) | Free-Paid | Free-Paid |

---

## Contributing

Found a better template? Built a new skill? Fixed something?

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-improvement`)
3. Make your changes
4. Submit a Pull Request

Areas where contributions are especially welcome:
- New document templates (Architecture Decision Records, Post-Mortems, etc.)
- New reviewer personas (Designer, Legal, Sales)
- Localization (translate templates to other languages)
- MCP integration recipes (Linear, Notion, GitHub Issues)

---

## Origin Story

This toolkit was built over months of daily use as a Product Manager at a LATAM e-commerce platform. It started as a single `product-context.mdc` file and grew into a full operating system — one frustrated morning at a time.

The insight that changed everything: **the quality of AI output is 80% context and 20% model.** Most people spend all their effort choosing the right model and zero effort structuring their context. This toolkit is the structured context.

If you want the full story, check out the [AI-Augmented PM series on LinkedIn](#) — 9 posts covering the journey from "hammer" to "workshop."

---

## License

MIT License — use it however you want, including commercially.

---

**Ready to start?** Fork the repo, open in Cursor, type "Help me fill in the product context", and you're off.
