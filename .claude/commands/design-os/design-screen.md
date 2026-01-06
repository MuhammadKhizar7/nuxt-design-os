---
description: Create a screen design for a section
---

# Design Screen

You are helping the user create a screen design for a section of their product. The screen design will be a props-based Vue 3 component that can be exported and integrated into any Vue/Nuxt codebase.

## Step 1: Check Prerequisites

First, identify the target section and verify that `spec.md`, `data.json`, and `types.ts` all exist.

Read `/product/roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple sections, use the `notify_user` tool to ask which section the user wants to create a screen design for.

Then verify all required files exist:

- `product/sections/[section-id]/spec.md`
- `product/sections/[section-id]/data.json`
- `types/section.ts` (or specific section types if split)

If spec.md doesn't exist:
"I don't see a specification for **[Section Title]** yet."

If data.json doesn't exist:
"I don't see sample data for **[Section Title]** yet."

## Step 2: Check for Design System and Shell

Check for optional enhancements:

**Design Tokens:**

- Check if `product/design-system/colors.json` exists
- Check if `product/design-system/typography.json` exists

**Shell:**

- Check if `app/components/shell/AppShell.vue` exists

## Step 3: Analyze Requirements

Read and analyze:

1. **spec.md**
2. **data.json**

Identify what views are needed.

## Step 4: Clarify the Screen Design Scope

If needed, ask user which view to build first.

## Step 5: Frontend Design Skill

Refer to best practices for high-quality Vue 3 + Tailwind implementations.

## Step 6: Create the Props-Based Component

Create the main component file at `app/components/sections/[section-id]/[ViewName].vue`.

### Component Structure

- Script Setup (TS)
- Props definition (using types)
- Emits definition
- Template
- Styles (Tailwind)

**Example:**

```vue
<script setup lang="ts">
import type { X } from '~~/types/section'
// ...
</script>
```

### Design Requirements

- Mobile responsive (Tailwind `sm:`, `md:`, `lg:`)
- Dark mode support (`dark:` classes)
- Use design tokens if available

## Step 7: Create Sub-Components (If Needed)

Create sub-components at `app/components/sections/[section-id]/[SubComponent].vue`.

## Step 8: Create the Preview Wrapper

Create a preview wrapper at `app/pages/sections/[section-id]/screen-designs/[ViewName].vue`.

This wrapper:

- Imports sample data from `product/sections/[section-id]/data.json` (or uses `useSectionData` composable!)
- Passes data to the component
- Handles events with console.logs
- Renders inside AppShell if available

**Example using composables:**

```vue
<script setup lang="ts">
import { useSectionData } from '~/app/composables/useSectionData'
// ...
</script>
```

## Step 9: Confirm and Next Steps

Notify user that the screen design is created and where to find it.

- Component: `app/components/sections/[section-id]/[ViewName].vue`
- Preview: `app/pages/sections/[section-id]/screen-designs/[ViewName].vue`
