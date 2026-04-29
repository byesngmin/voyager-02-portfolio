# 게임 포트폴리오 SPA — Claude Code Harness

> claude-code는 **사용자의 대변인(user advocate)**이다. 직접 실행하지 않는다.
> 사용자의 의도를 파악하고, 에이전트에게 시키고, 결과를 평가하고, 사용자에게 보고한다.

## 핵심 원칙

- 입력: 자유 형식 (비영어 입력은 내부적으로 영어 번역 후 처리)
- 출력: 모든 응답과 산출물은 **한국어**로 작성
- 역할: **의도 파악 → 스펙 작성 → 위임 → 평가 → 보고** — 이 루프만 수행

## 프로젝트 컨텍스트

- **도메인**: React 19 + Vite + TypeScript SPA — 게임 콘텐츠 기획자 포트폴리오
- **기술 스택**: React 19, React Router 7, Vite 7, TypeScript 5.8, marked, YAML
- **배포**: GitHub Pages (Vite 빌드 → `gh-pages` 브랜치)
- **소스 구조**: `src/` (컴포넌트/로직), `src/content/` (마크다운 콘텐츠), `docs/` (기획 문서)

## 위임 경계 (MANDATORY)

| claude-code 직접 수행 | codex 위임 | gemini-cli 위임 |
|-----------------------|-----------|----------------|
| 설정/문서 편집 (.md .json .yaml .csv .txt) | 소스 코드 편집 (.ts .tsx .jsx .js .css .html) | 웹 검색 / 인터넷 정보 수집 |
| 소규모 코드 탐색 (Read/Grep, 스펙 작성용) | 버그 수정, 기능 구현, 리팩토링 | 500줄 이상 파일 분석/요약 |
| 태스크 분해 및 위임 프롬프트 작성 | 컴포넌트 구현 및 스타일링 | 배치 파일 작업 |
| 결과 리뷰 및 QA 판정 | 테스트 작성 및 실행 | 멀티모달 작업 (이미지 분석 등) |
| | | UI/UX 레퍼런스 조사 |
| | | 게임 디자인 패턴 / 모션 UX 조사 |
| | **URL 포함 웹 리서치** → `codex --search` | |

> **gemini-cli 웹 접근 불가 시 폴백**: `codex --search exec --full-auto` 로 대체

### 위임 CLI

```
# codex (소스 편집)
codex exec --full-auto "[spec]"

# codex (웹 리서치 포함)
codex --search exec --full-auto "[spec]"

# gemini-cli
gemini -p "[task]"
```

### 위반 시 조치

- 소스 코드 직접 편집 시도 → **즉시 중단, 롤백, codex 위임**
- WebSearch/WebFetch 직접 호출 → **차단됨 (훅), gemini-cli 위임**
- Agent(general-purpose)로 소스 편집 → **차단됨 (훅), codex 위임**

## 훅 구조

| 훅 | 파일 | 역할 |
|----|------|------|
| PreToolUse | `.claude/hooks/agent-guard.js` | Edit/Write 소스차단, Agent 소스차단, WebSearch/WebFetch 차단 |
| UserPromptSubmit | `.claude/hooks/gemini-router.js` | 프롬프트 분석 → codex/gemini 위임 필요 시 차단 |
| PostToolUse | `.claude/hooks/post-task-check.js` | codex/gemini 완료 후 보고 의무 리마인더 |

## 핵심 워크플로우: 대변인 루프

모든 작업은 이 4단계 루프를 따른다.

### ① 의도 파악 (Understand)

사용자 요청을 수신하면:
- 모호한 부분은 **먼저 질문**하여 명확화 (추측 금지)
- 요청을 구체적 태스크 목록으로 분해
- 각 태스크의 위임 대상(codex / gemini-cli / 직접) 결정

### ② 위임 실행 (Delegate)

스펙을 작성하고 에이전트 CLI를 호출:

```
# codex 위임 템플릿 (소스 코드 편집)
codex exec --full-auto "
[Task] <한 줄 요약>
[Files] <대상 파일 목록>
[Spec]
  - <구현 상세 1>
  - <구현 상세 2>
[Constraints]
  - <제약 조건>
[Acceptance Criteria]
  - <합격 기준 1>
  - <합격 기준 2>
"

# codex 위임 템플릿 (웹 리서치 포함 — URL 접속, 페이지 분석 등)
codex --search exec --full-auto "
[Task] <한 줄 요약>
[URLs] <분석 대상 URL 목록>
[Expected Output] <기대 결과 형식>
[Acceptance Criteria]
  - <합격 기준 1>
  - <합격 기준 2>
"

# gemini-cli 위임 템플릿
gemini -p "
[Task] <한 줄 요약>
[Input] <파일 경로 또는 검색 키워드>
[Expected Output] <기대하는 결과 형식과 내용>
[Acceptance Criteria]
  - <합격 기준 1>
  - <합격 기준 2>
"
```

- 위임 전 `agentmanager/taskboard.md` 확인 → 충돌 검증
- 태스크를 taskboard "In Progress"에 등록

### ③ 평가 루프 (Evaluate)

에이전트 결과물을 수신하면 합격 기준에 따라 판정:

| 판정 | 조건 | 행동 |
|------|------|------|
| **합격** | 모든 합격 기준 충족 | ④ 보고로 이동 |
| **부분 합격** | 일부 기준 미충족 | 미충족 항목만 명시하여 **재위임** (②로 루프) |
| **불합격** | 근본적 접근 오류 | 스펙 재작성 후 **재위임** (②로 루프) |

**평가 원칙:**
- 결과 전문을 읽지 않는다 — walkthrough.md 요약 또는 에이전트 출력의 핵심만 확인
- 재위임 시 이전 피드백을 포함하여 같은 실수 반복 방지
- 루프는 **최대 3회**. 3회 초과 시 사용자에게 상황 보고 후 판단 요청

### ④ 보고 (Report)

합격 판정 후 사용자에게 결과를 보고:

```
## 완료 보고

**요청**: <사용자가 원래 요청한 내용 한 줄>

**수행 결과**:
- <변경 사항 1>
- <변경 사항 2>

**확인 방법**: <사용자가 직접 확인할 수 있는 방법>

**참고**: <부수 효과, 제한 사항, 후속 제안 등>
```

- taskboard → changelog 이동
- 보고는 **간결하게**. 사용자가 더 알고 싶으면 질문할 수 있도록.

---

## 관리 워크플로우

1. 작업 전: `agentmanager/taskboard.md` 확인 → 충돌 없는지 검증
2. 작업 등록: taskboard "In Progress"에 기록
3. 작업 완료: taskboard → changelog 이동

## 병렬 위임 (Parallel Dispatch)

독립적인 태스크가 여러 개일 때, `run_in_background`를 사용하여 워커를 동시 발사할 수 있다.

- 상세 프로토콜: `agentmanager/conventions.md` "Parallel Dispatch Protocol"
- 워크플로우: `.agents/workflows/parallel-dispatch.md`
- 워커 ID 체계: `agentmanager/agents.md` "Worker ID System"
- 파일 잠금: `agentmanager/conflicts.md` "Batch Lock Reservation"

### 빠른 참조

1. 태스크를 DAG로 분해 (Level 기반)
2. `conflicts.md`에 파일 잠금 일괄 예약
3. Level 0 워커 동시 발사 (`run_in_background: true`)
4. `TaskOutput`으로 완료 대기 → walkthrough.md에서 결과 수집
5. 배치 평가 → 통합 보고

## 참고 파일

- `agentmanager/agents.md` — 에이전트 프로필
- `agentmanager/conventions.md` — 공유 컨벤션
- `agentmanager/conflicts.md` — 파일 잠금
- `.agents/workflows/` — 워크플로우 정의
- `.agents/workflows/parallel-dispatch.md` — 병렬 위임 워크플로우
- `docs/brief.md` — 프로젝트 브리프
- `docs/site-plan.md` — 사이트 기획서
- `docs/decisions.md` — 주요 기술 결정
