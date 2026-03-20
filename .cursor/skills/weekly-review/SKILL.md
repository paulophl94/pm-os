# Weekly Review

End-of-week synthesis that identifies patterns, evaluates priorities, and sets up next week.

## When to Use

Use this skill at the end of the week (Friday afternoon) to:
- Synthesize the week's work and meetings
- Evaluate progress against week priorities and quarter goals
- Identify patterns and themes across meetings
- Capture strategic learnings
- Draft next week's Top 3 priorities

## Trigger Commands

- "Weekly review"
- "Friday review"
- "Close the week"
- "Week synthesis"

## Instructions

### Step 1: Load Week Context

Read all files from this week:

```
Read: @to_do's/briefings/ (all files from this week: Mon-Fri)
Read: @to_do's/reviews/ (all daily reviews from this week, if they exist)
Read: @to_do's/week-priorities.md (this week's Top 3)
Read: @to_do's/quarter-goals.md (quarter-level progress)
Read: @to_do's/commitments.md (open and completed commitments)
Read: @to_do's/tasks.md (current state of tasks)
Read: @to_do's/learnings/ (preferences.md and patterns.md, if exist)
```

### Step 2: Fetch Week's Meetings

If a meeting transcription MCP is available, fetch this week's meetings and summaries. Extract themes, key decisions, and patterns across all meetings.

**If unavailable:** Build synthesis from briefings, tasks, and user input only.

### Step 3: Analyze the Week

Synthesize across all data sources:

1. **Week Priorities Assessment:** For each Top 3 priority — did it advance? Grade: Achieved / Partial / Not Advanced
2. **Meeting Patterns:** Recurring topics, conflicting messages, decisions that shift priorities
3. **Commitment Health:** How many closed, how many stale (>3 days)
4. **Quarter Goals Progress:** Update progress percentages, assess on-track status
5. **Learnings Synthesis:** What worked, what didn't, new preferences or patterns

### Step 4: Ask User for Input

Quick prompt:

1. What was the biggest win this week?
2. What frustrated you or didn't go as expected?
3. Anything strategic you noticed but didn't document?
4. Priorities for next week? (or want me to suggest?)

Accept brief answers. If user says "suggest", generate priorities based on analysis.

### Step 5: Generate Weekly Review File

Save to `@to_do's/weekly-reviews/YYYY-WXX.md`:

```markdown
# Weekly Review - Week XX (YYYY-MM-DD to YYYY-MM-DD)

## TL;DR

[2-3 sentences capturing the essence of the week]

## Week Priorities: How Did It Go?

| # | Priority | Result | Grade |
|---|----------|--------|-------|
| 1 | [Priority] | [What happened] | Achieved / Partial / Not Advanced |
| 2 | [Priority] | [What happened] | Grade |
| 3 | [Priority] | [What happened] | Grade |

**Analysis:** [1-2 sentences on why priorities advanced or not]

## Meetings This Week

| Day | Meeting | Key Decision | Impact |
|-----|---------|--------------|--------|
| Mon | [Meeting] | [Decision] | High/Med/Low |

**Total:** X meetings | **Recurring themes:** [theme 1, theme 2]

## Patterns and Themes

- **[Theme 1]:** [What pattern emerged]
- **[Theme 2]:** [Another recurring topic]

## Quarter Progress

| Goal | Progress | Trend | Risk |
|------|----------|-------|------|
| [Quarter goal 1] | XX% | On track / Behind / Ahead | [Risk if any] |

**Weeks remaining in quarter:** X

## Commitment Health

- **Closed this week:** X
- **Pending:** Y (Z older than 3 days)
- **New:** W

## Week Learnings

### What worked
- [Repeat these patterns]

### What didn't work
- [Fix these patterns]

### Strategic insights
- [Observations that matter for quarter goals or beyond]

## Priorities for Next Week

### Suggested Top 3

1. **[Priority 1]** — Connects to: [Quarter goal]. [Why this is #1]
2. **[Priority 2]** — Connects to: [Quarter goal]. [Why]
3. **[Priority 3]** — Connects to: [Quarter goal]. [Why]

### Also on radar
- [Item that didn't make Top 3 but matters]

---
*Review done: [timestamp]*
```

### Step 6: Update Week Priorities

**Automatically** update `@to_do's/week-priorities.md` with new Top 3.

### Step 7: Update Quarter Goals

**Automatically** update `@to_do's/quarter-goals.md` with progress percentages.

### Step 8: Capture Learnings

Append to `@to_do's/learnings/preferences.md` and `@to_do's/learnings/patterns.md` as appropriate.

## Tone Guidelines

- Analytical but not cold — this is a moment of reflection
- Celebrate wins, even small ones connected to quarter goals
- Be honest about what didn't work — focus on "what to change"
- Keep strategic insights sharp and actionable
- Process should take 10-15 minutes max
