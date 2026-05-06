# Task 03 — Create `.claude/management.md`

**Goal:** Separate taskboard management, collision detection, parallel dispatch, and freeze supervision.
**Conflict check:** New file only. No conflicts.

## File to Create

**Path:** `.claude/management.md`

```markdown
# Management Workflow

## Task Lifecycle
1. Before work: read `agentmanager/taskboard.md` → verify no conflicts
2. Register: add to taskboard "In Progress"
3. Complete: move taskboard entry → changelog

## Collision Detection

| Situation | Verdict | Action |
|-----------|---------|--------|
| Same file already "In Progress" | **Conflict** | Complete prior task first, then delegate sequentially |
| Same component/route/style area simultaneous edit | **Risk** | Split by file → sequential |
| Independent files, independent areas | **No conflict** | Parallel dispatch OK |

**Decomposition rule:** max 3 target files per single codex call. If scope is larger, decompose into a DAG and use level-based sequential delegation.

## Parallel Dispatch

When multiple independent tasks exist, fire workers simultaneously with `run_in_background`.

1. Decompose tasks into DAG (level-based)
2. Reserve file locks in `conflicts.md` (batch)
3. Fire Level 0 workers simultaneously (`run_in_background: true`)
4. Wait via `TaskOutput` → collect results from walkthrough.md
5. Batch evaluate → unified report

Details: `agentmanager/conventions.md` "Parallel Dispatch Protocol"

## Worker Freeze Supervision

**Freeze symptoms:**
- No progress output for 120+ seconds
- Same command repeated 3+ times
- Stuck in "thinking" state with no change

**Response procedure:**
1. Terminate the frozen worker process
2. Revert taskboard entry to "Pending" + add freeze note
3. Decompose spec into smaller units (1–2 files) and re-delegate
4. Report freeze occurrence and re-delegation details to user

**Prevention checklist:**
- [ ] Single call targets ≤ 3 files
- [ ] Estimated change scope ≤ 500 lines
- [ ] Only dependency-free tasks fired in parallel
```

## Verification

```bash
grep -c "Collision Detection\|Parallel Dispatch\|Freeze Supervision" .claude/management.md
# Expected: 3
```
