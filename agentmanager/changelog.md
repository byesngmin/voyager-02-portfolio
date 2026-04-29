# Changelog

## 2026-04

| Date | Agent | Task | Files Changed |
|------|-------|------|---------------|
| 2026-04-29 | claude-code | 하네스 초기 설정 복제 | CLAUDE.md, .claude/*, agentmanager/*, .agents/workflows/* |
| 2026-04-29 | claude-code | gemini-router.js exit 2→1 수정 (대변인 루프 복구) | .claude/hooks/gemini-router.js |
| 2026-04-29 | codex (via codex --search exec) | 타이포그래피 스케일 토큰화 + 반응형 레이아웃 재구성 | src/styles/global.css |
| 2026-04-29 | claude-code | Design v2 인계 반영 — 규약·태스크·결정 정리 | docs/handover-design.md, docs/decisions.md, agentmanager/conventions-design.md (신규), agentmanager/taskboard.md |
| 2026-04-29 | codex (B-01) | CSS 디자인 토큰 보강 (--bg-deep/base, spacing, shadow, timing) | src/styles/global.css |
| 2026-04-29 | codex (B-02) | 모바일 반응형 사이드바 (햄버거 + dialog) | src/components/Layout.tsx, src/styles/global.css |
| 2026-04-29 | codex (B-03/04) | 그리드·Hero 반응형 CSS | src/styles/global.css |
| 2026-04-29 | codex (B-05) | IntroGate 접근성 강화 (aria-busy, inert, focus) | src/components/IntroGate.tsx |
| 2026-04-29 | codex (B-06) | ?signal= 쿼리 시스템 구현 | src/lib/signals.ts (신규), src/routes/HomeRoute.tsx, src/routes/ProjectsRoute.tsx |
| 2026-04-29 | claude-code | resume.md 기술 역량 슬롯 추가 (SkillMatrix 데이터) | src/content/pages/resume.md |
| 2026-04-29 | codex (B-07) | ResumeRoute SkillMatrix 컴포넌트 + content.ts 타입 확장 | src/routes/ResumeRoute.tsx, src/lib/content.ts |
| 2026-04-29 | codex (B-08) | ProjectDetail 메타카드 + story-link 인용 + 하단 CTA | src/routes/ProjectDetailRoute.tsx |
| 2026-04-29 | codex (B-09) | Toast + ContactBlock 컴포넌트 생성 | src/components/Toast.tsx (신규), src/components/ContactBlock.tsx (신규) |
| 2026-04-29 | codex (B-10/11) | 인쇄 스타일 + reduced-motion 유틸리티 | src/styles/global.css |
| 2026-04-29 | claude-code | B-12 QA: TS noEmit + Vite build 통과 확인 | — |

---

## Archive

이전 월 기록은 `agentmanager/archive/` 에 월별로 보관한다.
