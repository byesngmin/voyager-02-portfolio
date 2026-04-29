---
description: Dispatch multiple independent tasks to codex/gemini-cli workers in parallel, with file conflict prevention and result aggregation
---
// turbo-all

## Parallel Dispatch Workflow

### Pre-conditions

1. Read `agentmanager/conventions.md` — "Parallel Dispatch Protocol" section
2. Read `agentmanager/conflicts.md` — confirm no active locks conflict
3. Read `agentmanager/taskboard.md` — confirm no conflicting In Progress entries

### Step 1: Decompose into DAG

1. Break user request into atomic tasks
2. Identify file targets for each task
3. Assign agent type (codex / gemini-cli) per delegation protocol
4. Assign levels:
   - Level 0: tasks with no file overlap and no dependencies
   - Level 1+: tasks that depend on Level N-1 outputs or share files with Level N-1 tasks
5. Record DAG in taskboard under "Active Batches"

### Step 2: Pre-Reserve File Locks

1. For each Level 0 task, list target files
2. Cross-check: same file in two Level 0 tasks → move one to Level 1
3. Cross-check: file already locked in conflicts.md → move task to next level or wait
4. Register all Level 0 file locks in conflicts.md with batch-id and worker-id
5. If lock reservation fails for all tasks → abort and report to user

### Step 3: Assign Worker IDs

1. Generate Batch ID: `B-YYYYMMDD-NN`
2. Assign worker IDs sequentially: `codex-1`, `codex-2`, `gemini-1`, etc.
3. Respect concurrency limits: codex max 3, gemini-cli max 2
4. If tasks exceed limits → overflow tasks move to next level

### Step 4: Launch Workers

For each Level 0 worker, use `Bash run_in_background: true`:

```bash
# codex worker
codex "[Worker: codex-1] [Batch: B-YYYYMMDD-NN]
[Task] ...
[Files] ...
[Spec] ...
[Constraints]
  - Write completion summary to walkthrough.md under ## [WORKER: codex-1] header
  - Only modify files listed in [Files]
  - On escalation: write [ESCALATE] block with Worker ID, then stop
[Acceptance Criteria] ...
" -y

# gemini-cli worker
gemini -p "[Worker: gemini-1] [Batch: B-YYYYMMDD-NN]
[Task] ...
[Expected Output] ...
[Constraints]
  - Write completion summary to walkthrough.md under ## [WORKER: gemini-1] header
[Acceptance Criteria] ...
"
```

Register each task in taskboard "In Progress" with Worker ID, Batch ID, and Level.

### Step 5: Wait and Collect

1. Use `TaskOutput` to wait for each background worker
2. As each worker completes, read its `## [WORKER: {id}]` section in walkthrough.md
3. Check for `[ESCALATE]` blocks — handle immediately without waiting for other workers:
   - Read ESCALATE block
   - Write `[ADVISOR DECISION]` via `claude --model opus -p "[ESCALATE] ..."`
   - Re-dispatch the paused worker with the decision included
4. Continue waiting until all Level N workers complete

### Step 6: Evaluate Batch

1. Read all `## [WORKER: {id}]` sections for the current level
2. Apply per-worker acceptance criteria evaluation
3. Write `## [BATCH EVALUATION: {batch-id}]` section in walkthrough.md
4. Determine batch verdict:
   - All pass → proceed to Level N+1 or final report
   - Partial → re-dispatch failed workers only (keep passed results)
   - All fail → re-spec and re-dispatch entire level

### Step 7: Release and Advance

1. Release file locks for completed workers in conflicts.md
2. If Level N+1 exists → go to Step 2 with Level N+1 tasks
3. If all levels complete → proceed to final report

### Step 8: Aggregate Report

Compose single user-facing report combining all worker results:

```markdown
## 완료 보고

**요청**: <원래 요청>
**배치**: {batch-id}

**수행 결과**:
| Worker | Task | 결과 |
|--------|------|------|
| codex-1 | ... | 합격 |
| codex-2 | ... | 합격 |
| gemini-1 | ... | 합격 |

**확인 방법**: ...
**참고**: ...
```

Move batch from taskboard "Active Batches" to changelog.

---

## Escalation Handling (Parallel)

- Escalation pauses ONLY the escalating worker
- Other workers continue running
- claude-code reads the ESCALATE block, writes ADVISOR DECISION
- Re-dispatches the paused worker with the decision included
- If escalation affects shared files → may need to pause dependent Level N+1 tasks
