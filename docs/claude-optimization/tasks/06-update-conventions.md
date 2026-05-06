# Task 06 — Update `agentmanager/conventions.md`

**Goal:** Sync conventions.md to reflect delta re-delegation and XML spec templates.
**Dependency:** Tasks 02 and 04 must be complete.
**Conflict check:** Only `agentmanager/conventions.md` modified. No hooks parse this file. No conflicts.

## Change 1 — Re-delegation rule (Advocate Loop section)

**Find:**
```
- 재위임 시 이전 피드백 포함 (같은 실수 반복 방지)
- 루프 최대 3회 → 초과 시 사용자에게 상황 보고
```

**Replace with:**
```
- 재위임(PARTIAL): 전체 스펙 재전송 금지 — `<correction>` 블록(실패 항목 + 수정 방향)만 전송
- 재위임(FAIL): 전체 스펙 재작성 후 재전송
- 루프 최대 3회 → 초과 시 사용자에게 상황 보고
```

## Change 2 — Codex delegation template

**Find** the block starting with `**Codex delegation template**` and ending after the closing triple-backtick.

**Replace the entire block with:**
````
**Codex delegation template**
```
codex exec --full-auto "
<task>one-line summary</task>
<files>list of files to modify</files>
<spec>
  - implementation detail 1
  - implementation detail 2
</spec>
<constraints>
  - constraint
</constraints>
<acceptance_criteria>
  - pass/fail criterion 1
  - pass/fail criterion 2
</acceptance_criteria>
"
```
````

## Change 3 — gemini-cli delegation template

**Find** the block starting with `**gemini-cli delegation template**` and ending after the closing triple-backtick.

**Replace the entire block with:**
````
**gemini-cli delegation template**
```
gemini -p "
<task>one-line summary</task>
<input>file path or search keyword</input>
<output>format and content of expected return</output>
<acceptance_criteria>
  - pass/fail criterion 1
  - pass/fail criterion 2
</acceptance_criteria>
"
```
````

## Verification

```bash
grep -c "<task>\|<correction>\|재위임(PARTIAL)" agentmanager/conventions.md
# Expected: 3 or more
```
