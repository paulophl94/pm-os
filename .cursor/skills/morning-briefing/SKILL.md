# Morning Briefing

Start your day with a comprehensive briefing integrating your calendar, project tracker, and meeting summaries.

## When to Use

Use this skill when you need to:
- Start your workday with context on what's happening
- See today's agenda and meeting schedule
- Get a summary of recent meetings and action items
- See status of active initiatives
- Generate proposed to-do's for the day
- Catch up after time away

## Trigger Commands

- "Morning briefing"
- "Start the day"
- "What's on today"
- "Daily briefing"
- "Status of the day"

## Instructions

When the user triggers a morning briefing, execute the following steps:

### Step 1: Load Planning Context

Read the planning hierarchy files to inform the briefing narrative:

```
Read: @to_do's/quarter-goals.md
Read: @to_do's/week-priorities.md
Read: @to_do's/commitments.md (if exists)
```

**Purpose:** These files provide the strategic context for the briefing:
- `quarter-goals.md` informs the weekly focus section with quarter-level progress
- `week-priorities.md` provides the Top 3 priorities that should anchor the day
- `commitments.md` surfaces promises that need follow-up

**If files don't exist yet:** Skip gracefully. The briefing works without them but is better with them.

### Step 2: Load Person Pages for Today's Meetings

After fetching calendar events (Step 3), identify the key participants. For each participant:

```
Check: @context/people/Firstname-Lastname.md
```

**If person page exists:** Extract last meeting topic/date, open items, key context notes.
**If not:** Note it for Meeting Prep — suggest creating one after the meeting.

### Step 3: Fetch Calendar Events (Today)

Use your calendar MCP (Zapier, Google Calendar, etc.) to get today's events.

**Extract from each event:**
- Event title and time (start/end)
- Attendees (names)
- Location or video call link
- Brief description if available

**Meeting count:** Count today's meetings — this determines P1 capacity (4+ meetings -> max 2 P1s).

**If calendar MCP is unavailable:**
```
Calendar not available. Continuing with other data sources...
```

### Step 4: Fetch Meeting Summaries (Last 7 Days)

If a meeting transcription MCP is available (Fireflies, Otter, etc.), fetch recent meetings.

**Extract from each summary:**
- Meeting title and date
- Key topics discussed
- Action items (with owners if identified)
- Decisions made
- Open questions

**If meeting MCP is unavailable:** Skip gracefully, continue with other data.

### Step 5: Fetch Project Tracker Issues

If a project tracker MCP is available (Jira, Linear, etc.), fetch active issues.

**Query:** Active issues (In Progress, To Do, Blocked, In Review) ordered by priority.

**If tracker MCP is unavailable:** Skip gracefully, continue with other data.

### Step 6: Generate Briefing (NARRATIVE FORMAT)

**IMPORTANT:** Write in a conversational, Chief of Staff style. Be direct, insightful, and actionable.

Save the briefing to `@to_do's/briefings/YYYY-MM-DD.md` with this format:

```markdown
---
date: YYYY-MM-DD
---

# Morning Briefing - YYYY-MM-DD

## Day Overview

[Write 2-3 paragraphs as a Chief of Staff would brief their executive. Cover:
- What's the most critical thing happening today?
- Today's meeting load: how many meetings, key ones to prepare for
- What needs immediate attention?
- Quick context on the state of key initiatives]

## Week Priorities (from week-priorities.md)

| # | Priority | Connects to | Status Today |
|---|----------|-------------|--------------|
| 1 | [Priority from week-priorities.md] | [Quarter goal] | [Current status] |
| 2 | [Priority] | [Quarter goal] | [Status] |
| 3 | [Priority] | [Quarter goal] | [Status] |

**Quarter context:** [1-2 sentences connecting today's work to quarter-goals.md progress]

## Immediate Attention

**Stale items (staleness detection):**
- Check `@to_do's/tasks.md` for tasks pending 5+ days
- Check `@to_do's/commitments.md` for commitments >3 days old
- Flag with warning and days pending

**Critical actions:**
- **[Item 1]** - [Brief context on why this needs attention now]
- **[Item 2]** - [Brief context]

## Today's Schedule

| Time | Meeting | Participants | Link |
|------|---------|--------------|------|
| [HH:MM - HH:MM] | [Event title] | [Key attendees] | [Link if available] |

**Day load:** [X meetings, Y hours in calls]. [Comment on meeting load]

## Meeting Prep

### [Meeting title] - [time]
- **Participants:** [names]
- **Last time:** [date and topic from person page, or "No history recorded"]
- **Open items:** [What you owe them / what they owe you]
- **Suggestion:** [What to focus on based on context]

## Team Initiatives

| Key | Title | Owner | Status |
|-----|-------|-------|--------|
| [ID] | Issue title | Assignee | Status |

## Today's Three (P1)

**RULE: Maximum 3 P1s.** If the day has 4+ meetings, reduce to 2 P1s.

- [ ] **[Task 1]** - [context] *(connects to: [week priority #])*
- [ ] **[Task 2]** - [context] *(connects to: [week priority #])*
- [ ] **[Task 3]** - [context] *(connects to: [week priority #])*

### Also on Radar (P2)
- [ ] [Actionable task with context]
- [ ] [Actionable task with context]

---
*Generated: [timestamp]*
```

### Step 7: Update Progress Log

**Always** append a new entry to `@to_do's/progress-log.md` with highlights, decisions, blockers, and action items.

### Step 8: Update Tasks

**Always** update `@to_do's/tasks.md` automatically:
- Keep all existing tasks
- Add new P1 items to "Today - P1" section (max 3 P1s)
- Add new P2 items to "Today - P2" section
- Update the "Updated" date at the top
- If a task has been in P1 for 5+ days, add a warning prefix to flag it

### Step 9: Notify User

After saving:
```
Briefing saved in to_do's/briefings/YYYY-MM-DD.md
```

## Error Handling

If any data source is unavailable, continue with what's available. The briefing should always be generated, even if some sections are incomplete. Note which sources were unavailable.

## Customization

### Adjusting Time Range
- "Morning briefing for last week" - 7 days
- "Morning briefing for last 3 days" - 3 days

### Filtering
- "Morning briefing for [domain] only"
- "Morning briefing P1 only"

## Quality Checklist

Before presenting the briefing:
- [ ] Calendar events fetched (or error noted)
- [ ] Meeting data fetched (or error noted)
- [ ] Project tracker data fetched (or error noted)
- [ ] Narrative sections written in conversational tone
- [ ] Week priorities loaded (or noted as missing)
- [ ] Quarter goals referenced for strategic context
- [ ] Today's Three: max 3 P1s (2 if 4+ meetings)
- [ ] Staleness check: tasks >5 days and commitments >3 days flagged
- [ ] Meeting prep: person pages checked for today's attendees
- [ ] File saved to correct location
