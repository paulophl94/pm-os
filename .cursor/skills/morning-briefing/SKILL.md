# Morning Briefing

Start your day with a comprehensive briefing integrating Google Calendar, Jira initiatives, and Fireflies meeting summaries.

## When to Use

Use this skill when you need to:
- Start your workday with context on what's happening
- See today's agenda and meeting schedule from Google Calendar
- Get a summary of recent meetings and action items
- See status of Subscriptions and B2B initiatives in Jira
- See what each squad (Subscriptions and B2B) is working on this week
- Generate proposed to-do's for the day
- Catch up after time away

## Trigger Commands

- "Morning briefing"
- "Começar o dia"
- "Briefing do dia"
- "Status do dia"
- "Resumo da semana"

## Instructions

When the user triggers a morning briefing, execute the following steps:

### Step 0: Start Webapp Servers

Before generating the briefing, ensure the webapp servers are running so the user can view the results.

**Check if servers are already running:**
```bash
# Check if backend (port 3001) and frontend (port 3000) are running
lsof -i :3000 -i :3001 | grep LISTEN
```

**If NOT running, start both servers:**

```bash
# Start backend (runs in background)
cd ~/Desktop/pm-toolkit/webapp/backend && npm run dev &

# Wait for backend to initialize
sleep 3

# Start frontend (runs in background)  
cd ~/Desktop/pm-toolkit/webapp/frontend && npm run dev &
```

Use `block_until_ms: 0` to run these as background processes since they are long-running dev servers.

**Verify servers started:**
After starting, wait a few seconds and check the terminal output or run:
```bash
curl -s http://localhost:3001/health || echo "Backend not ready"
curl -s http://localhost:3000 > /dev/null && echo "Frontend ready" || echo "Frontend not ready"
```

**If servers fail to start:**
- Check if `node_modules` exists in both `backend/` and `frontend/` folders
- If not, run `npm install` in each folder first
- Check `.env` file exists with `GEMINI_API_KEY` configured

**Note:** Only start servers if they're not already running. Don't restart servers that are already healthy.

### Step 0b: Update Repositories

Pull the latest changes from `develop` on Subscriptions and B2B repositories (monolith excluded).

**Run in parallel (independent operations):**

```bash
# Subscriptions repo
cd ~/Documents/Subs.\ Repo && git pull origin develop

# B2B microservice (Price Engine)
cd ~/Documents/your-repo && git pull origin develop
```

**Important:**
- Use `block_until_ms: 15000` since these are quick operations
- Run both pulls in parallel since they are independent
- If a repo has uncommitted changes, the pull will fail — note this in the briefing as a warning so the user can handle it manually
- If a pull fails for any other reason (network, auth), log it as a warning and continue with the rest of the briefing

**On success, note:**
```
✅ Repositórios atualizados (develop)
```

**On partial failure:**
```
⚠️ Falha ao atualizar [repo name]: [error]. Verifique manualmente.
```

### Step 0c: Load Planning Context

Read the planning hierarchy files to inform the briefing narrative:

```
Read: @to_do's/quarter-goals.md
Read: @to_do's/week-priorities.md
Read: @to_do's/commitments.md (if exists)
```

**Purpose:** These files provide the strategic context for the briefing:
- `quarter-goals.md` informs the "Foco da Semana" section with quarter-level progress
- `week-priorities.md` provides the Top 3 priorities that should anchor the day
- `commitments.md` surfaces promises that need follow-up

**If files don't exist yet:** Skip gracefully. The briefing works without them but is better with them.

### Step 0d: Load Person Pages for Today's Meetings

After fetching calendar events (Step 1c) and Fireflies meetings (Step 1-2), identify the key participants for today's meetings. Use **calendar attendees as the primary source** (since they show who will be in today's meetings), supplemented by Fireflies data for recent meeting context. For each participant:

```
Check: @context/people/Firstname-Lastname.md
```

**If person page exists:** Extract:
- Last meeting topic and date
- Open items (what you owe them, what they owe you)
- Key context notes

**If person page does NOT exist:** Note it for the "Meeting Prep" section — suggest creating one after the meeting.

### Step 0e: Load Recent Cursor Chat Context

Scan past Cursor chat transcripts to understand what was worked on recently. This provides continuity between sessions.

**Transcript location:** Check your Cursor workspace's `agent-transcripts/` folder.

**Procedure:**

1. List all `.jsonl` files in the agent-transcripts folder
2. Filter to files modified in the last 48 hours (by modification time)
3. If no files found, skip gracefully — this step is additive, not required
4. For each recent transcript (max 5, most recent first):
   a. Read the file (each line is a JSON object representing a message)
   b. Extract from **user messages** (`role: "user"`) and **assistant messages** (`role: "assistant"`):
      - Key topics/themes discussed
      - Documents created or edited (look for file paths in tool calls)
      - Decisions made or options explored
      - Unfinished work or open threads (questions asked but not resolved)
   c. Classify by domain: B2B, Subscriptions, General/Toolkit

**Extraction heuristics:**
- Tool calls with `Write` or `StrReplace` → documents created/edited
- Tool calls with `Read` on `documents/` or `global-context/` → context that was consulted
- User messages mentioning "tomorrow", "amanha", "depois", "next" → pending follow-ups
- Last user message in the chat → may indicate where work stopped

**Performance guard:** Transcripts can be large. Read only the first 200 and last 100 lines of each file to capture the start (topic) and end (where work left off). If a transcript is under 300 lines, read it fully.

**If folder is empty or no recent transcripts:** Skip silently. The briefing works without this step.

**Output:** A structured summary to be used in Step 4 (briefing generation):

```
Cursor Sessions (últimas 48h):
- [Chat title/topic]: [What was worked on]. [Documents created/edited]. [Open threads if any].
- [Chat title/topic]: [Summary]. [Status: completed/in-progress].
```

### Step 1: Fetch Fireflies Meetings (Last 7 Days)

Use the Fireflies MCP to get recent meetings:

```
Tool: fireflies_get_transcripts
Arguments:
  fromDate: [7 days ago in ISO 8601 format]
  toDate: [today in ISO 8601 format]
  mine: true
  limit: 20
```

**Important:** Include meetings from both domains (Subscriptions and B2B). Categorize each meeting by domain based on title, participants, and content keywords (e.g., "B2B", "wholesale", "price table" = B2B; "subscription", "metaplan", "recurrence" = Subscriptions). Cross-domain or general meetings should appear under both domains where relevant.

### Step 1c: Fetch Google Calendar Events (Today)

Use the Zapier MCP to get today's calendar events. This is the **primary source for today's schedule** (Fireflies only has meetings that already happened and were recorded).

```
MCP Server: user-Zapier
Tool: google_calendar_find_events
Arguments:
  instructions: "Find all events scheduled for today"
  output_hint: "event title, start time, end time, attendees (names and emails), location, description, conference link"
  end_time: "[today at 00:00 in ISO 8601]"
  start_time: "[today at 23:59 in ISO 8601]"
  expand_recurring: "true"
```

**Extract from each event:**
- Event title and time (start/end)
- Attendees (names and emails)
- Location or video call link (Meet/Zoom)
- Brief description if available

**Categorize by domain** using the same logic as Fireflies:
- Keywords "B2B", "wholesale", "atacado", "price table" → B2B
- Keywords "subscription", "metaplan", "recurrence", "assinatura" → Subscriptions
- Everything else → General

**Also fetch tomorrow's events** if the user might benefit from advance prep (e.g., Monday briefings should preview Tuesday):

```
MCP Server: user-Zapier
Tool: google_calendar_find_events
Arguments:
  instructions: "Find all events scheduled for tomorrow"
  output_hint: "event title, start time, end time, attendees (names and emails)"
  end_time: "[tomorrow at 00:00 in ISO 8601]"
  start_time: "[tomorrow at 23:59 in ISO 8601]"
  expand_recurring: "true"
```

**Meeting count:** Count today's meetings — this determines P1 capacity in Step 4 (4+ meetings → max 2 P1s).

**Important:** Calendar events complement Fireflies data. Calendar shows what's **scheduled** (future), Fireflies shows what **happened** (past with recordings). Use calendar as the primary source for today's agenda and meeting prep.

### Step 2: Get Meeting Summaries

For each relevant meeting found, get the summary:

```
Tool: fireflies_get_summary
Arguments:
  transcriptId: [meeting ID from step 1]
```

Extract from each summary:
- Meeting title and date
- Key topics discussed
- Action items (with owners if identified)
- Decisions made
- Open questions

### Step 3: Fetch Jira Issues (Subscriptions)

First, get the Atlassian Cloud ID if not cached:

```
Tool: getAccessibleAtlassianResources
Arguments: {}
```

Then search for Subscriptions issues:

```
Tool: searchJiraIssuesUsingJql
Arguments:
  cloudId: <YOUR_CLOUD_ID>
  jql: "project = YOUR_PROJECT AND status in ('In Progress', 'To Do', 'Blocked', 'In Review') ORDER BY priority DESC, updated DESC"
  maxResults: 30
  fields: ["summary", "status", "priority", "assignee", "updated", "labels"]
```

**Note:** 
- Cloud ID: `<YOUR_CLOUD_ID>` (get via `getAccessibleAtlassianResources`)
- Project code: `YOUR_PROJECT`
- Board URL: https://your-org.atlassian.net/jira/software/projects/YOUR_PROJECT/boards/XXX

### Step 3b: Fetch Jira Issues (B2B)

Search for B2B issues in progress:

```
Tool: searchJiraIssuesUsingJql
Arguments:
  cloudId: <YOUR_CLOUD_ID>
  jql: "project = YOUR_PROJECT2 AND status in ('In Progress', 'In Development', 'In Review', 'To Do', 'Blocked') ORDER BY priority DESC, updated DESC"
  maxResults: 20
  fields: ["summary", "status", "priority", "assignee", "updated", "labels"]
```

**Note:** 
- Project code: `YOUR_PROJECT2`
- Board URL: https://your-org.atlassian.net/jira/software/c/projects/YOUR_PROJECT/boards/XXX/backlog

### Step 4: Generate Briefing (NARRATIVE FORMAT)

**IMPORTANT:** The briefing should be written in a conversational, Chief of Staff style. Write as if you're a trusted advisor giving the user a quick overview of their day. Be direct, insightful, and actionable.

**Tone Guidelines:**
- Write in first person as if talking directly to the user
- Be concise but complete - no fluff
- Highlight what truly matters for today
- Connect dots between meetings, issues, and priorities
- Use natural language, not bullet-heavy lists in the overview sections

Save the briefing to `@to_do's/briefings/YYYY-MM-DD.md` with this format:

```markdown
---
date: YYYY-MM-DD
---

# Morning Briefing - YYYY-MM-DD

## Visao Geral do Dia

[Write 2-3 paragraphs as a Chief of Staff would brief their executive. Cover:
- What's the most critical thing happening today?
- Today's meeting load (from calendar): how many meetings, key ones to prepare for
- What needs the user's immediate attention?
- Quick context on the state of key initiatives
- If Cursor transcripts were loaded (Step 0e): reference what was worked on yesterday and any open threads that should continue today

Example:
"Hoje o foco principal e o **rollout para Brasil** - estamos na reta final com 70-80 contas Enterprise previstas para liberacao. Clara confirmou que os materiais de onboarding estao prontos, mas ainda precisamos resolver a questao das metricas do dashboard que esta reportando apenas 31 lojas.

Voce tem reuniao com Alejo as 14h para revisar os docs de comunicacao. Antes disso, vale dar um ping no Matias sobre o status dos Card Data events - ontem ele mencionou que ainda ha eventos faltantes."]

## Prioridades da Semana (de week-priorities.md)

[Reference the Top 3 from `@to_do's/week-priorities.md`. Show each priority with its connection to quarter goals and current status. If the file doesn't exist, write a generic "Foco da Semana" section instead.]

| # | Prioridade | Conecta a | Status Hoje |
|---|------------|-----------|-------------|
| 1 | [Priority from week-priorities.md] | [Quarter goal] | [Current status based on Jira/meetings] |
| 2 | [Priority] | [Quarter goal] | [Status] |
| 3 | [Priority] | [Quarter goal] | [Status] |

**Contexto do quarter:** [1-2 sentences connecting today's work to quarter-goals.md progress. Example: "Estamos em ~50% do GMV target de Subscriptions com 6 semanas restantes no quarter."]

## Trabalho Recente no Cursor

[If Step 0e found recent transcripts, summarize what was worked on. Group by domain. Highlight open threads that might need follow-up today.]

| Sessao | Dominio | O que foi feito | Status |
|--------|---------|-----------------|--------|
| [Chat topic/title] | B2B / Subs / Geral | [Brief description of work done, documents created] | Concluido / Em andamento |

**Threads abertos:** [List any unfinished work or follow-ups detected from the last messages of recent chats. Example: "One-pager de metricas B2B criado — falta validar targets com Alejo."]

[If no recent transcripts found, omit this section entirely.]

## Atencao Imediata

[Include staleness alerts here if detected:]

**Items parados (staleness detection):**
- Check `@to_do's/tasks.md` for tasks that have been pending for 5+ days without completion
- Check `@to_do's/commitments.md` for commitments older than 3 days
- If found, list them with a warning icon and days pending:
  - "⏰ **[Task/Commitment]** - pendente ha X dias. [Suggestion to resolve or escalate]"
- If no stale items, omit this sub-section

**Acoes criticas:**
- **[Item 1]** - [Brief context on why this needs attention now]
- **[Item 2]** - [Brief context]
- **[Item 3]** - [Brief context]

## Agenda do Dia

[Show the full schedule from Google Calendar. This gives the user a quick visual of how the day is structured.]

| Horario | Reuniao | Participantes | Link |
|---------|---------|---------------|------|
| [HH:MM - HH:MM] | [Event title] | [Key attendee names] | [Meet/Zoom link if available] |

**Carga do dia:** [X reunioes, Y horas em calls]. [Comment on meeting load — e.g., "Dia pesado de reunioes — foque as P1s nos intervalos." or "Dia leve — bom para deep work."]

[If tomorrow has notable meetings, add: "**Amanha:** [brief preview of key meetings]"]

## Meeting Prep

[For each meeting today (from Google Calendar), check if person pages exist in `@context/people/`. If they do, include prep context. Use Fireflies data from recent meetings with the same participants to add extra context.]

### [Meeting title] - [time]
- **Participantes:** [names from calendar attendees]
- **Ultima vez:** [date and topic from person page or recent Fireflies meeting, or "Sem historico registrado"]
- **Open items:** [What you owe them / what they owe you, from person page]
- **Contexto recente:** [If Fireflies has a recent meeting with the same person, mention key topics/decisions]
- **Sugestao:** [What to focus on in this meeting based on context]

[If no person page exists for a participant, note: "Sem person page para [Name] -- considere criar uma apos a reuniao."]

[If no meetings today (calendar is empty), omit both Agenda and Meeting Prep sections.]

## Iniciativas dos Times

[This section shows what each squad is working on this week based on Jira issues in progress.]

### Subscriptions (SUB)

| Key | Titulo | Responsavel | Status |
|-----|--------|-------------|--------|
| [PROJ-XXX](https://your-org.atlassian.net/browse/PROJ-XXX) | Issue title | Assignee name | In Progress |

### B2B

| Key | Titulo | Responsavel | Status |
|-----|--------|-------------|--------|
| [PROJ2-XXX](https://your-org.atlassian.net/browse/PROJ2-XXX) | Issue title | Assignee name | In Progress |

## Today's Three (P1)

**REGRA: Maximo 3 P1s.** Se o dia tem 4+ reunioes, reduzir para 2 P1s. Nao deixe o usuario se sobrecarregar.

[Select the 3 most impactful tasks for today, prioritizing:
1. Tasks connected to this week's Top 3 priorities
2. Stale commitments that need resolution
3. Blockers that affect others]

- [ ] **[Task 1]** - [context] *(conecta a: [week priority #])*
- [ ] **[Task 2]** - [context] *(conecta a: [week priority #])*
- [ ] **[Task 3]** - [context] *(conecta a: [week priority #])*

### Tambem no Radar (P2)
- [ ] [Actionable task with context]
- [ ] [Actionable task with context]

---
*Gerado em: [timestamp]*
```

### Step 5: Update Progress Log

**Always** append a new entry to `@to_do's/progress-log.md` with:

```markdown
## YYYY-MM-DD (Dia da Semana)

### Highlights
- [Key points from meetings and status]

### Decisoes Importantes
- [Decisions made in meetings]

### Blockers Ativos
- [Current blockers]

### Action Items Criticos
- [ ] [Most important action items]

### Notas
- [Additional context]

---
```

This builds historical context to help provide better assistance over time.

### Step 6: Update Tasks

**ALWAYS** update `@to_do's/tasks.md` automatically without asking:
- Keep all existing tasks
- Add new P1 items to "Hoje - P1" section (max 3 P1s — "Today's Three" rule)
- Add new P2 items to "Hoje - P2" section
- Add meetings to schedule in "Para Agendar" section
- Update the "Atualizado" date at the top
- If a task has been in P1 for 5+ days without completion, add a "⏰" prefix to flag it

### Step 7: Notify User

After saving, inform the user:

> Briefing salvo! Acesse o webapp em http://localhost:3000

**Important:** Since we started the servers in Step 0, the webapp should already be available. If the user reports connection issues, check the terminal outputs for errors.

## MCP Tools Reference

### Google Calendar (via Zapier MCP)

| Tool | Purpose |
|------|---------|
| `google_calendar_find_events` | Find events for a date range (today's agenda) |
| `google_calendar_find_busy_periods_in_calendar` | Find busy time slots |
| `google_calendar_find_calendars` | List available calendars |

### Fireflies

| Tool | Purpose |
|------|---------|
| `fireflies_get_transcripts` | List meetings with filters |
| `fireflies_get_summary` | Get meeting summary and action items |
| `fireflies_get_transcript` | Get full transcript (if needed) |

### Atlassian (Jira)

| Tool | Purpose |
|------|---------|
| `getAccessibleAtlassianResources` | Get Cloud ID |
| `searchJiraIssuesUsingJql` | Search issues with JQL |
| `getJiraIssue` | Get single issue details |

## Error Handling

### Google Calendar Not Available
If Zapier MCP or Google Calendar is not responding:
```
⚠️ Nao foi possivel conectar ao Google Calendar. Agenda do dia nao disponivel — continuando com Fireflies e Jira...
```
If calendar fails, the Meeting Prep section should still attempt to use Fireflies data for recent meeting context, but won't have today's scheduled meetings.

### Fireflies Not Available
If Fireflies MCP is not responding:
```
⚠️ Nao foi possivel conectar ao Fireflies. Continuando com Calendar e Jira...
```

### Jira Not Available
If Atlassian MCP is not responding:
```
⚠️ Nao foi possivel conectar ao Jira. Continuando com dados do Fireflies...
```

### No Meetings Found
If no meetings in the last 7 days:
```
📭 Nenhuma reuniao encontrada nos ultimos 7 dias no Fireflies.
```

### Project Not Found
If the Jira project code is incorrect:
```
❓ Projeto SUBS nao encontrado. Qual e o codigo do projeto de Subscriptions no Jira?
```

## Customization

### Adjusting Time Range

The default is 7 days for meetings. To adjust:
- "Morning briefing da ultima semana" - 7 days
- "Morning briefing dos ultimos 3 dias" - 3 days
- "Morning briefing do mes" - 30 days

### Filtering by Labels/Components

If needed, add filters:
- "Morning briefing so de Subscriptions"
- "Morning briefing so de P1"

## Quality Checklist

Before presenting the briefing:
- [ ] Google Calendar events fetched for today (or error noted)
- [ ] Fireflies data fetched (or error noted)
- [ ] Jira SUB data fetched (or error noted)
- [ ] Jira B2B data fetched (or error noted)
- [ ] "Agenda do Dia" section populated from calendar events
- [ ] "Iniciativas dos Times" section populated with both squads
- [ ] Meetings categorized by domain (Subscriptions/B2B/General)
- [ ] Narrative sections written in conversational tone
- [ ] Week priorities loaded from `week-priorities.md` (or noted as missing)
- [ ] Quarter goals referenced for strategic context
- [ ] Today's Three: max 3 P1s (2 if 4+ meetings from calendar)
- [ ] Staleness check: tasks >5 days and commitments >3 days flagged
- [ ] Cursor transcripts: recent sessions scanned (or noted as empty)
- [ ] Meeting prep: person pages checked for today's calendar attendees
- [ ] File saved to correct location for webapp