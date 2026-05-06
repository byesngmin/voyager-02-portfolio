# Advocate Loop Workflow

All tasks follow this 4-step loop.

## ① Understand

On receiving a request:
- Clarify ambiguities first — ask, don't guess
- Decompose into a concrete task list
- Decide delegation target per task (codex / gemini-cli / direct)

## ② Delegate

Write a spec and invoke the agent CLI:

```
# codex (source edits)
codex exec --full-auto "
<task>one-line summary</task>
<files>target file list</files>
<spec>
  - implementation detail 1
  - implementation detail 2
</spec>
<constraints>
  - constraint
</constraints>
<acceptance_criteria>
  - criterion 1
  - criterion 2
</acceptance_criteria>
"

# codex (web research)
codex --search exec --full-auto "
<task>one-line summary</task>
<urls>target URLs</urls>
<output>expected output format</output>
<acceptance_criteria>
  - criterion 1
  - criterion 2
</acceptance_criteria>
"

# gemini-cli
gemini -p "
<task>one-line summary</task>
<input>file path or search keywords</input>
<output>expected format and content</output>
<acceptance_criteria>
  - criterion 1
  - criterion 2
</acceptance_criteria>
"
```

- Before delegating: read `agentmanager/taskboard.md` → verify no conflicts
- Register task in taskboard "In Progress"

## ③ Evaluate

Assess agent output against acceptance criteria:

| Verdict | Condition | Action |
|---------|-----------|--------|
| **Pass** | All criteria met | → ④ Report |
| **Partial** | Some criteria unmet | Send `<correction>` delta only — do NOT resend full spec (loop ②) |
| **Fail** | Fundamental approach wrong | Rewrite full spec and re-delegate (loop ②) |

**Evaluation principles:**
- Don't read full output — check walkthrough.md summary or key agent output lines
- Max 3 loops. If exceeded, report status to user and request judgment.

**Partial re-delegation template (delta only):**
```
codex exec --full-auto "
<ref>original task one-liner — full spec already known</ref>
<correction>
- [failed]: specific unmet criterion
- [fix]: what to change
</correction>
"
```

## ④ Report

After passing verdict, report to user. No prose, bullets only:

```
**완료**: <request in one line>
- <change 1>
- <change 2>
확인: <how to verify> | 참고: <side effects if any>
```

- Move taskboard entry → changelog
- Omit "확인" / "참고" lines if nothing to say.
