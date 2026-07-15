# 작업 로그 / 2026-07-15 — CareerPrep 기반 랜딩페이지 구체화 세션

## 세션 목적

- `voyager-02-portfolio` 랜딩페이지를 `projects/Hermes/CareerPrep`의 지원 전략/포트폴리오 고려사항에 맞춰 구체화한다.
- 첫 화면에서 단순 개인 포트폴리오가 아니라 **EPID GAMES / PATIMA 지원용 시스템·콘텐츠 기획자 포지셔닝**이 드러나도록 조정한다.

## 대화에서 확정된 방향

1. **콘텐츠 방향**
   - CareerPrep 자료를 기준으로 “이야기와 맥락을 레벨, UI, 보상 흐름 안에 배치해 유저 체험을 강화하는 콘텐츠 기획자” 정체성을 랜딩페이지에 반영한다.
   - 랜딩페이지의 역할은 장식보다 “30초 안에 왜 이 사람인가”를 보여주는 지원용 첫 화면이다.

2. **폰트/타이포그래피 기준**
   - 사용자가 EPID Games 채용 페이지를 참조 사이트로 지정했다.
   - 전반 텍스트는 Pretendard 계열의 채용/리크루팅 사이트 톤으로 정리한다.
   - `Orbitron`은 `VOYAGER-02` 브랜드, telemetry, eyebrow, 숫자 HUD처럼 작은 장식/시스템 라벨에만 제한적으로 사용한다.
   - 한국어 본문, 제목, CTA, 카드, Markdown 본문은 가독성 중심의 Pretendard 역할군으로 이동한다.

3. **레이아웃 기준 — 신규 요청 / 다음 작업 후보**
   - 사용자가 `https://chokyunghwan98.github.io/game-designer-portfolio/`를 페이지 레이아웃 강한 참조 사이트로 지정했다.
   - 관찰한 레이아웃 특징:
     - 상단 넓은 여백의 수평 내비게이션과 홈/브랜드 영역
     - 좌측 대형 히어로 카피 + 우측 Table of Contents/목차형 패널
     - 섹션 번호 기반의 긴 스크롤 구조
     - 밝은 종이 질감 배경, 약한 노이즈/선/기하학 장식
     - 프로젝트 영역은 1개 대형 카드 + 2개 보조 카드의 비대칭 그리드
     - 넓은 섹션 간격과 큰 타이포그래피로 ‘기획자 포트폴리오’ 인상을 강화
   - 아직 레이아웃 개편은 적용하지 않았고, 이 커밋은 여기까지의 진행 상황 보존용이다.

## 이번 커밋에 포함된 실제 변경

- `src/styles/global.css`
  - Pretendard 웹폰트 import 추가
  - body/font token을 Pretendard 중심으로 재정의
  - 주요 한국어 읽기 텍스트의 `font-family`, `line-height`, `letter-spacing` 정리
  - `Orbitron` 사용 범위를 telemetry/brand/meta 계열로 축소

- `docs/worklog/2026-07-15-session-careerprep-landing.md`
  - 이 세션의 핵심 대화 정보, 결정 사항, 참조 사이트, 다음 작업 후보 기록

## 검증 메모

- 이전 확인: 로컬 브라우저에서 홈/프로젝트 페이지 폰트가 Pretendard 계열로 보이고, 장식 폰트가 과도하게 적용되지 않는 것을 시각 확인했다.
- 이번 푸시 전에는 `npm run build`로 정적 빌드가 통과하는지 재검증한다.

## 다음 작업 제안

1. `game-designer-portfolio` 참조를 바탕으로 홈 화면 구조를 재설계한다.
2. 기존 Voyager/PATIMA 톤은 유지하되, 레이아웃은 다음처럼 단순화한다.
   - Hero: 좌측 대형 포지셔닝 문장 / 우측 TOC 또는 지원 패킷 요약
   - Section 01: 지원 동기·정체성
   - Section 02: 포트폴리오 프로젝트 카드
   - Section 03: 핵심 역량
   - Section 04: 게임/콘텐츠 인사이트 또는 CareerPrep 근거
3. 프로젝트 카드는 1대형 + 2소형 비대칭 그리드로 전환한다.
