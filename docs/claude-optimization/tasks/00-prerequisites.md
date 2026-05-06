# Task 00 — Prerequisites

Verify before executing any other task.

## Checks

```bash
# 1. Claude Code CLI
claude --version

# 2. CLAUDE.md exists
ls CLAUDE.md

# 3. .claude/ directory and hooks
ls .claude/hooks/agent-guard.js .claude/hooks/gemini-router.js .claude/hooks/post-task-check.js

# 4. settings.local.json exists
ls .claude/settings.local.json

# 5. agentmanager/conventions.md exists
ls agentmanager/conventions.md
```

All commands must succeed (exit 0). If any fail, resolve before proceeding.

## Notes
- Tasks 01, 02, 03 create new files — no existing files modified, safe to run in parallel.
- Tasks 04, 06 modify existing files — run after 01–03 complete.
- Task 05 modifies `settings.local.json` — run independently, no dependency on 01–04.
