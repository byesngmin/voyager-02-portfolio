# 우주 테마 포트폴리오 자기소개 페이지 리서치

- 조사일: 2026-05-07
- 목적: 우주/SF 감성을 유지하면서도 채용용 자기소개 페이지가 `읽히고`, `접근 가능하고`, `모바일에서 무너지지 않게` 만드는 기준 정리
- 해석 메모: `첫 10초` 관련 정량 근거는 포트폴리오 전용 eye-tracking보다 이력서/웹 첫인상 연구가 더 풍부하다. 아래 채용 섹션은 TheLadders의 빠른 스캔 연구, Google의 첫인상 연구, Epic/Riot 공식 포트폴리오 가이드를 결합한 실무적 추론이다.
- 수치 메모: 대비율 예시는 WCAG relative luminance 공식으로 별도 계산했다.

## 1. 우주/SF 테마 포트폴리오의 흔한 실패 패턴

### 1-1. 과잉 장식으로 가독성을 해치는 패턴

- DO: 첫 화면은 `이름 / 목표 직군 / 한 줄 소개 / 대표 CTA`가 배경 효과보다 먼저 읽히게 만든다.
- DON'T: `parallax + particle + blur + glow + auto-typing + orbit animation`을 동시에 얹어 텍스트와 경쟁시키지 않는다.
- DO: 우주감은 `한 가지 강한 모티프`로 유지한다. 예: 정적인 딥 네이비 그라디언트 + 희박한 성운 텍스처 + 1개의 강조색.
- DON'T: 스크롤 때마다 화면 전체가 다시 칠해지는 연출을 자기소개 본문 위에 올리지 않는다.
- 근거: Google Research에 실린 Tuch et al. 연구는 `low visual complexity + high prototypicality` 조합이 매우 짧은 노출 시간(50ms 수준)부터 더 긍정적인 첫인상을 만든다고 보고했다. web.dev는 parallax를 스크롤 성능에 매우 비싼 패턴으로 설명한다.

### 1-2. 컨셉에 집착해 정보 전달이 실패하는 패턴

- DO: SF 카피를 쓰더라도 표준 정보구조(`About`, `Projects`, `Contact`, `Resume`)를 병기한다.
- DON'T: `Mission Log`, `Docking Bay`, `Transmission` 같은 컨셉 메뉴만 두고 실제 의미를 추측하게 만들지 않는다.
- DO: 세계관은 헤드라인 톤과 비주얼에서만 쓰고, 채용 정보는 즉시 해석 가능한 명칭으로 둔다.
- DON'T: 자기소개 첫 문단을 장문의 설정집처럼 시작하지 않는다.
- 근거: Epic은 포트폴리오에서 `simplicity`, `minimal clicks`, `show strongest work quickly`를 반복해 강조한다. Riot도 접근 가능하고 바로 열리는 포트폴리오, 몇 개의 강한 작업, role-fit을 요구한다.
- 실무 해석: 우주/SF 컨셉은 `브랜딩 레이어`로는 유효하지만 `정보 구조 레이어`까지 잠식하면 채용자 스캔 속도와 충돌한다.

### 1-3. `멋있지만 채용에 실패한` 포트폴리오의 공통 문제

- DO: 역할 적합도, 대표 작업, 본인 기여, 사용 도구, 결과물 진입점을 한두 번의 클릭 안에 보여준다.
- DON'T: 인트로 애니메이션, 파일 다운로드 강제, 로그인/비밀번호, 미완성 작업 다수, 역할 설명 없는 이미지 모음으로 검토 시간을 소모시키지 않는다.
- DO: 게임 직군이면 `playable`, `video walkthrough`, `repo`, `breakdown` 중 최소 하나를 즉시 접근 가능하게 둔다.
- DON'T: “분위기”만 강하고 `무슨 직군에 왜 맞는 사람인지`가 보이지 않는 구조로 끝내지 않는다.
- 근거: TheLadders의 eye-tracking 연구는 채용 검토가 약 6초~7.4초 수준의 빠른 스캔으로 시작된다는 점을 보여준다. Epic은 `strongest work with minimal clicks`, `only best and complete pieces`, `role/software/achievements commentary`, `playable or walkthrough`, `no paywall/download if possible`를 강조한다. Riot은 `best work`, `accessible`, `few good pieces`, `thought process`를 요구한다.

## 2. 다크 테마 포트폴리오 접근성 가이드라인

### 2-1. WCAG 대비율: 딥 네이비 배경 + 연한 텍스트 검증

- WCAG/MDN 기준:
- 일반 본문 텍스트 AA: `4.5:1` 이상
- 일반 본문 텍스트 AAA: `7:1` 이상
- 큰 텍스트 AA: `3:1` 이상
- 아이콘/그래픽/UI 경계 AA: `3:1` 이상

배경 `#081120` 기준 계산 예시:

| 전경색 | 대비율 | 판정 | 권장 용도 |
| --- | ---: | --- | --- |
| `#E6EDF7` | `16.04:1` | AAA | 제목, 본문 |
| `#9FB3C8` | `8.78:1` | AAA | 세컨더리 본문 |
| `#7A8CA5` | `5.51:1` | AA | 메타 정보, 보조 설명 |
| `#6B7C93` | `4.44:1` | 본문 AA 실패 | 큰 텍스트 외 비추천 |
| `#55657A` | `3.18:1` | 본문 실패, non-text 통과 가능 | 구분선, 비활성 UI 정도 |

- DO: 다크 테마라도 모든 상태값(`default`, `hover`, `focus`, `disabled`)을 실제 대비율로 측정한다.
- DON'T: “어두우니까 감성적”이라는 이유로 저대비 회색 본문을 허용하지 않는다.
- DO: 본문은 `AAA`에 가깝게, 메타 정보도 최소 `AA`를 지키는 편이 안전하다.
- DON'T: 비활성/보조 텍스트를 너무 빨리 배경색에 가깝게 밀어 넣지 않는다.

### 2-2. 색상 정보에만 의존하지 않는 정보 전달

- DO: 색상 + 텍스트 + 아이콘 + 형태를 함께 쓴다.
- DON'T: `red = 에러`, `green = 성공`, `neon blue = 클릭 가능`만으로 의미를 전달하지 않는다.
- DO: 링크는 `색상 + 밑줄`, 상태는 `색상 + 라벨`, 현재 섹션은 `색상 + 굵기/indicator bar`로 구분한다.
- DON'T: 컬러 블롭이나 점 하나로만 상태를 표현하지 않는다.
- 수치: 색으로만 구분되는 두 상태를 쓸 경우, 추가 단서가 없으면 WCAG 1.4.1 위반 위험이 있다. 밝기 차이만으로도 구분으로 인정받으려면 두 색 사이 대비가 `3:1` 이상이어야 한다.
- 예시:
- `Available for Game UI/UX`: 초록 점만 두지 말고 `● Available for Game UI/UX`처럼 텍스트 병기
- `Selected Project`: 파란색 카드만 두지 말고 `Selected` 배지나 아이콘 추가

### 2-3. `prefers-reduced-motion` 처리 패턴

- DO: `@media (prefers-reduced-motion: reduce)`에서 파티클, 패럴랙스, orbit, scale-in, smooth scroll을 끈다.
- DON'T: 스크롤할 때 별/행성/배경이 서로 다른 속도로 움직이게 하거나, 인터랙션 결과를 모션으로만 전달하지 않는다.
- DO: 모션이 사라져도 정보 구조와 위계는 동일하게 유지한다.
- DON'T: “감성”을 이유로 감속만 하고 실제 움직임은 계속 남겨 두지 않는다.
- 기준:
- W3C SC 2.3.3: 상호작용으로 트리거되는 비필수 모션은 꺼질 수 있어야 한다.
- W3C C39/SCR40: CSS/JS에서 `prefers-reduced-motion`를 사용해 비필수 모션을 막을 수 있다.

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  .starfield,
  .parallax,
  .orbit,
  .section-enter {
    animation: none !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}
```

- 실무 메모: 우주감은 모션이 아니라 `색`, `질감`, `도형`, `타이포`로도 충분히 유지된다.

## 3. 모바일에서 우주/SF 감성을 유지하면서 가독성을 확보하는 전략

### 3-1. 복잡한 배경 효과를 모바일에서 단순화하는 기법

- DO: 모바일에서는 다층 패럴랙스를 `정적 그라디언트 + 1개의 약한 텍스처 + 1개의 강조 일러스트` 수준으로 다운그레이드한다.
- DON'T: 데스크톱의 파티클 수, blur radius, canvas animation, full-screen video background를 그대로 유지하지 않는다.
- DO: 장식 이미지는 `srcset`/`picture`로 기기 해상도에 맞게 줄이고, 비핵심 이미지는 lazy-load 한다.
- DON'T: 정보 가치가 없는 장식 이미지를 모바일에 그대로 싣지 않는다.
- 근거: NN/g는 모바일에서 장식 이미지는 페이지를 길게 만들고 로딩을 느리게 하므로 피하라고 조언한다. web.dev는 parallax가 스크롤 중 페이지 전체 repaint를 유발하기 쉽다고 경고하고, 이미지도 기기에 맞는 소스를 제공하라고 권한다.
- 실무 heuristic:
- `<= 768px`: 모션 배경 제거, 정적 배경으로 대체
- 배경 이미지: `1x/2x/3x` 소스 분기

### 3-2. 세로 스크롤 중심 모바일에서 챕터 인디케이터 처리 방법

- DO: 모바일은 `상단 얇은 progress bar` 또는 `접을 수 있는 compact TOC`가 더 안전하다.
- DON'T: 데스크톱 사이드 TOC를 억지로 유지하거나, 별도 스크롤이 필요한 미니맵/인페이지 스크롤 영역을 넣지 않는다.
- DO: TOC를 쓴다면 최상위 섹션만 노출하고 현재 섹션을 하이라이트한다.
- DON'T: TOC를 전체 사이트 네비게이션처럼 쓰지 않는다.
- 수치/기준:
- W3C Target Size (Minimum): 터치 가능한 인디케이터/TOC 항목은 최소 `24 x 24 CSS px`
- ONS 디자인 시스템: 긴 페이지 TOC는 스크롤 중에도 접근 가능해야 하며 현재 섹션을 표시해야 한다.
- UK Intelligence Community 디자인 시스템: TOC는 최상위 heading 중심으로 짧게 유지하고, heading이 2개 미만이면 쓰지 않는 편이 낫다.
- Best practice for this page:
- 섹션이 `3~5개`면 progress bar
- 섹션이 `6개 이상`이거나 섹션별 길이가 길면 `현재 섹션명 + progress bar`
- `About / Skills / Philosophy / Contact` 정도의 자기소개 페이지면 full TOC보다 compact indicator가 대체로 낫다

### 3-3. 긴 자기소개 텍스트의 모바일 타이포그래피 최적화

- DO: 단일 컬럼, 본문 `16-18px` 실무 baseline, line-height `1.5-1.6`, 줄 길이 `50-75자`를 목표로 하고 `80자`를 넘기지 않는다.
- DON'T: 12-14px의 얇은 글자, 긴 centered paragraph, 다단 레이아웃, 좁은 카드 안의 긴 본문, 데스크톱용 긴 줄폭을 모바일에 유지하지 않는다.
- DO: 긴 문단은 `2-4문장` 단위로 끊고 소제목/짧은 리스트로 스캔 가능하게 만든다.
- DON'T: 세계관 서사와 자기소개를 한 문단에 길게 합쳐 “한 번에 다 읽어야만 이해되는” 블록을 만들지 않는다.
- 수치/기준:
- Apple HIG: iOS/iPadOS 기본 텍스트 크기 `17pt`, 최소 `11pt`
- Baymard: 이상적 줄 길이 `50-75자`, 접근성 관점 상한 `80자`
- W3C SC 1.4.4: 텍스트는 `200%`까지 확대되어도 내용/기능 손실이 없어야 한다.
- 주의: `16-18px`은 WCAG의 직접 요구사항은 아니고, 긴 모바일 자기소개 페이지에 대한 안전한 실무 baseline이다.
- Self-intro page recommendation:
- hero summary: `2-3줄`
- 본문 단락: `2-4문장`
- 핵심 강점/경력/기술: 긴 prose 한 덩어리보다 `bullet islands`로 분리
- 긴 narrative가 꼭 필요하면 `요약 -> 자세한 이야기` 2단 구조로

## 4. 채용 담당자 관점에서 포트폴리오 `첫 10초` 디자인 원칙

### 4-1. 자기소개 페이지에서 즉시 전달되어야 할 정보의 우선순위

- DO: 위에서부터 아래 순서로 `이름`, `목표 직군`, `무엇을 만드는 사람인지`, `대표 작업 진입`, `연락/이력서`를 배치한다.
- DON'T: 첫 화면을 분위기용 일러스트, 우주 세계관 카피, 긴 자기소개 서문으로 채우지 않는다.
- DO: 첫 문장에서 `role-fit`이 바로 보이게 쓴다. 예: `Game UI/UX Designer focused on readable sci-fi interfaces`.
- DON'T: `passionate creator`, `dreamer`, `explorer` 같은 일반론으로 시작하지 않는다.
- 근거: TheLadders eye-tracking은 검토 초기에 직함/경력 신호를 매우 빠르게 스캔함을 보여준다. Epic도 강한 작업을 최소 클릭으로 보게 하라고 말한다.

### 4-2. 스크롤을 유도하는 첫 화면(above the fold) 설계 원칙

- DO: 첫 화면에서 핵심 메시지는 다 보여주되, 다음 섹션의 일부나 progress cue가 살짝 보이게 해서 아래 콘텐츠가 있다는 신호를 준다.
- DON'T: 화면 하단을 강한 수평선이나 꽉 찬 풀스크린 비주얼로 닫아 `여기가 끝`처럼 보이게 만들지 않는다.
- DO: hero의 역할을 `전부 설명하기`가 아니라 `계속 읽을 이유 만들기`로 정의한다.
- DON'T: 내부 scroll box로 자기소개 본문을 가두지 않는다.
- 근거: CXPartners user testing 800회 요약에 따르면 사람들은 충분히 스크롤하지만, false bottom을 만들면 탐색이 줄어든다. 적절한 whitespace와 아래로 이어지는 시각 단서는 스크롤을 유도한다.

### 4-3. 게임 직군 특화 포트폴리오 평가 기준

- DO:
- 프로그래밍: `repo`, `C++/Unreal` 사용 흔적, 기술 설명, published build/demo, whitepaper/README
- 게임 디자인/UI/UX: video walkthrough, playable module, wireframe, post-mortem, 개선 이유 설명
- 아트/환경/VFX: 완성본 + WIP/breakdown + tool chain + 인게임/인엔진 shot + target style alignment
- DON'T:
- role mismatch한 작업만 잔뜩 보여주기
- 튜토리얼 흔적이 강한 작업을 설명 없이 나열하기
- 팀 프로젝트에서 내 기여를 숨기기
- 다운로드해야만 볼 수 있게 만들기
- Why: Riot은 타깃 게임의 feel/tone/look 정렬, thought process, best work, accessibility를 강조한다. Epic은 `role/software/achievements`, `only best and complete pieces`, `playable or walkthrough`, `C++/Unreal evidence`, `breakdowns`를 명확히 요구한다.
- Hiring interpretation:
- 게임 포트폴리오는 “미감”만이 아니라 `파이프라인 이해`, `도구 숙련`, `의사결정 설명력`, `직무 적합성`을 본다.
- 따라서 우주/SF 테마는 `심미적 wrapper`까지만 맡기고, 평가 신호는 표준적이고 즉시 읽히게 드러내야 한다.

## 빠른 결론

- 우주/SF 테마 포트폴리오의 핵심 리스크는 `시각 복잡도`, `비표준 정보구조`, `과한 모션`, `역할 신호 부족`이다.
- 다크 테마는 감성보다 먼저 `4.5:1 / 7:1 / 3:1` 기준으로 검증해야 한다.
- 모바일에서는 “우주감의 밀도”보다 “읽히는 정보량”이 우선이다.
- 채용용 자기소개 페이지의 첫 화면은 영화 오프닝이 아니라 `역할 적합도 요약 카드`여야 한다.

## Sources

- Google Research, *The role of visual complexity and prototypicality regarding first impression of websites*: https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/
- web.dev, *Parallaxin'*: https://web.dev/articles/speed-parallax?hl=en
- WIRED, *Debunking the Myth of the Page Fold in Web Design* (CXPartners study summary): https://www.wired.com/2009/10/debunking-the-myth-of-the-page-fold-in-web-design/
- MDN, *Color contrast*: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast
- W3C WAI, *Understanding SC 1.4.1 Use of Color*: https://www.w3.org/WAI/WCAG20/Understanding/use-of-color
- W3C WAI, *Understanding SC 2.3.3 Animation from Interactions*: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- W3C WAI, *Technique C39: Using the CSS prefers-reduced-motion query to prevent motion*: https://www.w3.org/WAI/WCAG21/Techniques/css/C39
- W3C WAI, *Understanding SC 2.5.8 Target Size (Minimum)*: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C WAI, *Understanding SC 1.4.4 Resize Text*: https://www.w3.org/WAI/WCAG22/Understanding/resize-text
- Apple Human Interface Guidelines, *Typography*: https://developer.apple.com/design/human-interface-guidelines/typography
- Baymard Institute, *Readability: The Optimal Line Length*: https://baymard.com/blog/line-length-readability
- Nielsen Norman Group, *Images on Mobile*: https://www.nngroup.com/videos/mobile-images/?lm=supporting-multiple-location-users&pt=article
- Office for National Statistics Design System, *Table of contents*: https://service-manual.ons.gov.uk/design-system/components/table-of-contents
- Intelligence Community Design System, *Table of contents*: https://design.sis.gov.uk/components/table-of-contents/
- Epic Games, *Career Paths*: https://www.epicgames.com/site/earlycareers/career-paths?lang=en-US
- Riot Games, *Portfolio and Reel Suggestions*: https://www.riotgames.com/en/portfolio-and-reel-suggestions
- TheLadders, *Is it true that recruiters reject a resume in six seconds?*: https://www.theladders.com/career-advice/is-it-true-that-recruiters-reject-a-resume-in-six-seconds
