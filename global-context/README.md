# Global Context

Product strategy and domain knowledge files. Create one subfolder per domain.

---

## Structure

```
global-context/
├── shared/                    # Cross-domain files
│   ├── glossary.md            # Platform-wide glossary
│   └── invariants.md          # Business rules that never change
├── {domain-1}/                # One folder per product domain
│   ├── DOMAIN-VISION.md       # Mission, strategy, positioning
│   ├── DOMAIN-KPIS.md         # Key metrics and targets
│   ├── ROADMAP.md             # Current quarter roadmap
│   ├── ARCHITECTURE.md        # Technical architecture overview
│   └── SQUAD-CONTEXT.md       # Team structure, rituals, contacts
└── {domain-2}/
    └── ...
```

## Setup

1. Create a folder for each product domain you manage
2. Copy the templates from `_TEMPLATE-DOMAIN-VISION.md` etc. into your domain folder
3. Fill in each file with your product's actual data
4. The Context Loading Protocol (in `product-context.mdc`) reads these files before generating any document

## Why This Matters

The AI reads these files before generating documents. The better your context, the more aligned and useful the output will be. Think of this as "teaching the AI your product."
