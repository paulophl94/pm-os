# Atlassian Integration Helper

Format documents for Confluence and generate Jira ticket templates. Integrates with Atlassian MCP when configured.

## When to Use

Use this skill when you need to:
- Format a document for Confluence
- Create Jira ticket templates
- Prepare user stories for Jira
- Export PRD content to Confluence format
- Generate epic/story/task structure

## Trigger Commands

- "Formatar para Confluence"
- "Criar tickets Jira para [feature]"
- "Exportar PRD para Confluence"
- "Gerar estrutura de épico para [feature]"
- "Preparar user stories para Jira"

## MCP Integration Status

Check if Atlassian MCP is configured:

> **Note:** O MCP do Atlassian precisa de autenticação. 
> Se configurado, posso criar tickets e páginas diretamente.
> Se não configurado, vou gerar templates que você pode copiar/colar.
>
> Para configurar: Cursor Settings > MCP > Atlassian > Authenticate

## Instructions

### Confluence Formatting

When converting a document to Confluence format:

#### 1. Request Source Document

> Por favor, indique qual documento quer exportar para Confluence:
> - Cole o conteúdo aqui, ou
> - Referencie um documento existente (ex: @documents/PRD-xxx.md)

#### 2. Apply Confluence Formatting

Convert Markdown to Confluence wiki markup:

**Heading Conversion:**
```
# H1 -> h1. Title
## H2 -> h2. Title
### H3 -> h3. Title
```

**Table Conversion:**
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```
Becomes:
```
|| Header 1 || Header 2 ||
| Cell 1 | Cell 2 |
```

**Formatting:**
```
**bold** -> *bold*
*italic* -> _italic_
`code` -> {{code}}
```

**Info Panels:**
```
{info}
This is an info panel
{info}

{note}
This is a note panel
{note}

{warning}
This is a warning panel
{warning}
```

**Status Macros:**
```
{status:colour=Green|title=Done}
{status:colour=Yellow|title=In Progress}
{status:colour=Red|title=Blocked}
```

#### 3. Generate Confluence Page Structure

```
h1. [Document Title]

{info}
*Last Updated:* [Date]
*Owner:* [Name]
*Status:* {status:colour=Yellow|title=Draft}
{info}

----

h2. Executive Summary

[Content]

----

h2. Problem Statement

[Content]

----

h2. Proposed Solution

[Content with panels, tables, etc.]

----

{expand:Click to see details}
[Expandable content for appendices]
{expand}
```

### Jira Ticket Generation

When generating Jira tickets:

#### 1. Identify Ticket Structure

Ask:
> Para gerar tickets Jira, preciso saber:
> 1. **Tipo:** Epic, Story, Task, Bug, Sub-task?
> 2. **Projeto:** Qual o código do projeto Jira? (ex: PROMO, CHECKOUT)
> 3. **Sprint:** Qual sprint (se aplicável)?
> 4. **Assignee:** Quem será responsável?

#### 2. Epic Template

```markdown
## Epic: [Epic Title]

**Project:** [PROJECT_KEY]
**Epic Name:** [Name]
**Summary:** [One-line summary]

### Description

h3. Objective
[What this epic accomplishes]

h3. Success Metrics
* [Metric 1]
* [Metric 2]

h3. Scope
*In Scope:*
* [Item 1]
* [Item 2]

*Out of Scope:*
* [Item 1]

h3. Dependencies
* [Dependency 1]

h3. Acceptance Criteria
* [Criteria 1]
* [Criteria 2]

---

**Labels:** [label1, label2]
**Components:** [component1]
**Fix Version:** [version]
```

#### 3. Story Template

```markdown
## Story: [Story Title]

**Project:** [PROJECT_KEY]
**Epic Link:** [Epic Key]
**Story Points:** [1/2/3/5/8/13]
**Priority:** [Highest/High/Medium/Low/Lowest]

### Summary
As a [persona], I want [capability] so that [benefit].

### Description

h3. Context
[Why this story exists]

h3. User Flow
# User does [action 1]
# System responds with [response]
# User sees [result]

### Acceptance Criteria

h3. Happy Path
* Given [context], when [action], then [result]
* Given [context], when [action], then [result]

h3. Edge Cases
* Given [edge case], when [action], then [result]

h3. Technical Notes
* [Note for developers]

---

**Labels:** [frontend, backend, etc.]
**Components:** [component]
**Sprint:** [Sprint Name]
```

#### 4. Task Template

```markdown
## Task: [Task Title]

**Project:** [PROJECT_KEY]
**Parent:** [Story or Epic Key]
**Priority:** [Priority]
**Assignee:** [Name]

### Description
[Clear description of what needs to be done]

### Definition of Done
* [ ] [Checklist item 1]
* [ ] [Checklist item 2]
* [ ] Code reviewed
* [ ] Tests passing
* [ ] Documentation updated

### Technical Details
[Any technical specifications]

---

**Labels:** [labels]
**Time Estimate:** [Xh]
```

#### 5. Bug Template

```markdown
## Bug: [Bug Title]

**Project:** [PROJECT_KEY]
**Priority:** [Critical/Major/Minor/Trivial]
**Severity:** [Blocker/Critical/Major/Minor]
**Environment:** [Production/Staging/Dev]

### Summary
[One-line description of the bug]

### Steps to Reproduce
# [Step 1]
# [Step 2]
# [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots/Evidence
[Attach or describe]

### Impact
* Merchants affected: [Number/Percentage]
* Revenue impact: [If applicable]

### Workaround
[Temporary solution if available]

---

**Affects Version:** [version]
**Labels:** [bug, area]
**Components:** [component]
```

### Bulk Ticket Generation

When generating multiple tickets from a PRD:

#### 1. Parse PRD User Stories

Extract all user stories and acceptance criteria from the PRD.

#### 2. Generate Epic + Stories Structure

```markdown
# Jira Import Structure for [Feature]

## Epic
[Epic details as above]

---

## Stories

### Story 1: [Title]
[Story template]

### Story 2: [Title]
[Story template]

---

## Tasks (Technical)

### Task 1: [Title]
[Task template]

---

## Import Instructions

1. Create Epic first
2. Create Stories and link to Epic
3. Create Tasks and link to Stories
4. Adjust Story Points in refinement
5. Assign to Sprint
```

## File Naming

Save as: `documents/JIRA-[feature]-[YYYY-MM-DD].md`

Examples:
- `JIRA-checkout-optimization-2026-01-27.md`
- `CONFLUENCE-prd-promotions-2026-01-27.md`

## Quality Checklist

Before finalizing:
- [ ] All tickets have clear acceptance criteria
- [ ] Stories are sized appropriately (not too large)
- [ ] Dependencies are identified
- [ ] Labels and components are consistent
- [ ] Epic has clear success metrics
