---
description: Automatically hand off a task to the appropriate agent when the current task falls outside the acting agent's domain
---
// turbo-all
1. Read `agentmanager/agents.md` to identify which agent owns the target domain
2. Register a handoff entry in `agentmanager/taskboard.md` under the "Handoff" section with: task name, context summary, relevant files, and target CLI command
3. Execute the CLI command for the target agent and notify upon completion:
   - For claude-code: `claude -p "[task description with full context]..." ; if ($?) { New-BurntToastNotification -Text "claude-code task complete" } else { New-BurntToastNotification -Text "claude-code call failed — check CLI error" }`
   - For codex: `codex "[task description with full context]..." ; if ($?) { New-BurntToastNotification -Text "Codex task complete" } else { New-BurntToastNotification -Text "Codex call failed — check CLI error" }`
   - **Agent Action**: After sending the CLI command in the background, double-check 1–2 seconds later (via `command_status` tool) that no immediate startup error (e.g. CommandNotFound) occurred. Report any error to the user immediately.
4. After CLI execution, update `agentmanager/changelog.md` with the handoff record

---

## Escalation Handoff (Advisor Strategy)

실행 에이전트가 에스컬레이션 트리거에 도달했을 때 사용하는 특수 핸드오프.
일반 핸드오프와 달리 **작업을 중단한 채** claude-code의 결정을 기다린다.

### 에스컬레이션 절차

1. 작업 중단 (변경 미적용 상태 유지)
2. `walkthrough.md`에 ESCALATE 블록 기록:

```markdown
## [ESCALATE: ARCH | SPEC | ERROR | CROSS]

**에이전트**: <codex | gemini-cli>
**발생 지점**: <파일명:라인 또는 태스크 단계>
**진행 상황**: <지금까지 완료한 내용 한 줄>
**질문**: <claude-code에게 필요한 결정 사항>
**중단 위치**: <변경 미적용 상태 여부 명시>
```

3. claude-code에 핸드오프 신호 전송:
   ```
   claude --model opus -p "[ESCALATE] walkthrough.md의 ESCALATE 블록 확인 후 결정 반환 요청"
   ```

### claude-code 어드바이저 응답 절차

1. `walkthrough.md`의 ESCALATE 블록만 읽는다 (전체 파일 탐색 금지)
2. 결정을 `[ADVISOR DECISION]` 블록으로 walkthrough.md에 추가:

```markdown
## [ADVISOR DECISION]

**결정**: <한 줄 결정>
**근거**: <결정 이유 한 줄>
**다음 지시**: <실행 에이전트에게 전달할 구체적 다음 단계>
```

3. 실행 에이전트에게 재위임 (② 위임 실행으로 복귀)
