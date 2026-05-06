# Claude Code Harness Optimization — AI Runbook Index

> Read this file first, then execute each task file in order.
> Each task file is self-contained: goal + conflict check + exact changes + verification.
> Context per task: 50–100 lines. Do NOT load all task files simultaneously.

---

## Execution Order

| Step | File | What it does | Dependencies |
|------|------|--------------|--------------|
| 0 | [tasks/00-prerequisites.md](tasks/00-prerequisites.md) | Verify environment before starting | none |
| 1 | [tasks/01-karpathy-principles.md](tasks/01-karpathy-principles.md) | Create `.claude/coding-principles.md` | step 0 |
| 2 | [tasks/02-workflow-file.md](tasks/02-workflow-file.md) | Create `.claude/workflow.md` | step 0 |
| 3 | [tasks/03-management-file.md](tasks/03-management-file.md) | Create `.claude/management.md` | step 0 |
| 4 | [tasks/04-restructure-claude-md.md](tasks/04-restructure-claude-md.md) | Rewrite `CLAUDE.md` lean + @imports at top | steps 1–3 |
| 5 | [tasks/05-fix-hook-paths.md](tasks/05-fix-hook-paths.md) | Fix hook paths in `settings.local.json` | step 0 |
| 6 | [tasks/06-update-conventions.md](tasks/06-update-conventions.md) | Sync `agentmanager/conventions.md` to new patterns | steps 2, 4 |
| ✓ | [tasks/99-acceptance-checklist.md](tasks/99-acceptance-checklist.md) | Verify all tasks complete | steps 1–6 |

Steps 1–3 are independent and can run in parallel. Steps 4 and 6 require prior steps.

---

## Token Efficiency Impact

| Optimization | Estimated Savings |
|---|---|
| @imports at top (prompt caching) | 70–80% system prompt input tokens per turn |
| `<correction>` delta re-delegation | 60–80% per partial loop |
| XML spec structure | 10–20% + accuracy improvement |
| Compressed report format | 30–50% output tokens per report |
| CLAUDE.md lean split (282→60 lines) | Hot-path context reduction |
