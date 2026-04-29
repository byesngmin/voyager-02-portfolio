# Agent Manager

Multi-agent collaboration hub for coordinating work across codex, claude-code, and gemini-cli.

## File Read Decision Tree

```
Starting a task?
├─ YES → Read taskboard.md (check conflicts & active work)
│        ├─ Modifying files? → Read conflicts.md (check locks)
│        ├─ Unsure about conventions? → Read conventions.md
│        └─ Task outside my domain? → Read agents.md → Register handoff
└─ NO (just browsing) → No mandatory reads
```

## Files

| File | Purpose | When to Read |
|------|---------|-------------|
| `agents.md` | Agent profiles & domain assignments | When unsure about task ownership |
| `taskboard.md` | Active tasks, pending items, handoffs | Before starting any task |
| `changelog.md` | Completed work history (current month) | When checking past changes |
| `conventions.md` | Shared coding & documentation rules | When unsure about standards |
| `conflicts.md` | File lock registry | Before modifying shared files |
| `archive/` | Past month changelogs | When researching older history |

## Token Efficiency Rules

1. **Read-on-demand**: Only read files relevant to current task
2. **Minimal state**: taskboard keeps only active/pending items
3. **Prune on release**: Remove lock rows when released
4. **Section anchors**: Use `## ` headers so agents can grep specific sections
5. **Size cap**: Each file ≤ 200 lines (exceptions: changelog → monthly archive, conventions → split at 300 lines)
