# Daily Review

End-of-day reflection that captures learnings, closes loops, and prepares tomorrow.

## When to Use

Use this skill at the end of the workday to:
- Reflect on what was accomplished vs planned
- Capture learnings and patterns
- Identify open loops for tomorrow
- Update tasks and commitments
- Build compounding knowledge over time

## Trigger Commands

- "Daily review"
- "Review do dia"
- "Fim do dia"
- "Fechar o dia"
- "End of day"

## Instructions

When the user triggers a daily review, execute the following steps:

### Step 1: Load Today's Context

Read these files to understand what was planned and what happened:

```
Read: @to_do's/tasks.md (current tasks and completions)
Read: @to_do's/briefings/YYYY-MM-DD.md (today's morning briefing, if exists)
Read: @to_do's/week-priorities.md (this week's Top 3)
Read: @to_do's/commitments.md (if exists)
```

### Step 2: Analyze the Day

Compare what was planned vs what happened:

1. **Completadas:** Which P1 and P2 tasks were marked as done?
2. **Nao completadas:** Which P1 tasks are still open? Why? (Ask the user briefly)
3. **Nao planejadas:** Did the user work on things not in the plan? What emerged?
4. **Week priorities:** Did today's work advance the Top 3 priorities?

### Step 3: Ask Reflection Questions

Ask the user briefly (keep it lightweight, not a therapy session):

> **Quick review do dia:**
>
> 1. O que funcionou bem hoje?
> 2. Algo te travou ou atrasou?
> 3. Algo para lembrar pro futuro? (preferencia, erro a evitar, pattern)

**Important:** Keep this conversational and fast. If the user says "nada" or "tranquilo", accept it and move on. Don't insist on deep reflection every day.

### Step 4: Generate Daily Review File

Save to `@to_do's/reviews/YYYY-MM-DD.md`:

```markdown
# Daily Review - YYYY-MM-DD

## Resumo do Dia

[1-2 sentences: what defined today. Was it productive? Reactive? Meeting-heavy?]

## Completadas

- [x] [Task 1] *(P1 — conecta a: [week priority])*
- [x] [Task 2] *(P2)*

## Nao Completadas (e por que)

- [ ] [Task] — [Motivo: bloqueado por X / nao deu tempo / prioridade mudou]

## O que Emergiu (nao planejado)

- [Item that came up during the day and consumed time]

## Progresso nas Prioridades da Semana

| # | Prioridade | Avancou Hoje? | Nota |
|---|------------|---------------|------|
| 1 | [Priority] | Sim/Nao | [Brief note] |
| 2 | [Priority] | Sim/Nao | [Brief note] |
| 3 | [Priority] | Sim/Nao | [Brief note] |

## Learnings

- [O que funcionou — para repetir]
- [O que nao funcionou — para evitar]
- [Pattern ou preferencia a lembrar]

## Open Loops para Amanha

- [ ] [Task que ficou pendente]
- [ ] [Follow-up que precisa acontecer]
- [ ] [Commitment que esta ficando velho]

---
*Review feito em: [timestamp]*
```

### Step 5: Update Tasks

**Automatically** update `@to_do's/tasks.md`:

1. Archive today's completed tasks to a "Concluidas [date]" section
2. Move incomplete P1 tasks to tomorrow (keep them in "Hoje - P1")
3. If any task has been in P1 for 5+ consecutive days, add "⏰" prefix
4. Update the "Atualizado" timestamp

### Step 6: Update Learnings (if any)

If the user shared learnings or patterns:

1. **Preferences** (how they like to work): Append to `@to_do's/learnings/preferences.md`
2. **Patterns/Errors** (things to avoid): Append to `@to_do's/learnings/patterns.md`

Format for each entry:
```markdown
### YYYY-MM-DD
- [Learning captured]
```

If the files don't exist yet, create them with the entry.

### Step 7: Check Stale Commitments

Read `@to_do's/commitments.md` (if exists) and flag any commitment older than 3 days:

> **Commitments pendentes ha mais de 3 dias:**
> - [Commitment] — desde [date] (X dias). Resolver amanha ou escalar?

### Step 8: Update Session Log

**Automatically** update `@to_do's/session-log.md` with context for tomorrow's session:

1. Add a new entry at the top of the file (below the header)
2. Include: what was being worked on, pending decisions, suggested next steps
3. Keep max 5 entries — remove oldest if needed

```markdown
## YYYY-MM-DD HH:MM

**Trabalhando em:** [main document/feature/analysis in progress]
**Decisões pendentes:** [choices awaiting input or follow-up]
**Próximos passos:** [what to pick up next session]
**Contexto relevante:** [1-2 lines of context that would otherwise be lost]
```

### Step 9: Career Evidence Check

Ask briefly (skip if user says "pular" or seems in a hurry):

> Algo hoje vale registrar como **evidência de carreira**? (decisão estratégica, impacto mensurável, liderança, skill diferenciadora)

If yes, append to `@to_do's/learnings/career-evidence.md` using the format defined there.

### Step 10: Notify User

Summarize the review:

> **Review do dia salvo!**
>
> - X tarefas completadas, Y pendentes
> - [Key learning if any]
> - [Stale commitments if any]
> - [Career evidence captured, if any]
> - Amanha: [Top open loop]
> - Session context salvo para continuidade

## Tone Guidelines

- Be direct and honest but not judgmental
- If nothing was completed, don't make the user feel bad — focus on "what's the plan for tomorrow?"
- Keep the whole process under 5 minutes
- Celebrate small wins — completing something connected to week priorities deserves a quick note

## Error Handling

### No Briefing Today
If no morning briefing exists for today:
- Skip the "planned vs actual" comparison
- Just ask what was done today and capture it

### No Tasks File
If `tasks.md` doesn't exist or is empty:
- Create the review based purely on the user's verbal input
- Suggest running a morning briefing tomorrow
