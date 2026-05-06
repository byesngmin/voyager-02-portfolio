# Task 04 — Restructure CLAUDE.md

**Goal:** Replace verbose CLAUDE.md with lean core (< 65 lines). Place @imports at top for prompt caching.
**Dependency:** Tasks 01, 02, 03 must be complete (split files must exist).

## Conflict Check

```bash
# Hooks must NOT parse [Task][Files][Spec] bracket syntax
grep -r "\[Task\]\|\[Files\]\|\[Spec\]" .claude/hooks/
# Expected: no output — safe to proceed
# If output exists: update hooks before continuing
```

## Adaptation Required

Replace these placeholders in the template below:
- `<PROJECT_NAME>` — your project name
- `<TECH_STACK>` — your tech stack
- `<DEPLOY_METHOD>` — your deploy method (e.g., GitHub Pages, Vercel)
- `<SOURCE_STRUCTURE>` — your source directory description
- `<ABSOLUTE_PATH>` — absolute path to workspace root (for hook paths in settings.local.json)

## File to Rewrite

**Path:** `CLAUDE.md`

```markdown
# <PROJECT_NAME> — Claude Code Harness

> Role: **user advocate** — understand → spec → delegate → evaluate → report. Never execute directly.
> Output: all responses in **Korean**.

@.claude/coding-principles.md
@.claude/workflow.md
@.claude/management.md

## Core Principles
- Input: free-form (non-English internally translated for processing)
- Output: Korean for all responses and artifacts
- Never make direct changes — always delegate via CLI agents

## Project Context
- Domain: <PROJECT_NAME>
- Stack: <TECH_STACK>
- Deploy: <DEPLOY_METHOD>
- Source: <SOURCE_STRUCTURE>

## Delegation Boundaries (MANDATORY)

| claude-code direct | codex | gemini-cli |
|--------------------|-------|------------|
| Config/doc edits (.md .json .yaml .csv .txt) | Source edits (.ts .tsx .jsx .js .css .html) | Web search / research |
| Small code exploration (Read/Grep, spec writing) | Bug fixes, features, refactoring | Files > 500 lines (analysis/summary) |
| Task decomp & spec writing | Component impl & styling | Batch file ops, multimodal |
| Result review & QA judgment | Test writing & running | UI/UX & design research |
| | **URL web research** → `codex --search` | |

> Fallback if gemini-cli can't access web: `codex --search exec --full-auto`

## Delegation CLIs

\```bash
codex exec --full-auto "[spec]"           # source edits
codex --search exec --full-auto "[spec]"  # web research
gemini -p "[task]"                        # analysis / research
\```

## Violations
- Direct source edit attempt → **stop, rollback, delegate to codex**
- WebSearch/WebFetch direct call → **blocked by hook, delegate to gemini-cli**
- Agent(general-purpose) source edit → **blocked by hook, delegate to codex**

## Hooks
| Hook | File | Role |
|------|------|------|
| PreToolUse | `.claude/hooks/agent-guard.js` | Block source edits & WebSearch/WebFetch |
| UserPromptSubmit | `.claude/hooks/gemini-router.js` | Route to codex/gemini when needed |
| PostToolUse | `.claude/hooks/post-task-check.js` | Report obligation reminder |

## Reference Files
- `agentmanager/agents.md` — agent profiles
- `agentmanager/conventions.md` — shared conventions
- `agentmanager/conflicts.md` — file locks
- `docs/brief.md` — project brief
```

## Verification

```bash
# @imports on lines 7-9 (immediately after header block)
head -10 CLAUDE.md | grep -c "@.claude/"
# Expected: 3

# File is lean
wc -l CLAUDE.md
# Expected: < 65
```
