# Shared Conventions

All agents must follow these rules. If this file exceeds 300 lines, split by domain (e.g., `conventions-code.md`, `conventions-docs.md`).

> [!IMPORTANT]
> **Execute the `/master_rules` workflow immediately at the start of every session.**
> Starting work without completing this step is a rule violation.

---

## Version Management

- **현재 버전: V1.0.0** (2026-04-29 기준)
- 버전 번호 갱신은 **사용자가 명시적으로 요청한 경우에만** 수행한다.
- 에이전트(codex / gemini-cli / claude-code)가 자의적으로 버전을 올려서는 안 된다.
- 버전 갱신 시 수정 대상: `package.json` version 필드, `agentmanager/conventions.md` 이 섹션.

---

## Commit Messages

- Format: `[agent-id] brief description`
- Example: `[codex] fix route transition animation`
- Language: English for commit messages

## File Naming

- Use lowercase with hyphens: `my-component.tsx`
- Documentation files: lowercase with hyphens: `feature-guide.md`
- No spaces in filenames

## Code Style

- Indentation: 2 spaces
- Encoding: UTF-8
- Line endings: LF
- Add a newline at end of file

## Documentation Style

- Language: Korean for user-facing content, English for rules/workflows/code references
- Tone: concise declarative style, no filler words
- Format: prefer tables over long paragraphs
- Headers: use `## ` anchors for section-level grep

## Log & Report Format

- Always use tables for structured data
- Agent ID must appear in every log entry
- Timestamps: ISO 8601 (`YYYY-MM-DDTHH:MM:SS+09:00`)

---

## Delegation Protocol (MANDATORY)

Apply the table below before starting any task. Violations must be halted and rolled back immediately.

| Task Type | Responsible Agent | On Violation |
|-----------|------------------|--------------|
| Source code edits (`.ts` `.tsx` `.jsx` `.js` `.css` `.html`) | **Codex** | Stop & rollback immediately |
| Web search / internet information retrieval | **gemini-cli** | Stop immediately |
| Full summarization/analysis of files > 500 lines | **gemini-cli** | Stop immediately |
| Batch operations across many files | **gemini-cli** | Stop immediately |
| Multi-modal tasks (image analysis, etc.) | **gemini-cli** | Stop immediately |
| Config/doc file edits (`.md` `.json` `.yaml` `.toml`) | **claude-code directly** | — |
| Small targeted code exploration (Read/Grep for spec writing) | **claude-code directly** | — |

### Agent Tool Prohibition (CRITICAL)

claude-code **MUST NOT** use the `Agent tool (subagent_type: "general-purpose")` to perform source code edits.
Invoking a general-purpose subagent that edits `.ts` / `.tsx` / `.js` / `.css` files is **equivalent to a direct violation** — the hook cannot detect it, but it is still a P1 breach.

| Prohibited | Required |
|-----------|---------|
| `Agent tool { subagent_type: "general-purpose" }` for source edits | `Bash: codex "..." -y` |
| Any subagent that invokes Edit/Write on source files | Direct Codex CLI call only |

If this violation occurs: stop immediately, roll back all subagent edits, and re-delegate via `Bash: codex "..." -y`.

---

**Codex delegation template**
```
codex "
[Task] <one-line summary>
[Files] <list of files to modify>
[Spec]
  - <implementation detail 1>
  - <implementation detail 2>
[Constraints]
  - <constraints to follow>
[Acceptance Criteria]
  - <pass/fail criterion 1>
  - <pass/fail criterion 2>
" -y
```

**gemini-cli delegation template**
```
gemini -p "
[Task] <one-line summary>
[Input] <file path or search keyword>
[Expected Output] <format and content of expected return>
[Acceptance Criteria]
  - <pass/fail criterion 1>
  - <pass/fail criterion 2>
"
```

---

## Advocate Loop (claude-code 핵심 워크플로우)

claude-code는 사용자의 대변인으로서 아래 루프를 따른다. 상세 내용은 `CLAUDE.md` 참조.

```
① 의도 파악 → ② 위임 실행 ──────────────────────────────────────────┐
                    ↑         codex / gemini-cli 자율 실행             │
                    │              │                                    │
                    │         [ESCALATE?] ──── Yes ──→ claude-code     │
                    │              │              (어드바이저 개입)       │
                    │              No                    │              │
                    │              ↓               결정 반환 ──→ 재위임  │
                    │         완료 → walkthrough.md                    │
                    │                   │                              │
                    └── 불합격 시 ←─── ③ 평가 ←───────────────────────┘
                                         │
                                    합격 → ④ 보고
```

- 평가 시 합격 기준(Acceptance Criteria)으로 판정
- 재위임 시 이전 피드백 포함 (같은 실수 반복 방지)
- 루프 최대 3회 → 초과 시 사용자에게 상황 보고
- **에스컬레이션 신호가 없으면 claude-code는 개입하지 않는다**
- 병렬 위임 시에는 ② 위임 실행에서 여러 워커를 동시 발사한다. 상세는 "Parallel Dispatch Protocol" 참조.

---

## Parallel Dispatch Protocol

claude-code는 독립적인 태스크를 병렬로 위임할 수 있다. 아래 프로토콜을 반드시 따른다.

### 용어

| 용어 | 정의 |
|------|------|
| **Batch** | 한 사용자 요청에서 파생된 병렬 위임 묶음. ID 형식: `B-YYYYMMDD-NN` |
| **Worker** | 병렬 실행되는 개별 에이전트 인스턴스. ID 형식: `{agent}-{N}` (예: `codex-1`, `gemini-2`) |
| **Level** | DAG 내 실행 순서. Level 0 = 독립, Level 1 = Level 0 완료 후 실행 |

### 동시 실행 한도

| Agent | Max Concurrent Workers |
|-------|----------------------|
| codex | 3 |
| gemini-cli | 2 |

### 병렬 위임 절차

```
① 태스크 분해 (DAG 생성)
    ↓
② 파일 충돌 사전 검증 (conflicts.md 예약)
    ↓
③ Level 0 워커 동시 발사 (run_in_background)
    ↓
④ TaskOutput 대기 → 결과 수집
    ↓
⑤ 전체 평가 (합격/부분합격/불합격)
    ↓
⑥ Level 1 발사 (Level 0 결과 의존)
    ↓
⑦ 통합 보고
```

### DAG 작성 형식

```markdown
### Batch: B-20260429-01

| Level | Worker ID | Task | Files | Depends On |
|-------|-----------|------|-------|------------|
| 0 | codex-1 | Fix animation in Header | `src/components/Header.tsx` | — |
| 0 | codex-2 | Add project card | `src/components/ProjectCard.tsx` | — |
| 0 | gemini-1 | Research motion UX patterns | — | — |
| 1 | codex-3 | Integrate animation + card | `src/App.tsx` | codex-1, codex-2 |
```

### 파일 충돌 사전 검증 규칙

1. DAG 작성 후, 같은 Level 내 워커들의 Files 열을 비교
2. 겹치는 파일이 있으면 → 해당 워커를 다음 Level로 이동
3. 겹침이 없으면 → `conflicts.md`에 배치 예약 등록
4. 예약 등록 없이 `run_in_background` 실행 금지

### 배경 실행 패턴

```bash
# Worker codex-1 (run_in_background: true)
codex "[Worker: codex-1] [Batch: B-20260429-01]
[Task] Fix animation in Header
[Files] src/components/Header.tsx
[Spec] ...
[Constraints]
  - Write results to walkthrough.md under ## [WORKER: codex-1] header
  - Only modify files listed in [Files]
  - On escalation: write [ESCALATE] block with Worker ID, then stop
[Acceptance Criteria] ...
" -y
```

- 모든 워커 CLI 호출에 `[Worker: {id}]`와 `[Batch: {id}]`를 프롬프트 첫 줄에 포함
- 워커는 완료 시 `walkthrough.md`에 `## [WORKER: {worker-id}]` 섹션 작성

### 결과 수집 및 평가

- 모든 Level N 워커 완료 후 walkthrough.md의 해당 WORKER 섹션을 읽는다
- 개별 워커 판정: 합격 / 부분합격 / 불합격
- 전체 배치 판정:
  - 전원 합격 → 통합 보고
  - 부분합격 있음 → 해당 워커만 재위임 (다른 워커 결과는 유지)
  - 불합격 있음 → 해당 워커 스펙 재작성 후 재위임
- Level N+1 발사는 Level N 전원 합격 후에만 진행

---

## Advisor Strategy — Escalation Protocol

실행 에이전트(codex / gemini-cli)는 아래 트리거 발생 시 작업을 **중단**하고 `walkthrough.md`에 ESCALATE 블록을 기록한다. claude-code는 이 블록만 읽고 결정을 내린 후 재위임한다.

### 에스컬레이션 트리거

| 코드 | 조건 | 중단 시점 |
|------|------|-----------|
| `ARCH` | 수정 범위가 2개 이상 파일에 걸치는 아키텍처 결정 | 변경 적용 전 |
| `SPEC` | 합격 기준 해석 불가 또는 요구사항 충돌 | 구현 시작 전 |
| `ERROR` | 동일 오류 2회 이상 반복 | 3번째 시도 전 |
| `CROSS` | 다른 에이전트 소유 파일 수정 필요 | 파일 접근 전 |

### ESCALATE 블록 형식 (walkthrough.md에 기록)

```markdown
## [ESCALATE: ARCH | SPEC | ERROR | CROSS]

**에이전트**: codex | gemini-cli
**발생 지점**: <파일명:라인 또는 태스크 단계>
**진행 상황**: <지금까지 완료한 내용 한 줄>
**질문**: <claude-code에게 필요한 결정 사항>
**중단 위치**: <변경 미적용 상태 여부 명시>
```

### claude-code 어드바이저 응답 규칙

- ESCALATE 블록 수신 시 **결정만** 내린다 — 전체 파일 재검토 금지
- 응답은 `[ADVISOR DECISION]` 헤더로 walkthrough.md에 추가
- 결정 후 즉시 재위임 (② 위임 실행으로 복귀)

### 자율 실행 범위 (에스컬레이션 없이 진행 가능)

아래 조건을 **모두** 충족하면 실행 에이전트가 자율 완수 후 보고만 한다:

- 수정 파일 1개
- 합격 기준 명확 (수치 또는 동작으로 판별 가능)
- taskboard에 유사 완료 사례 존재 (패턴 반복)

---

## Agent Handoff & Reporting Rules (Token Optimization)

- **Do NOT force claude-code to read large source files after modifications.**
- When an execution agent (`codex` or `gemini-cli`) completes a task, it MUST write a concise summary in the `walkthrough.md` artifact for claude-code.
- The summary MUST include:
  1. `[Changed Files]`: List of modified files
  2. `[Architectural Changes]`: High-level summary of structural changes
  3. `[API/Signature Changes]`: Any changed function names or component props that affect other modules
  4. `[Known Issues/Next Steps]`: Current limitations or further action items
- claude-code will ONLY read this `walkthrough.md` block for context. Keep diff lines out of the summary.

## claude-code Self-Edit Reporting Rules

When claude-code directly modifies configuration or documentation files WITHOUT delegating to an execution agent:
- It MUST append an entry to `agentmanager/changelog.md` in the **same work session** — not as a follow-up step.
- Failure to do so **before ending the session** constitutes a process violation that breaks agent handoff continuity.
