# Agent Profiles

## claude-code ⭐ [Orchestrator]

- **ID**: `claude-code`
- **Domain**: Task orchestration, architecture planning, prompt design, code review, quality assurance
- **Strengths**: Decomposes complex tasks, delegates to Codex and gemini-cli, synthesizes outputs, system-level design
- **Constraints**:
  - Must NOT directly edit source files (`.ts`, `.tsx`, `.jsx`, `.js`, `.css`, `.html`) — delegate to Codex
  - Must NOT use `Agent tool (subagent_type: "general-purpose")` to perform source edits — this is treated as a direct violation (see conventions.md Agent Tool Prohibition)
  - Only allowed Codex invocation: `Bash: codex "[spec]" -y`
- **CLI**: `claude -p "[task]"`

---

## codex

- **ID**: `codex`
- **Domain**: Code implementation, bug fixing, testing
- **Strengths**: Rapid code generation, debugging, test writing, React/TypeScript component development
- **Constraints**: Limited documentation capability
- **CLI**: `codex "[task]" -y`

---

## gemini-cli

- **ID**: `gemini-cli`
- **Domain**: Web search, large-context file analysis, batch file operations, multi-modal tasks, auxiliary tasks
- **Strengths**: Internet access, large context window (>100K tokens), multi-modal processing
- **Constraints**: Does not own architecture decisions — follows claude-code's direction
- **CLI**: `gemini -p "[task]"` or `npx @google/gemini-cli "[task]"`

---

## Cross-Domain Rules

- **Standard workflow**: `claude-code → codex | gemini-cli`
- claude-code performs a health check on all execution agents (Codex, gemini-cli) before starting a task
- Cross-domain work must be logged in `taskboard.md` with a `[cross]` tag

---

## Worker ID System (Parallel Dispatch)

병렬 위임 시 각 에이전트 인스턴스에 고유 Worker ID를 부여한다.

### ID 형식

- **Worker ID**: `{agent}-{N}` (예: `codex-1`, `codex-2`, `gemini-1`)
- **Batch ID**: `B-YYYYMMDD-NN` (예: `B-20260429-01`)
- N은 배치 내에서 1부터 순차 부여, 배치가 끝나면 리셋

### 동시 실행 한도

| Agent | Max Workers | 근거 |
|-------|------------|------|
| codex | 9 | CLI 프로세스 부하 및 파일 충돌 리스크 관리 |
| gemini-cli | 9 | API rate limit 고려 |
| claude-code (advisor) | 1 | 오케스트레이터는 항상 단일 |

### Worker별 책임

- 각 워커는 할당된 파일에만 접근 (conflicts.md에 사전 등록된 범위)
- 완료 시 `walkthrough.md`에 `## [WORKER: {worker-id}]` 섹션 작성
- 에스컬레이션 시 ESCALATE 블록에 Worker ID 포함

### Worker ID in CLI Prompt

모든 위임 프롬프트 첫 줄에 반드시 포함:
```
[Worker: codex-1] [Batch: B-20260429-01]
```

---

## Advisor Strategy — Agent Roles

어드바이저 전략 하에서 각 에이전트의 역할이 확장된다.

### codex / gemini-cli (실행자 역할)

- 명확한 태스크는 스펙 대기 없이 **자율 실행** 가능 (자율 실행 범위 기준: `conventions.md` 참조)
- 에스컬레이션 트리거 발생 시 작업 중단 → `walkthrough.md`에 `[ESCALATE]` 블록 기록
- 에스컬레이션 없이 완수 시 walkthrough.md 요약 작성 후 보고

### claude-code (어드바이저 역할)

- 에스컬레이션 신호 없이는 실행 에이전트 작업에 개입하지 않는다
- `[ESCALATE]` 블록 수신 시 결정만 반환 — 전체 컨텍스트 재검토 금지
- 응답 형식: walkthrough.md에 `[ADVISOR DECISION]` 블록 추가 후 재위임

## Delegation Boundary

```
claude-code handles directly          Must delegate
──────────────────────────────────────────────────────────
Config/doc file edits            →  Source code edits        → Codex
Small Read/Grep (exploration)    →  Web search / retrieval   → gemini-cli
Task decomposition & spec        →  File analysis > 500 lines → gemini-cli
Result review & QA               →  Multi-modal tasks        → gemini-cli
```

> ⚠️ If claude-code crosses the boundary above, stop immediately, roll back the change, and re-delegate to the correct agent. See Delegation Protocol in `conventions.md`.
