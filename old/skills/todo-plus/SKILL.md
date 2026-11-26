---
name: todo-plus
description: Read, add, complete, cancel, tag, estimate and archive tasks in Todo+ format files (.todo, .todos, TODO) used by the vscode-todo-plus extension. Syntax uses "Project:" lines, ☐ ✔ ✘ symbols and @tags like @high or @done(26-01-31 14:05). Use when the user mentions todos, tasks, a task list, project.todo, or asks to edit, update, triage or summarize a .todo file.
license: MIT
metadata:
  version: "1.0.0"
---

# Todo+ format

Todo+ files are plain text. An editor extension renders them, but you only edit the text, so exact characters matter. Never use Markdown checkboxes (`- [ ]`) in these files.

## Syntax

| Thing | Syntax |
|---|---|
| Project | A line ending with `:` and no symbol, e.g. `High Priority:` |
| Pending todo | `☐ text` |
| Done todo | `✔ text` |
| Cancelled todo | `✘ text` |
| Note | Plain text line with no symbol and no trailing colon |
| Tag | `@tag` or `@tag(value)`, space-separated |
| Subtask or nested project | Indented one level deeper than its parent |

- Every symbol is followed by one space.
- Tags go at the **end** of the line, after the text.
- Projects nest by indentation and can contain todos, notes and other projects.
- Todos can have child todos (subtasks) by indenting them.
- Plain-text notes are meaningful to the user. Keep them where they are.

## Before editing

1. Read the whole file first.
2. Detect the indentation (usually 2 spaces, sometimes tabs) and match it exactly.
3. Detect which tags the file already uses (e.g. `@high`, `@medium`, `@low`, `@info`, `@today`). Reuse those. Do not invent new tags unless asked.

## Operations

**Add a todo**
Insert `☐ text` under the right project at the same indentation as its sibling todos. Put it at the end of that project's list unless the user gives a position. If no project fits, ask or add it to the nearest sensible one. Don't create a new project unprompted.

**Complete a todo**
Change `☐` to `✔` and append `@done(YY-MM-DD HH:mm)` as the last tag. Get the real local time with `date '+%y-%m-%d %H:%M'`. Never guess it.
If the line has `@started(...)`, also append `@lasted(XhYm)` after `@done` (elapsed time between started and done, e.g. `@lasted(9h29m)`).

**Cancel a todo**
Change `☐` to `✘` and append `@cancelled(YY-MM-DD HH:mm)`.

**Reopen a todo**
Change `✔` or `✘` back to `☐` and remove `@done`, `@lasted` or `@cancelled`.

**Start a todo**
Append `@started(YY-MM-DD HH:mm)` to a `☐` line.

**Tag a todo**
Append `@tag` at the end of the line. Priority tags are conventionally `@critical`, `@high`, `@low`, plus `@today`. Replace an existing priority tag rather than stacking two.

**Estimate**
`@30m`, `@1h`, `@1h30m`, or `@est(1 day and 20 minutes)`. Keep an existing estimate unless asked to change it.

**Archive**
Move finished (`✔` and `✘`) todos into a top-level `Archive:` project at the end of the file. Create it if missing. Keep each line's tags and timestamps unchanged. If existing archived lines carry an `@project(...)` tag, follow that convention and record the original project there.

**Query or summarize**
- Pending: lines containing `☐`. Done: `✔`. Cancelled: `✘`.
- To report by project, track the nearest preceding less-indented line ending in `:`.
- Exclude the `Archive:` project from "open work" summaries.

## Rules

- Do not reorder, rename, delete or reformat anything the user didn't ask you to change. Minimal diffs.
- Do not rewrite todo text when completing or tagging it.
- If all subtasks of a parent are done, tell the user instead of silently completing the parent.
- Preserve blank lines and the order of projects.
- Preserve the exact symbols in the file. If the file uses different symbols than ☐ ✔ ✘ (the extension lets users customize them), use those.
- After editing, re-read the changed region and confirm indentation, symbols and tags are intact.

## Example

Before:
```
Work:
  ☐ Fix favicon reference @medium
  ☐ Add OG image alt text @low
```

After "complete the favicon task and mark the OG one high priority":
```
Work:
  ✔ Fix favicon reference @medium @done(26-11-26 14:05)
  ☐ Add OG image alt text @high
```
