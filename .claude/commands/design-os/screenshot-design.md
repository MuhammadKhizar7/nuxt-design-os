---
description: Capture a screenshot of a screen design
---

# Screenshot Screen Design

You are helping the user capture a screenshot of a screen design they've created.

## Step 1: Identify the Screen Design

Read `/public/product/roadmap.md` and check `app/components/sections/` to see available designs.
Auto-select if only one, or ask user.

## Step 2: Start the Dev Server

Use `run_command` to start the dev server if not running:

```bash
npm run dev
```

(Set `WaitMsBeforeAsync` to allow it to start).

## Step 3: Capture the Screenshot

Use `browser_subagent` to navigate to the screen design URL:
`http://localhost:3000/sections/[section-id]/screen-designs/[screen-design-name]`

1. Navigate to the page.
2. Wait for load.
3. Click "Hide" in navigation bar if present (to clean up the view).
4. **Use the `browser_subagent`'s reporting or screenshot capability if available, OR instruct the user to verify the recording.**
   *Note: Current agent capabilities might restricted to recording videos. If a tool to save a PNG element exists, use it. Otherwise, confirm the view visually.*

## Step 4: Save the Screenshot (If Tool Available)

If a specific screenshot tool is available, save to:
`public/product/sections/[section-id]/[filename].png`

## Step 5: Confirm Completion

Notify the user that the design has been reviewed/captured.
