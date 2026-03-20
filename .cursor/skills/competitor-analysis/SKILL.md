# Competitor Analysis

Analyze competitors and generate battlecards, feature comparisons, and strategic insights.

## When to Use

Use this skill when you need to:
- Understand how competitors solve a specific problem
- Create a battlecard for sales/positioning
- Identify feature gaps
- Benchmark a new feature idea
- Prepare for competitive discussions

## Trigger Commands

- "Analyze competitor [name]"
- "Create battlecard for [competitor]"
- "Compare [feature] with competitors"
- "Benchmark [topic] vs market"
- "Competitive analysis of [area]"

## Instructions

### Step 1: Clarify Scope

Ask the user:

1. **Competitor(s):** Which competitor(s) to analyze?
2. **Focus:** Which area/feature? (checkout, payments, UX, pricing, etc.)
3. **Objective:** What decision will this inform? (PRD, positioning, roadmap)

### Step 2: Research (Using Web Search)

Use the WebSearch tool to gather information about:
- Competitor's feature set in the focus area
- Pricing and positioning
- Recent updates and announcements
- User reviews and feedback
- Market perception

### Step 3: Generate Analysis

```markdown
# Competitive Analysis: [Focus Area]

| Metadata | Value |
|----------|-------|
| **Date** | [YYYY-MM-DD] |
| **Competitors Analyzed** | [List] |
| **Focus Area** | [Area] |

---

## Executive Summary

[3-5 sentences summarizing key competitive insights and implications]

---

## 1. Competitor Profiles

### [Competitor 1]

| Attribute | Details |
|-----------|---------|
| **Company** | [Name, HQ, Founded] |
| **Target Market** | [Who they serve] |
| **Positioning** | [How they position] |
| **Pricing Model** | [How they charge] |

**Strengths:** [bullets]
**Weaknesses:** [bullets]

---

## 2. Feature Comparison

| Feature | Our Product | [Comp 1] | [Comp 2] |
|---------|-------------|----------|----------|
| [Feature A] | Full / Partial / No | Full / Partial / No | Full / Partial / No |

---

## 3. Pricing Comparison

| Plan/Tier | Our Product | [Comp 1] | [Comp 2] |
|-----------|-------------|----------|----------|
| Entry | [Price] | [Price] | [Price] |
| Growth | [Price] | [Price] | [Price] |

---

## 4. User Perception

### What Users Love About Competitors
| Competitor | Common Praise | Source |
|------------|---------------|--------|

### What Users Complain About
| Competitor | Common Complaints | Opportunity for Us |
|------------|-------------------|---------------------|

---

## 5. Strategic Implications

### Where We Win
| Area | Our Advantage | How to Leverage |
|------|---------------|-----------------|

### Where We Lose
| Area | Their Advantage | How to Close Gap |
|------|-----------------|------------------|

### Feature Gaps to Address
| Gap | Priority | Effort | Impact |
|-----|----------|--------|--------|

---

## 6. Battlecard (Sales-Ready)

### Positioning Statement vs [Main Competitor]

Unlike [Competitor] that [weakness], our product [strength], enabling customers to [benefit].

### Objection Handling

| Objection | Response |
|-----------|----------|
| "But [Competitor] has X" | [How to respond] |

### Win Themes
1. **[Theme 1]:** [Why we win]
2. **[Theme 2]:** [Why we win]

---

## 7. Recommendations

### Immediate Actions
1. [Action to take now]

### Roadmap Considerations
| Feature/Initiative | Priority | Rationale |
|--------------------|----------|-----------|

### Monitor
- [Competitor move to watch]
- [Market trend to track]

---

## 8. Sources

| Source | Type | Date Accessed |
|--------|------|---------------|

---
*Generated: [YYYY-MM-DD]*
*Review quarterly or when competitors make significant moves*
```

## File Naming

Save as: `documents/COMPETITIVE-[competitor-or-area]-[YYYY-MM-DD].md`

## Quality Checklist

- [ ] Data is from reliable sources
- [ ] Analysis is objective (not dismissive of competitors)
- [ ] Implications are actionable
- [ ] Battlecard is sales-ready
- [ ] Sources are documented
