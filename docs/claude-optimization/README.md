# CLAUDE.md 최적화 보고서

> 작업 일자: 2026-05-06 | 작업 영역: `d:/Github/voyager-02-portfolio`

---

## 개요

이 보고서는 Claude Code Harness의 `CLAUDE.md` 파이프라인에 적용된 최적화 작업을 기록합니다.  
최적화 목표: **1순위 작업 효율성 증대 / 2순위 토큰 효율화**

---

## Before / After 비교

| 항목 | Before | After |
|------|--------|-------|
| CLAUDE.md 라인 수 | 282줄 | 60줄 |
| 세션 로드 컨텍스트 | 단일 파일 282줄 | 핵심 60줄 + @import 3파일(204줄), 캐시 최적화 |
| 훅 실제 동작 여부 | **미동작** (경로 오류) | **정상 동작** (경로 수정) |
| 위임 스펙 구조 | `[Task]` 마크다운 대괄호 | `<task>` XML 태그 |
| 재위임 시 전송량 | 전체 스펙 재전송 | `<correction>` 델타만 전송 |
| 완료 보고 포맷 | 서술형 템플릿 5줄 | 불렛 압축 2줄 |

---

## 최적화 항목 목록

### 1. Karpathy-skills 코딩 원칙 통합

**문제**: Claude Code에 범용 코딩 실수 억제 지침 없음  
**적용**: [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) 원칙 4가지 통합

| 원칙 | 핵심 내용 |
|------|-----------|
| Think Before Coding | 가정 금지, 불명확 시 멈추고 질문 |
| Simplicity First | 요청된 것만, 추측성 기능·추상화 금지 |
| Surgical Changes | 요청 범위만 수정, 인접 코드 정리 금지 |
| Goal-Driven Execution | 검증 가능한 성공 기준 먼저 정의 |

효과 판정 기준: diff 내 불필요한 변경 감소, 구현 전 명확화 질문 증가

---

### 2. CLAUDE.md 모듈 분리 (`@import` 구조)

**문제**: 282줄 단일 파일 → 컨텍스트 오염, 유지보수 어려움  
**적용**: 핵심 60줄 + 3개 분리 파일 (`@` import로 자동 로드)

```
CLAUDE.md (60줄, 자동 로드)
  @.claude/coding-principles.md  (66줄) — karpathy 원칙
  @.claude/workflow.md            (89줄) — 대변인 루프 + 위임 템플릿
  @.claude/management.md          (49줄) — 관리 워크플로우 + 충돌/프리징 감독
```

- `@path` 문법: Claude Code가 CLAUDE.md 로드 시 해당 파일 인라인 병합
- 세션 시작마다 4개 파일 전체 자동 로드됨

---

### 3. 훅 경로 수정 (긴급 버그픽스)

**문제**: `settings.local.json`의 훅 3개 경로가 다른 프로젝트를 가리킴 → 훅 전체 미동작  
**적용**: 경로를 현재 프로젝트 절대경로로 수정

```
Before: c:/Users/user/Documents/New project 2/.claude/hooks/
After:  d:/Github/voyager-02-portfolio/.claude/hooks/
```

영향: `agent-guard.js` (소스 편집 차단), `gemini-router.js` (라우팅), `post-task-check.js` (평가 리마인더) 모두 정상화

---

### 4. 프롬프트 캐싱 최적화 (@import 순서)

**문제**: 프로젝트별 가변 규칙이 캐시 프리픽스 앞에 위치 → 세션 간 캐시 효율 저하  
**적용**: `@import` 3개를 CLAUDE.md 헤더 직후(최상단)로 이동

```
Before: 핵심원칙 → 프로젝트컨텍스트 → 위임경계 → ... → @imports
After:  @imports(보편/안정 규칙) → 핵심원칙 → 프로젝트컨텍스트 → 위임경계 → ...
```

효과: 보편적이고 변경 빈도가 낮은 규칙이 캐시 프리픽스의 앞부분 차지 → cross-session 캐시 히트율 향상

---

### 5. PARTIAL 재위임 델타화 (`<correction>`)

**문제**: 평가 루프에서 PARTIAL 판정 시 전체 스펙을 재전송 → 루프당 수백 토큰 낭비  
**적용**: PARTIAL 재위임 시 `<correction>` 델타 블록만 전송

```xml
<!-- PARTIAL 재위임 패턴 -->
<ref>original task one-liner</ref>
<correction>
- [failed]: specific unmet criterion
- [fix]: what to change
</correction>
```

FAIL(근본적 접근 오류)은 여전히 전체 스펙 재작성 필요 — 구분 유지

---

### 6. 위임 스펙 XML 구조 전환

**문제**: `[Task]` 마크다운 대괄호 구조 → 모델 경계 파싱 비용 증가  
**적용**: Anthropic 권장 XML 태그로 전환

| Before | After |
|--------|-------|
| `[Task]` | `<task>` |
| `[Files]` | `<files>` |
| `[Spec]` | `<spec>` |
| `[Constraints]` | `<constraints>` |
| `[Acceptance Criteria]` | `<acceptance_criteria>` |
| `[Expected Output]` | `<output>` |
| `[Input]` | `<input>` |
| `[URLs]` | `<urls>` |

파싱 정확도 향상, 입력 토큰 10~20% 절감 예상

---

### 7. 완료 보고 포맷 압축

**문제**: 서술형 5줄 템플릿 반복 출력 → 출력 토큰 낭비  
**적용**: 불렛 2줄 압축 포맷

```
Before:
  ## 완료 보고
  **요청**: ...
  **수행 결과**: - ... - ...
  **확인 방법**: ...
  **참고**: ...

After:
  **완료**: <요청 한 줄>
  - <변경 1>
  - <변경 2>
  확인: <방법> | 참고: <부수효과>
```

출력 토큰 30~50% 절감 예상

---

## 수정된 파일 목록

| 파일 | 작업 유형 | 내용 |
|------|-----------|------|
| `CLAUDE.md` | 재작성 | 282줄 → 60줄 린 버전 + @import |
| `.claude/coding-principles.md` | 신규 | karpathy 원칙 (영문 원본) |
| `.claude/workflow.md` | 신규 | 대변인 루프 + XML 템플릿 + 델타 패턴 |
| `.claude/management.md` | 신규 | 충돌 판정 + 병렬 디스패치 + 프리징 감독 |
| `.claude/settings.local.json` | 수정 | 훅 경로 3개 수정 |
| `agentmanager/conventions.md` | 수정 | 재위임 규칙 + XML 템플릿 반영 |

---

## 참고 자료

- [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) — 코딩 원칙 출처
- [Anthropic Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic Long Context Tips](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips)
