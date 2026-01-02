# Design Screen

You are helping the user create a screen design for a section of their product. The screen design will be a props-based Vue 3 component that can be exported and integrated into any Vue/Nuxt codebase.

## Step 1: Check Prerequisites

First, identify the target section and verify that `spec.md`, `data.json`, and `types.ts` all exist.

Read `/product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple sections, use the AskUserQuestion tool to ask which section the user wants to create a screen design for.

Then verify all required files exist:

- `product/sections/[section-id]/spec.md`
- `product/sections/[section-id]/data.json`
- `product/sections/[section-id]/types.ts`

If spec.md doesn't exist:

"I don't see a specification for **[Section Title]** yet. Please run `/shape-section` first to define the section's requirements."

If data.json or types.ts don't exist:

"I don't see sample data for **[Section Title]** yet. Please run `/sample-data` first to create sample data and types for the screen designs."

Stop here if any file is missing.

## Step 2: Check for Design System and Shell

Check for optional enhancements:

**Design Tokens:**
- Check if `/product/design-system/colors.json` exists
- Check if `/product/design-system/typography.json` exists

If design tokens exist, read them and use them for styling. If they don't exist, show a warning:

"Note: Design tokens haven't been defined yet. I'll use default styling, but for consistent branding, consider running `/design-tokens` first."

**Shell:**
- Check if `app/components/shell/AppShell.vue` exists

If shell exists, the screen design will render inside the shell in Design OS. If not, show a warning:

"Note: An application shell hasn't been designed yet. The screen design will render standalone. Consider running `/design-shell` first to see section screen designs in the full app context."

## Step 3: Analyze Requirements

Read and analyze all three files:

1. **spec.md** - Understand the user flows and UI requirements
2. **data.json** - Understand the data structure and sample content
3. **types.ts** - Understand the TypeScript interfaces and available callbacks

Identify what views are needed based on the spec. Common patterns:

- List/dashboard view (showing multiple items)
- Detail view (showing a single item)
- Form/create view (for adding/editing)

## Step 4: Clarify the Screen Design Scope

If the spec implies multiple views, use the AskUserQuestion tool to confirm which view to build first:

"The specification suggests a few different views for **[Section Title]**:

1. **[View 1]** - [Brief description]
2. **[View 2]** - [Brief description]

Which view should I create first?"

If there's only one obvious view, proceed directly.

## Step 5: Invoke the Frontend Design Skill

Before creating the screen design, read the `frontend-design` skill to ensure high-quality design output.

Read the file at `.claude/skills/frontend-design/SKILL.md` and follow its guidance for creating distinctive, production-grade interfaces.

## Step 6: Create the Props-Based Component

Create the main component file at `app/components/sections/[section-id]/[ViewName].vue`.

### Component Structure

The component MUST:

- Import types from the types.ts file
- Accept all data via props (never import data.json directly)
- Define events for all actions (or use callback props if preferred, but events are more Vue-idiomatic)
- Be fully self-contained and portable

Example:

```vue
<script setup lang="ts">
import type { InvoiceListProps } from '@/../product/sections/[section-id]/types'

const props = defineProps<InvoiceListProps>()

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'create'): void
}>()
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Component content here -->

    <!-- Example: Emitting an event -->
    <button @click="emit('create')">Create Invoice</button>

    <!-- Example: Mapping data -->
    <div v-for="invoice in props.invoices" :key="invoice.id">
      <span>{{ invoice.clientName }}</span>
      <button @click="emit('view', invoice.id)">View</button>
      <button @click="emit('edit', invoice.id)">Edit</button>
      <button @click="emit('delete', invoice.id)">Delete</button>
    </div>
  </div>
</template>
```

### Design Requirements

- **Mobile responsive:** Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and ensure the design layout works gracefully on mobile, tablet and desktop screen sizes.
- **Light & dark mode:** Use `dark:` variants for all colors
- **Use design tokens:** If defined, apply the product's color palette and typography
- **Follow the frontend-design skill:** Create distinctive, memorable interfaces

### Applying Design Tokens

**If `/product/design-system/colors.json` exists:**
- Use the primary color for buttons, links, and key accents
- Use the secondary color for tags, highlights, secondary elements
- Use the neutral color for backgrounds, text, and borders
- Example: If primary is `lime`, use `lime-500`, `lime-600`, etc. for primary actions

**If `/product/design-system/typography.json` exists:**
- Note the font choices for reference in comments
- The fonts will be applied at the app level, but use appropriate font weights

**If design tokens don't exist:**
- Fall back to `stone` for neutrals and `lime` for accents (Design OS defaults)

- **Use `class` instead of `className`**
- **Use `v-for` and `:key` for lists**
- **Use `@click` for events**

### What to Include

- Implement ALL user flows and UI requirements from the spec
- Use the prop data (not hardcoded values)
- Include realistic UI states (hover, active, etc.)
- Use emitted events for all interactive elements

### What NOT to Include

- No `import data from` statements - data comes via props
- No features not specified in the spec
- No routing logic - parent handles navigation intent
- No navigation elements (shell handles navigation)

## Step 7: Create Sub-Components (If Needed)

For complex views, break down into sub-components. Each sub-component should also be props-based.

Create sub-components at `app/components/sections/[section-id]/[SubComponent].vue`.

Example:

```tsx
import type { Invoice } from '@/../product/sections/[section-id]/types'

interface InvoiceRowProps {
  invoice: Invoice
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function InvoiceRow({ invoice, onView, onEdit, onDelete }: InvoiceRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <p className="font-medium">{invoice.clientName}</p>
        <p className="text-sm text-stone-500">{invoice.invoiceNumber}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onView}>View</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}
```

Then import and use in the main component:

```tsx
import { InvoiceRow } from './InvoiceRow'

export function InvoiceList({ invoices, onView, onEdit, onDelete }: InvoiceListProps) {
  return (
    <div>
      {invoices.map(invoice => (
        <InvoiceRow
          key={invoice.id}
          invoice={invoice}
          onView={() => onView?.(invoice.id)}
          onEdit={() => onEdit?.(invoice.id)}
          onDelete={() => onDelete?.(invoice.id)}
        />
      ))}
    </div>
  )
}
```

## Step 8: Create the Preview Wrapper

Create a preview wrapper at `app/pages/sections/[section-id]/[ViewName].vue`.

This wrapper is what Design OS renders. It imports the sample data and feeds it to the props-based component.

Example:

```vue
<script setup lang="ts">
import data from '@/../product/sections/[section-id]/data.json'
import { InvoiceList } from '@/components/sections/[section-id]/InvoiceList.vue'

const handleView = (id: string) => console.log('View invoice:', id)
const handleEdit = (id: string) => console.log('Edit invoice:', id)
const handleDelete = (id: string) => console.log('Delete invoice:', id)
const handleCreate = () => console.log('Create new invoice')
</script>

<template>
  <InvoiceList
    :invoices="data.invoices"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
    @create="handleCreate"
  />
</template>
```

The preview wrapper:

- Is a Nuxt page or component used for preview
- Imports sample data from data.json
- Passes data to the component via props
- Provides console.log handlers for events
- **Will render inside the shell** if one has been designed

## Step 9: No Index File Needed

Vue/Nuxt auto-imports usually handle component discovery, or explicit imports are used. No `index.ts` is typically needed for components unless packaging a library.

## Step 10: Confirm and Next Steps

Let the user know:

"I've created the screen design for **[Section Title]**:

**Exportable components** (props-based, portable):

- `app/components/sections/[section-id]/[ViewName].vue`
- `app/components/sections/[section-id]/[SubComponent].vue` (if created)

**Preview wrapper** (for Design OS only):

- `app/pages/sections/[section-id]/[ViewName].vue`

**Important:** The changes should be hot-reloaded.

[If shell exists]: The screen design will render inside your application shell, showing the full app experience.

[If design tokens exist]: I've applied your color palette ([primary], [secondary], [neutral]) and typography choices.

**Next steps:**

- Run `/screenshot-design` to capture a screenshot of this screen design for documentation
- If the spec calls for additional views, run `/design-screen` again to create them
- When all sections are complete, run `/export-product` to generate the complete export package"

If the spec indicates additional views are needed:

"The specification also calls for [other view(s)]. Run `/design-screen` again to create those, then `/screenshot-design` to capture each one."

## Important Notes

- ALWAYS read the `frontend-design` skill before creating screen designs
- Components MUST be props-based - never import data.json in exportable components
- The preview wrapper is the ONLY file that imports data.json
- Use TypeScript interfaces from types.ts for all props
- Use `defineProps` and `defineEmits` in `<script setup>`
- Apply design tokens when available for consistent branding
- Screen designs render inside the shell when viewed in Design OS (if shell exists)
