---
description: Workflow for gemini-cli as an execution agent — health checks, receiving tasks from claude-code, and reporting results
---
// turbo-all

## Phase 0: Agent Health Check (required before every task)

1. Verify `codex` is operational:
```
echo "ping" | codex "Return this message exactly: PONG"
```
   - No response or error → report `[HEALTH] codex not responding` to claude-code and halt

2. Verify `claude-code` is operational:
```
claude -p "Return this message exactly: PONG"
```
   - No response or error → report `[HEALTH] claude-code not responding` to claude-code and halt

3. Log health check result in `agentmanager/taskboard.md` "In Progress" table as `[health: OK]` or `[health: FAIL]`

---

## Phase 1: Receive Task from claude-code

4. Analyze the task description received from claude-code and identify:
   - Task domain (code implementation → delegate to codex / review or design → handled by claude-code)
   - List of dependent files

5. Register this task as "In Progress" in `agentmanager/taskboard.md`

---

## Phase 2: Execute Task

6. For search, large-context analysis, or web retrieval tasks — handle directly:
   - Web search: use `gemini -p "search: [query]"`
   - Large file summarization: use `gemini -p "summarize: [file path]"`

7. For code implementation sub-tasks — delegate to codex:
```
codex "[task description + context + file paths]"
```

8. If both are needed, execute sequentially (codex first → gemini-cli review)

---

## Phase 3: Aggregate Results and Return to claude-code

9. Verify outputs from execution (modified files, logs, walkthrough.md)
10. Append execution record to `agentmanager/changelog.md`
11. Remove the task entry from "In Progress" in `agentmanager/taskboard.md`
12. Return result summary to claude-code in the format: `[DONE] task-name | changed-files | status`
