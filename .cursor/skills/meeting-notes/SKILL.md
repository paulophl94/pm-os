# Meeting Notes Processor

Process meeting transcripts and notes to extract actionable insights, decisions, and next steps.

## When to Use

Use this skill when you have:
- Transcriptions from meetings (Zoom, Google Meet, etc.)
- Handwritten or typed meeting notes
- Audio transcripts from user interviews
- Notes from stakeholder conversations

## Trigger Commands

- "Processar notas da reunião"
- "Extrair action items desta reunião"
- "Resumir meeting notes"
- "Criar follow-up da reunião"

## Instructions

When the user provides meeting content, follow this process:

### Step 1: Request Input

Ask for the meeting content if not provided:

> Por favor, cole a transcrição ou notas da reunião. Informe também:
> - Tipo de reunião (planning, review, 1:1, stakeholder, discovery)
> - Participantes principais
> - Objetivo da reunião (se conhecido)

### Step 2: Process Content

Extract and organize:

1. **Key Decisions Made**
   - What was decided
   - Who made the decision
   - Rationale (if mentioned)

2. **Action Items**
   - Task description
   - Owner (if assigned)
   - Deadline (if mentioned)
   - Priority (infer if not explicit)
   - Task ID: assign `#T-MMDD-N` for P1 items or items that will be tracked in `tasks.md`

3. **Discussion Highlights**
   - Main topics discussed
   - Key arguments/perspectives
   - Areas of agreement/disagreement

4. **Open Questions**
   - Questions raised but not answered
   - Topics needing follow-up research

5. **Risks & Blockers**
   - Problems identified
   - Dependencies mentioned
   - Concerns raised

### Step 3: Generate Output

Create a structured document:

```markdown
# Meeting Summary: [Title/Topic]

| Metadata | Value |
|----------|-------|
| **Date** | [YYYY-MM-DD] |
| **Type** | [planning/review/discovery/stakeholder/1:1] |
| **Participants** | [Names] |
| **Duration** | [If known] |

---

## TL;DR

[2-3 sentences summarizing the meeting outcome]

---

## Decisions Made

| Decision | Owner | Rationale |
|----------|-------|-----------|
| [Decision 1] | [Who decided] | [Why] |
| [Decision 2] | [Who decided] | [Why] |

---

## Action Items

| Task | Owner | Due Date | Priority |
|------|-------|----------|----------|
| [ ] [Task 1] | [Name] | [Date] | P1/P2/P3 |
| [ ] [Task 2] | [Name] | [Date] | P1/P2/P3 |
| [ ] [Task 3] | [Name] | [Date] | P1/P2/P3 |

---

## Discussion Summary

### Topic 1: [Name]
- [Key point]
- [Key point]
- **Conclusion:** [What was concluded]

### Topic 2: [Name]
- [Key point]
- [Key point]
- **Conclusion:** [What was concluded]

---

## Open Questions

- [ ] [Question needing follow-up]
- [ ] [Question needing research]

---

## Risks & Blockers Identified

| Risk/Blocker | Impact | Owner | Mitigation |
|--------------|--------|-------|------------|
| [Risk 1] | [H/M/L] | [Who to address] | [Suggested action] |

---

## Next Steps

1. [Immediate next step]
2. [Follow-up meeting if needed]
3. [Documents to create]

---

## Relevant Quotes

> "[Important quote from meeting]"
> — [Speaker]

---

*Processed: [YYYY-MM-DD]*
*Next meeting: [If scheduled]*
```

### Step 4: Update Person Pages

After processing the meeting, **automatically** update person pages for key participants:

1. **Check if person page exists** in `@context/people/`:
   - Look for `Firstname-Lastname.md` or `Firstname.md`
   - If NOT found, **create one** using the template from `@context/people/_TEMPLATE.md`

2. **Update existing person pages** with:
   - Add entry to "Historico de Reunioes" table (date, topic, decisions, action items)
   - Update "Open Items" sections:
     - "Eu devo a esta pessoa": commitments the user made to this person
     - "Esta pessoa deve a mim": commitments this person made to the user
   - Add relevant notes to "Notas" section if new context was revealed

3. **Tell the user** which person pages were created or updated:
   ```
   Person pages atualizadas:
   - Raphael-Ribeiro.md (atualizado: nova reuniao + 2 action items)
   - [New] Clara.md (criado com contexto da reuniao)
   ```

### Step 5: Update Commitments Tracker

**Automatically** update `@to_do's/commitments.md` with new commitments extracted from the meeting.

Each commitment receives a **unique ID** for cross-file tracking: `^c-YYYYMMDD-NNN` (date of the meeting + sequential number).

1. For each action item where **the user is the owner**, add to "Eu devo (pendentes)"
2. For each action item where **someone else is the owner**, add to "Outros devem a mim (pendentes)"
3. Include: ID, what, who, date, and meeting context

**Format:**
```
- [ ] `^c-20260321-001` [O que] → para [Quem] → desde [YYYY-MM-DD] → contexto: [Meeting title]
```

**ID Rules:**
- Check existing IDs in commitments.md to avoid duplicates
- Increment NNN sequentially within the same date (001, 002, 003...)
- Use the same ID when referencing this commitment in person pages or tasks.md
- When completing a commitment, keep the ID: `- [x] ^c-20260321-001 ...`

### Step 6: Suggest Follow-ups

Based on the meeting content, suggest:
- Documents that should be created (PRD, One-Pager, etc.)
- People who should be informed
- Meetings that should be scheduled

## Special Processing Rules

### For Discovery/Interview Meetings

- Extract merchant pain points
- Capture verbatim quotes
- Identify patterns if multiple interviews
- Suggest adding to research input document

### For Planning Meetings

- Focus on commitments made
- Extract sprint/quarter goals
- Identify dependencies
- Note capacity concerns

### For Stakeholder Meetings

- Capture feedback and concerns
- Note approval/sign-off status
- Identify political dynamics
- Track alignment status

### For 1:1 Meetings

- Respect privacy - ask before documenting
- Focus on actionable items
- Note career/growth topics if relevant
- Track recurring themes

## File Naming

Save as: `documents/MEETING-[type]-[topic]-[YYYY-MM-DD].md`

Examples:
- `MEETING-discovery-checkout-pain-points-2026-01-27.md`
- `MEETING-planning-q1-roadmap-2026-01-27.md`
- `MEETING-stakeholder-promotions-review-2026-01-27.md`

## Quality Checklist

Before finalizing:
- [ ] All action items have owners
- [ ] Decisions are clearly stated
- [ ] Open questions are documented
- [ ] Nothing confidential is exposed inappropriately
- [ ] Follow-up steps are actionable
- [ ] Person pages created/updated for all key participants
- [ ] Commitments added to `@to_do's/commitments.md`
- [ ] Open items synced to relevant person pages
