# PRD Creation Workflow

A structured 6-phase process for creating high-quality Product Requirements Documents using the PM Toolkit.

---

## Quick Start

Already know the process? Here's the TL;DR:

1. **Foundation** → Pick template: Carl's (complex) | Lenny's (lightweight) | AI (default)
2. **Context** → Verify `context/` files are populated, run `@context-generator.mdc` if needed
3. **Refine** → Use Socratic questioning to sharpen your thinking
4. **Generate** → Create 3 PRD versions (Conservative, Balanced, Ambitious)
5. **Review** → Get feedback from Engineer, Executive, and User Researcher personas
6. **Finalize** → Address feedback, document decisions, complete PRD

**Result:** A stakeholder-ready PRD with documented rationale.

---

## When to Use This Process

### Use the Full 6-Phase Process When:

- Building a new major feature or product area
- The feature has significant technical complexity
- Multiple stakeholders need alignment
- The feature represents a strategic bet
- You need to justify resource allocation to leadership

### Use an Abbreviated Process When:

| Scenario | Skip These Phases |
|----------|-------------------|
| Quick iteration on existing feature | Phases 1, 2 (context exists), 4 (single version) |
| Bug fix or minor enhancement | Use lightweight template only, skip reviews |
| Internal tooling with clear scope | Skip Phase 4 (single version), reduce reviewers |
| Prototype or experiment | Skip Phase 5-6, mark as "Draft/Experimental" |

---

## Phase 1: Choose Foundation

**Goal:** Select the right PRD template for your feature's complexity and audience.

### Template Comparison

| Template | Best For | Sections | Time to Complete |
|----------|----------|----------|------------------|
| **Carl's Template** | Complex features, multiple stakeholders, enterprise | Problem + Solution Alignment, Key Flows, Milestones | 2-4 hours |
| **Lenny's Template** | Quick iterations, clear scope, startup pace | 8 essential questions | 30-60 minutes |
| **AI Template** (default) | Comprehensive coverage, stakeholder presentations | 15 sections including Press Release | 1-2 hours |

### Decision Guide

```
Is this a major strategic feature?
├── YES → Carl's Template or AI Template
└── NO → Is stakeholder alignment critical?
    ├── YES → Carl's Template
    └── NO → Lenny's Template
```

### Template Locations

- **Carl's:** `prd-instructions/prd-templates/Carls-PRD-Template.md`
- **Lenny's:** `prd-instructions/prd-templates/Lennys-PRD-Template.md`
- **AI (default):** `.cursor/rules/prd-template.mdc` (auto-loaded)

### Prompt to Use

```
I want to create a PRD for [FEATURE NAME].

Use [Carl's / Lenny's / the default] template.

The feature is [brief 1-2 sentence description].
Target timeframe: [Q1 2026 / 2 sprints / 6 weeks / etc.]
```

---

## Phase 2: Build Context

**Goal:** Ensure your product context and user research are populated before generating the PRD.

### Context Checklist

Before proceeding, verify these files contain real data (not just placeholders):

| File | What It Contains | Priority |
|------|------------------|----------|
| `.cursor/rules/product-context.mdc` | Core product info (auto-loaded) | Required |
| `context/PRODUCT.md` | Product details, features, metrics | Required |
| `context/USERS.md` | User personas | Required |
| `context/COMPETITIVE.md` | Competitive landscape | Recommended |
| `context/TERMINOLOGY.md` | Product vocabulary | Optional |

### If Context Is Missing

Use the Context Generator wizard:

```
@context-generator.mdc

My product is: [1-line product description]
```

The AI will generate:
- Problem statements
- Business fields
- Target customers
- Solution components
- Differentiator
- Product summary

### If Personas Are Missing

```
@persona-template.mdc

Create personas for [product name] targeting [customer segment].
```

### Context Quality Check

Your context is ready when you can answer:

- [ ] Who are the 2-3 primary user personas?
- [ ] What are the top 3 problems we solve?
- [ ] What differentiates us from competitors?
- [ ] What are this quarter's priorities?
- [ ] What metrics define success?

---

## Phase 3: Sharpen Thinking

**Goal:** Use Socratic questioning to refine your feature idea before writing the PRD.

### The Five Question Categories

Reference: `prd-instructions/socratic-questioning.md`

Pick 3-5 questions total from these categories:

#### 1. Problem Clarity
> "What specific user pain point does this solve?"

Look for concrete examples, not abstract statements.
- Good: "Users waste 10 minutes finding task context across 5 tools"
- Bad: "Users want better productivity"

#### 2. Solution Validation
> "Why is this the right solution for that problem?"

Watch for solutions looking for problems. "This is the only way" is a red flag.

#### 3. Success Criteria
> "How will we know if this feature is successful?"

Push for specific, measurable outcomes—both quantitative and qualitative.

#### 4. Constraints & Trade-offs
> "What are we NOT going to do as part of this?"

Clear non-goals prevent scope creep.

#### 5. Strategic Fit
> "Why is this the right feature to build RIGHT NOW?"

Tests urgency and opportunity cost.

### Prompt to Use

```
I'm planning to build [FEATURE NAME].

Before I write the PRD, help me sharpen my thinking using the Socratic questioning framework from @socratic-questioning.md.

Here's my initial idea:
[2-3 sentences describing the feature]

Ask me 3-5 questions to help clarify my thinking.
```

### Expected Output

After this phase, you should have clear answers for:

- [ ] Specific problem statement with evidence
- [ ] Rationale for why THIS solution
- [ ] Concrete success criteria (quantitative + qualitative)
- [ ] Explicit scope boundaries (what's in, what's out)
- [ ] Strategic narrative for why this matters now

---

## Phase 4: Generate Options

**Goal:** Create 3 distinct PRD versions to compare scope, complexity, and trade-offs.

### The Three Versions

| Version | Scope | Timeline | Risk | Best When |
|---------|-------|----------|------|-----------|
| **Conservative** | MVP only, core problem | Shortest | Lowest | Uncertain market, limited resources, need to validate |
| **Balanced** | Core + key enhancements | Moderate | Medium | Clear problem, reasonable resources, some validation |
| **Ambitious** | Full vision | Extended | Higher | High conviction, strong resources, strategic priority |

### Prompt to Use

```
Based on my refined feature idea for [FEATURE NAME], generate 3 PRD versions:

**Version A: Conservative**
- Minimal viable scope
- Fastest path to shipping
- What's the smallest thing that solves the core problem?

**Version B: Balanced**
- Optimal scope with reasonable timeline
- Best trade-off between value and effort
- What would we build if we had [X weeks/sprints]?

**Version C: Ambitious**
- Full vision implementation
- Extended timeline acceptable
- What's the complete solution if resources weren't constrained?

For each version, provide:
1. Scope summary (3-5 bullets)
2. Key features included/excluded
3. Estimated effort (S/M/L)
4. Main trade-offs
5. Recommended for: [situation]
```

### Comparison Framework

After generating, compare versions on:

| Criteria | Conservative | Balanced | Ambitious |
|----------|--------------|----------|-----------|
| Time to ship | | | |
| % of problem solved | | | |
| Technical risk | | | |
| User value delivered | | | |
| Strategic alignment | | | |
| Learning opportunity | | | |

### Selecting Your Version

Choose based on:
- **Conservative** if: Market uncertain, need validation, tight deadline
- **Balanced** if: Good confidence in problem, standard resources
- **Ambitious** if: Strategic priority, strong conviction, resources available

Once selected, ask the AI to generate the full PRD for that version.

---

## Phase 5: Multi-Perspective Review

**Goal:** Get structured feedback from 3 different stakeholder perspectives before finalizing.

### The Three Reviewers

| Reviewer | Perspective | Focus Areas |
|----------|-------------|-------------|
| **Engineer** | Technical Feasibility | Can we build this? How hard? What risks? |
| **Executive** | Strategic Business | Does this align with goals? What's the ROI? |
| **User Researcher** | User Needs & UX | Is this solving a real problem? Will users adopt it? |

### Review Order

Recommended sequence:

1. **User Researcher** (first) → Validates we're solving the right problem
2. **Engineer** (second) → Confirms technical feasibility
3. **Executive** (last) → Approves strategic fit and resources

### Prompts to Use

#### User Researcher Review
```
Review this PRD from a user research perspective using @user-researcher.md.

[Paste PRD or reference document]

Focus on:
- Is this solving a real user problem?
- What assumptions need validation?
- Will users understand and adopt this?
```

#### Engineer Review
```
Review this PRD from an engineering perspective using @engineer.md.

[Paste PRD or reference document]

Focus on:
- Technical feasibility and complexity
- Implementation risks and edge cases
- Performance and scalability concerns
```

#### Executive Review
```
Review this PRD from an executive perspective using @executive.md.

[Paste PRD or reference document]

Focus on:
- Strategic alignment and business impact
- Resource requirements and ROI
- Risks and stakeholder implications
```

### Collecting Feedback

For each review, capture:

| Category | Feedback | Severity | Action Needed |
|----------|----------|----------|---------------|
| [Area] | [Specific feedback] | Critical/Important/Nice-to-have | [What to do] |

---

## Phase 6: Address Feedback

**Goal:** Synthesize reviewer feedback, make strategic decisions, and finalize the PRD.

### Step 1: Consolidate Feedback

Create a feedback summary:

```markdown
## Feedback Summary

### User Researcher
- [Key point 1]
- [Key point 2]
- [Key point 3]

### Engineer
- [Key point 1]
- [Key point 2]
- [Key point 3]

### Executive
- [Key point 1]
- [Key point 2]
- [Key point 3]

### Conflicts or Tensions
- [Where reviewers disagree or have competing priorities]
```

### Step 2: Decision Matrix

For each piece of feedback, decide:

| Feedback | Decision | Rationale |
|----------|----------|-----------|
| [Feedback item] | Accept / Reject / Defer | [Why] |

**Decision options:**
- **Accept:** Incorporate into PRD now
- **Reject:** Explicitly not doing (document why)
- **Defer:** Valid but for a future iteration (add to Future Considerations)

### Step 3: Update PRD

Prompt to use:

```
Based on the feedback received, update the PRD with these changes:

**Accepted feedback to incorporate:**
- [Change 1]
- [Change 2]
- [Change 3]

**Deferred items to add to Future Considerations:**
- [Item 1]
- [Item 2]

**Rejected feedback (add to Appendix with rationale):**
- [Item 1]: Rejected because [reason]

Also add a "Decision Log" section documenting key decisions made during this review process.
```

### Step 4: Final Quality Check

Before sharing with stakeholders, verify:

#### Content Completeness
- [ ] Problem statement is specific and evidence-based
- [ ] Success metrics are measurable (SMART criteria)
- [ ] Scope is clearly defined (goals AND non-goals)
- [ ] Technical requirements are sufficient for engineering
- [ ] Risks are identified with mitigations

#### Stakeholder Readiness
- [ ] Executive summary is compelling (can stand alone)
- [ ] Timeline and milestones are realistic
- [ ] Resource requirements are explicit
- [ ] Dependencies are identified
- [ ] Open questions are listed (not hidden)

#### Process Documentation
- [ ] Decision log captures key choices and rationale
- [ ] Rejected feedback is documented with reasoning
- [ ] Future considerations list exists
- [ ] Review feedback is archived (not lost)

---

## Prompt Templates Reference

### Phase 1: Template Selection
```
I want to create a PRD for [FEATURE NAME].
Use [Carl's / Lenny's / the default] template.
The feature is [brief description].
Target timeframe: [timeframe].
```

### Phase 2: Context Generation
```
@context-generator.mdc
My product is: [1-line product description]
```

### Phase 3: Socratic Questioning
```
Help me sharpen my thinking for [FEATURE NAME] using @socratic-questioning.md.
Here's my initial idea: [2-3 sentences]
Ask me 3-5 questions to clarify my thinking.
```

### Phase 4: Generate Options
```
Generate 3 PRD versions for [FEATURE NAME]:
- Version A: Conservative (MVP)
- Version B: Balanced (optimal)
- Version C: Ambitious (full vision)
```

### Phase 5: Reviews
```
Review this PRD using @[engineer/executive/user-researcher].md
[Paste PRD]
```

### Phase 6: Finalize
```
Update the PRD incorporating this feedback:
Accepted: [list]
Deferred: [list]
Rejected with rationale: [list]
```

---

## Final Checklist

Before sharing your PRD with stakeholders:

### Process Verification
- [ ] Template selected appropriate to complexity
- [ ] Product context verified and up-to-date
- [ ] Socratic questioning completed (3-5 questions answered)
- [ ] Multiple versions considered (even if one was obvious)
- [ ] All three reviewer perspectives obtained
- [ ] Feedback addressed with documented decisions

### Document Quality
- [ ] Can be understood without verbal explanation
- [ ] Problem statement passes the "so what?" test
- [ ] Success metrics are specific and measurable
- [ ] Scope boundaries are explicit
- [ ] Risks have mitigations, not just identification
- [ ] Timeline is realistic given team capacity

### Stakeholder Readiness
- [ ] Executive summary works as standalone
- [ ] Engineering has enough detail to estimate
- [ ] Design has enough context to explore
- [ ] Leadership can approve with confidence

---

## Output

Save your completed PRD to:

```
documents/PRD-[feature-name]-[YYYY-MM-DD].md
```

Example: `documents/PRD-user-authentication-2026-01-24.md`

---

*This workflow integrates with the PM Toolkit. See `README.md` for full toolkit documentation.*
