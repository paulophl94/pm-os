# Career Review

Synthesize career evidence into actionable self-reviews, promotion assessments, and weekly reports for your manager.

## When to Use

- Preparing for a performance review or self-assessment
- 1:1 with manager where you want to discuss growth
- Assessing promotion readiness
- Generating a weekly/monthly accomplishments report

## Trigger Commands

- "Career review"
- "Preparar self-review"
- "Promotion readiness"
- "Resumo de carreira"
- "Weekly report para manager"
- "O que eu conquistei este quarter?"

## Instructions

### Step 1: Load Career Context

```
Read: @to_do's/learnings/career-evidence.md (all captured evidence)
Read: @to_do's/quarter-goals.md (current quarter objectives)
Read: @to_do's/weekly-reviews/ (recent weekly reviews for context)
Read: @to_do's/learnings/preferences.md (working style for tone)
```

### Step 2: Determine Mode

Ask the user which mode they want (or infer from trigger):

1. **Weekly Report** — Quick summary of this week's accomplishments for manager
2. **Monthly Reflection** — Patterns and growth areas over the past month
3. **Self-Review** — Comprehensive review for performance cycle
4. **Promotion Assessment** — Gap analysis against next-level expectations

### Mode 1: Weekly Report

Generate a concise report suitable for sharing with manager:

```markdown
# Weekly Accomplishments — YYYY-MM-DD

## Key Deliverables
- [Accomplishment 1 with impact]
- [Accomplishment 2 with impact]

## In Progress
- [Initiative and current status]

## Blockers / Need Help
- [If any]

## Next Week Focus
- [Top priority]
```

### Mode 2: Monthly Reflection

Synthesize the month's evidence into patterns:

```markdown
# Monthly Career Reflection — Month YYYY

## Accomplishments by Competency

### Strategic Thinking
- [Evidence 1 with date and impact]
- [Evidence 2]

### Execution
- [Evidence]

### Leadership
- [Evidence]

### Data-Driven
- [Evidence]

### Stakeholder Management
- [Evidence]

## Patterns
- **Strongest area this month:** [Competency] — [why]
- **Growth opportunity:** [Competency] — [what to do differently]
- **Recurring theme:** [pattern across evidence]

## Quarter Goal Alignment
| Goal | This Month's Contribution | On Track? |
|------|---------------------------|-----------|
```

### Mode 3: Self-Review

Comprehensive self-assessment:

```markdown
# Self-Review — [Period]

## Summary
[2-3 sentences capturing overall performance narrative]

## Accomplishments by Impact

### High Impact
| Date | What | Competency | Impact |
|------|------|------------|--------|

### Medium Impact
| Date | What | Competency | Impact |
|------|------|------------|--------|

## Competency Assessment

| Competency | Self-Rating (1-5) | Evidence Count | Key Example |
|------------|-------------------|----------------|-------------|
| Strategic Thinking | X | N | [Best example] |
| Execution | X | N | [Best example] |
| Leadership | X | N | [Best example] |
| Data-Driven | X | N | [Best example] |
| Stakeholder Mgmt | X | N | [Best example] |
| Technical Depth | X | N | [Best example] |

## Growth Areas
- [Area 1]: [Specific action to improve]
- [Area 2]: [Specific action to improve]

## Goals for Next Period
1. [Goal tied to growth area]
2. [Goal tied to quarter objectives]
```

### Mode 4: Promotion Assessment

Gap analysis against next-level expectations:

```markdown
# Promotion Readiness Assessment

## Current Level: [Level]
## Target Level: [Next Level]

## Gap Analysis

| Competency | Current | Expected at Next Level | Gap | Action |
|------------|---------|------------------------|-----|--------|
| Strategic Thinking | [Rating + evidence] | [Expectation] | [Gap size] | [What to do] |
| ... | ... | ... | ... | ... |

## Strongest Case For Promotion
- [Top 3 pieces of evidence that support promotion]

## Biggest Gaps to Close
- [Gap 1]: [Specific plan with timeline]
- [Gap 2]: [Specific plan with timeline]

## Recommended Timeline
[Assessment of when promotion would be realistic, based on gap analysis]
```

### Step 3: Generate Output

Based on the selected mode, generate the appropriate document.

If in self-review or promotion mode, ask the user:
> Quer que eu salve como documento em `documents/`? (ex: `CAREER-self-review-2026-Q1.md`)

### Step 4: Suggest Next Steps

Based on findings:
- If gaps identified → suggest specific actions
- If strong evidence → suggest discussing with manager
- If low evidence count → suggest capturing more during daily reviews

## Tone Guidelines

- Professional but honest — this is for the user's growth
- Evidence-based — every claim backed by specific examples
- Actionable — every gap comes with a concrete next step
- Encouraging — highlight strengths before gaps
