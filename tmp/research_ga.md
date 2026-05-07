## 핵심 시각 언어 특징 (3~5가지)

1. **고대비 데이터 컬러 체계 (High-Contrast Telemetry Palette)**
   * 심우주를 상징하는 깊은 배경(#0A0B10) 위에 극단적인 대비를 이루는 상태 색상(예: Cyan #40C4FF, Neon Green #00E676, Alert Red #FC3D21)을 사용.
   * **절제된 차용:** 본문과 UI의 80%는 무채색(밝은 회색)으로 유지하고, 핵심 성과 수치나 연도, 링크 요소에만 형광 포인트를 부여하여 대시보드의 긴장감을 연출.
2. **모노스페이스와 정보 정렬 (Monospace Typography & Tabular Lining)**
   * 우주 기관 및 SF UI는 끊임없이 변하는 데이터가 상하로 흔들리지 않도록 고정폭(Monospace) 폰트와 엄격한 좌우 정렬을 사용.
   * **절제된 차용:** Orbitron 폰트를 챕터 넘버링(예: `CH.01`, `LOG_45`)과 수치(진행 퍼센티지, 기간)에만 국한하여 사용. Noto Sans KR의 본문과 뚜렷한 정보 위계를 분리.
3. **구획 선 및 타겟팅 레티클 (Grid Lines & Targeting Reticles)**
   * 면(Surface)보다 선(Line)과 모서리를 강조. 1px 두께의 얇은 프레임과 각 모서리의 크로스헤어(┼), 코너 브라켓(⌜ ⌟)을 사용해 기계적인 관측 창의 느낌 전달.
   * **절제된 차용:** 각 자기소개 챕터 컨테이너의 모서리에만 브라켓 형태의 CSS border를 적용하고, 여백을 선으로 분리하여 정밀한 기획서를 보는 듯한 레이아웃 구성.

## 레퍼런스 사이트 목록 (URL + 핵심 학습 포인트, 최소 6개)

1. **SpaceX ISS Docking Simulator** (https://iss-sim.spacex.com/)
   * **학습 포인트:** 십자선(Crosshair)을 중심축으로 둔 HUD 대시보드의 실무적 레이아웃. 수치가 미세하게 변동할 때의 애니메이션 처리와 모노스페이스 폰트의 활용법.
2. **NASA Eyes on the Solar System** (https://eyes.nasa.gov/)
   * **학습 포인트:** 시간선을 제어하는 타임스크러버(Time Scrubber) 디자인. 항법 궤적 선(Line)을 시각화하고 챕터(행성) 간을 이동할 때의 시점 전환 및 줌 인/아웃 연출.
3. **InSpace** (https://inspace.wearemd.com/)
   * **학습 포인트:** 스크롤리텔링 기반의 우주 여정. 스크롤에 따라 은하계 파티클이 반응하며, 각 챕터가 페이드인/아웃으로 자연스럽게 교차되는 웹 최적화 연출.
4. **Active Theory** (https://activetheory.net/)
   * **학습 포인트:** SF/사이버펑크 미학의 웹 적용 1티어. CSS Custom Properties와 WebGL을 조합한 글리치 효과, 홀로그램 질감 및 매끄러운 라우트 트랜지션 기법.
5. **JAXA - Hayabusa2 Project** (https://www.hayabusa2.jaxa.jp/)
   * **학습 포인트:** 투박하지만 실제 우주 탐사 프로젝트가 문서를 구조화하고 기록하는 '데이터 아카이브'의 시각적 형태. '기록/보고서' 컨셉의 UI 벤치마킹.
6. **No Man's Sky - Galactic Atlas** (https://galacticatlas.nomanssky.com/)
   * **학습 포인트:** 게임 내 세계관을 웹 UI로 연장한 사례. 육각형(Hexagon) 그리드 패턴, SVG 아이콘 라인아트, 테크니컬한 사이드바 패널의 CSS 적용.

## 챕터 진행 시각화 제안 (3가지 구체적 아이디어)

1. **궤적 스윙바이 웨이포인트 (Orbital Swing-by Waypoints)**
   * 화면 좌측 또는 우측 10% 영역에 위에서 아래로 이어지는 하나의 얇은 점선을 배치.
   * 스크롤 진행에 따라 보이저 2호 아이콘(또는 단순한 빛의 점)이 선을 타고 이동하며, 6개의 챕터 진입점에 도달할 때마다 행성 아이콘 주변을 크게 도는 '스윙바이' 애니메이션(SVG path 기반) 발생.
2. **원격측정 로그 터미널 (Telemetry Log Terminal)**
   * 화면 상단 헤더를 고정(Sticky) 영역으로 두고, 미션 컨트롤의 터미널 창처럼 구성.
   * 스크롤에 맞춰 현재 섹션의 상태 텍스트가 타이핑 효과로 갱신. (예: `[SYS] ENGAGING CH.02: ORIGIN_EXPERIENCE... [OK]`, `[NAV] ALTITUDE: 35,000 KM`). 서사 진행도를 우주선의 현재 상태 메시지로 은유.
3. **고도계/가속도계 스타일 스크롤 인디케이터 (Altimeter Scroll Indicator)**
   * 전통적인 웹 진행률 바(Progress bar) 대신, 우주선의 고도계 디자인을 차용.
   * 세로로 된 자(Ruler) 눈금 디자인이 스크롤 속도에 비례해 위아래로 움직이며, 중앙의 하이라이트 박스 안에 현재 챕터 번호와 스크롤 위치값(거리 데이터로 치환된 숫자)을 밀리초 단위로 표시.

## SF HUD → 웹 UI 적용 기법 (CSS/HTML 수준으로)

1. **잘린 모서리 패널 (Chamfered Panels)**
   * 미래지향적 기계 부품 느낌을 주기 위해 `clip-path`를 사용하여 컨테이너의 모서리를 대각선으로 자름.
   ```css
   .hud-panel {
     background-color: var(--color-deep-navy);
     border: 1px solid var(--color-cyan);
     /* 우측 상단과 좌측 하단 모서리를 자름 */
     clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
   }
   ```

2. **코너 타겟팅 브라켓 (Corner Brackets)**
   * 가상 요소(`::before`, `::after`)를 활용해 HTML 마크업 추가 없이 챕터 제목이나 이미지 모서리에 UI 브라켓 추가.
   ```css
   .target-box {
     position: relative;
   }
   .target-box::before {
     content: '';
     position: absolute;
     top: -5px; left: -5px;
     width: 15px; height: 15px;
     border-top: 2px solid var(--color-cyan);
     border-left: 2px solid var(--color-cyan);
   }
   /* 우측 하단 브라켓을 위해 ::after 유사하게 적용 */
   ```

3. **홀로그램 텍스트 & 약한 글리치 효과 (Holographic Text)**
   * `text-shadow`를 활용해 CRT 모니터의 RGB 분리 현상(색수차)과 빛 번짐 효과 부여.
   ```css
   .hud-text-glitch {
     font-family: 'Orbitron', monospace;
     color: #fff;
     text-shadow:
       0 0 5px rgba(64, 196, 255, 0.8),
       -1px 0 0px rgba(252, 61, 33, 0.6),
       1px 0 0px rgba(0, 230, 118, 0.6);
   }
   ```

4. **스캔라인 오버레이 (CRT Scanlines Overlay)**
   * 전체 화면이나 특정 데이터 패널 위에 반투명한 가로선 패턴을 겹쳐 기계 화면 특유의 질감 생성. 클릭을 방해하지 않도록 `pointer-events: none` 처리 필수.
   ```css
   .scanline-overlay {
     position: fixed;
     top: 0; left: 0; width: 100%; height: 100%;
     background: linear-gradient(
       to bottom,
       rgba(255,255,255,0),
       rgba(255,255,255,0) 50%,
       rgba(0,0,0,0.1) 50%,
       rgba(0,0,0,0.1)
     );
     background-size: 100% 4px; /* 4px 간격 스캔라인 */
     pointer-events: none;
     z-index: 9999;
   }
   ```
