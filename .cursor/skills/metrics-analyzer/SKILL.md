# Metrics Impact Analyzer

Analyze the potential metric impact of features and help define success metrics.

## When to Use

Use this skill when you need to:
- Define success metrics for a new feature
- Estimate impact on KPIs
- Create a measurement plan
- Analyze potential ROI
- Design an experiment (A/B test)

## Trigger Commands

- "Analyze metric impact of [feature]"
- "Define success metrics for [feature]"
- "Create measurement plan for [feature]"
- "Estimate ROI of [feature]"
- "Design experiment for [feature]"

## Instructions

### Step 1: Understand the Feature

Ask:
1. **Feature:** Which functionality are we analyzing?
2. **Objective:** Main goal? (increase conversion, reduce churn, etc.)
3. **Segment:** Which users will be impacted? (all, specific segment)
4. **Baseline:** Do we have current data for the relevant metrics?

### Step 2: Connect to Value Drivers

Map the feature to your product's value drivers:

| Value Driver | Connection | Expected Direction |
|--------------|------------|-------------------|
| [Driver 1] | [How it affects] | Increase / Decrease / Neutral |
| [Driver 2] | [How it affects] | Direction |

### Step 3: Generate Analysis

```markdown
# Metrics Impact Analysis: [Feature Name]

| Metadata | Value |
|----------|-------|
| **Date** | [YYYY-MM-DD] |
| **Feature** | [Name] |
| **Owner** | [PM Name] |

---

## Executive Summary

[2-3 sentences on expected metric impact and recommended success criteria]

---

## 1. Primary Metrics (North Star Impact)

### North Star Connection

| Metric | Current | Target | Confidence |
|--------|---------|--------|------------|
| [North Star] | [Value] | [Target] | [High/Medium/Low] |

### Causal Chain

[Feature] -> [Immediate output metric] -> [Intermediate metric] -> [North Star]

---

## 2. Success Metrics (Primary)

### Metric 1: [Primary Success Metric]

| Attribute | Value |
|-----------|-------|
| **Definition** | [Exact definition and formula] |
| **Baseline** | [Current value if known] |
| **Target** | [Goal] |
| **Minimum Success Threshold** | [Minimum to consider success] |
| **Measurement Frequency** | [Daily/Weekly/Monthly] |
| **Data Source** | [Dashboard/Query/Tool] |

---

## 3. Health Metrics (Guardrails)

| Metric | Threshold | Current | Alert If |
|--------|-----------|---------|----------|
| [Metric 1] | [Must stay above X] | [Current] | [Drops below Y] |

---

## 4. Impact Estimation

| Dimension | Conservative | Expected | Optimistic |
|-----------|--------------|----------|------------|
| Users Impacted | [#/%] | [#/%] | [#/%] |
| Metric Lift | [X%] | [X%] | [X%] |
| Revenue Impact | [$] | [$] | [$] |

**Assumptions:**
1. [Assumption 1]
2. [Assumption 2]

---

## 5. Experiment Design (If Applicable)

| Parameter | Value |
|-----------|-------|
| **Hypothesis** | [Clear hypothesis] |
| **Primary Metric** | [What we're measuring] |
| **Sample Size** | [Required N] |
| **Duration** | [Days/weeks] |
| **Allocation** | [Control vs Treatment] |

### Rollout Strategy

| Phase | Audience | Criteria to Advance |
|-------|----------|---------------------|
| 1. Internal | Team + QA | No bugs, correct tracking |
| 2. Beta | [X%] segment | [Threshold] |
| 3. Gradual | 10% -> 50% | [Threshold maintained] |
| 4. GA | 100% | [Final validation] |

---

## 6. Measurement Plan

### Pre-Launch
- [ ] Baseline metrics documented
- [ ] Tracking events implemented
- [ ] Dashboard created/updated

### Post-Launch (Weekly)
- [ ] Metrics reviewed
- [ ] Health metrics checked
- [ ] Segment analysis done

### Post-Launch (30-60-90 days)
- [ ] Impact assessment completed
- [ ] ROI calculated
- [ ] Next iteration planned

---

## 7. Decision Framework

| Outcome | Criteria | Action |
|---------|----------|--------|
| **Clear Success** | Primary metric up [X%], guardrails stable | Full rollout |
| **Partial Success** | Primary metric up [Y%] | Iterate then rollout |
| **Inconclusive** | No significant change | Extend test or pivot |
| **Failure** | Primary metric down or guardrails degraded | Rollback and learn |

---
*Generated: [YYYY-MM-DD]*
```

## File Naming

Save as: `documents/METRICS-[feature]-[YYYY-MM-DD].md`

## Quality Checklist

- [ ] Primary metrics are clearly defined
- [ ] Guardrails are identified
- [ ] Estimates have documented assumptions
- [ ] Experiment design is statistically sound
- [ ] Tracking requirements are actionable
- [ ] Decision criteria are explicit
