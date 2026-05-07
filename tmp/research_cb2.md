# UX 서사 & 타이포그래피 리서치 — gemini-B 정반합 대응 검색

- 조사일: 2026-05-07
- 초점: 사례/감상보다 `수치 근거`, `실험`, `연구 데이터` 우선
- 해석 원칙:
  - `직접 근거`: 실험/관찰 데이터가 그대로 있는 항목
  - `대리 근거`: 포트폴리오 자기소개 페이지를 직접 다루지는 않지만, 긴 글 읽기/채용 스크리닝/긴 페이지 탐색 연구를 자기소개 페이지에 전용한 항목
  - `추론`: 연구 데이터를 디자인 값으로 변환한 실무 제안
- 한계:
  - `게임 기획자 포트폴리오 자기소개 페이지`만을 따로 측정한 eye-tracking 연구는 거의 찾지 못했다.
  - `Orbitron + Noto Sans KR` 조합을 직접 비교한 실험도 찾지 못했다.
  - Damien Bel / Jason Yuan 사이트의 정확한 CSS는 공개 HTML/JS 접근 한계로 완전 검증하지 못했다. 이런 항목은 `관찰 기반 범위`로 따로 표기한다.

## 빠른 결론

| 항목 | 권장값 | 근거 성격 | 왜 이 값인가 |
| --- | --- | --- | --- |
| 한글 본문 크기 | 모바일 `16px`, 데스크톱 `17px~18px` | 직접 근거 + 추론 | 스마트폰 실험에서 `12pt`가 `9pt`보다 가독성이 좋았고, 작은 화면용 한글은 더 굵고 더 넓고 더 크게 설계하는 쪽이 유리했다. |
| 한글 본문 line-height | `1.58~1.68` | 직접 근거 + 추론 | 스마트폰 연구에서 `160%` 행간이 `100%`보다 낫고, 한글 가독성에서 행간은 가장 영향력이 큰 요소로 반복 지목되었다. |
| 한글 본문 letter-spacing | `0.005em~0.01em` | 직접 근거 + 추론 | 한글 모바일용 Noto Sans 연구는 글자 사이를 늘리라고 제안하지만, 한글 자간은 음절 조합 의존성이 커서 기본값을 크게 벌리면 오히려 리듬이 깨질 수 있다. |
| 한글 본문 max-width | `34em` 부근, 또는 `약 38~40자/행` | 직접 근거 + 추론 | Baymard/WCAG는 CJK 본문을 `40자 이하`로 보는 쪽을 지지한다. |
| 다크 배경 본문 색 | 순백 대신 `#E6EDF3` 전후의 off-white | 직접 근거 + 추론 | 밝은 글자/어두운 배경은 작은 글자에서 불리하고, 극단적 대비는 번짐과 피로를 만들기 쉽다. |
| 다크 배경 본문 weight | `400` 또는 `500` | 직접 근거 + 추론 | 작은 화면용 한글은 더 굵게, 다크 배경의 작은 글자는 더 키워야 한다는 연구가 합쳐질 때 `400~500`이 안전하다. |
| Orbitron 사용 범위 | 본문 금지, `eyebrow / chapter title / 숫자 배지 / hero heading` 전용 | 추론 | Orbitron은 display 계열이고, 긴 한글 문단에는 Noto Sans KR이 훨씬 안정적이다. |
| Orbitron : Noto Sans KR 비율 | eyebrow `1.15x`, chapter title `2.1x~2.6x`, hero `3.3x~4.0x` | 추론 | 직접 실험은 없지만, 한글 본문 가독성 연구 + display/body 역할 분리를 합치면 이 비율이 가장 무난하다. |
| 챕터 네비게이션 | 데스크톱 `sticky rail + active section + progress`, 모바일 `상단 pill/segmented nav` | 직접 근거 + 추론 | Baymard에서 sticky TOC는 발견률이 높았고, NNG TOC 가이드는 sticky + progress 조합을 긍정적으로 본다. |

## 1. 긴 자기소개 텍스트 페이지의 UX 연구 데이터

### 1-1. 실제로 얼마나 읽는가

- `직접 근거`: NN/g의 [How Little Do Users Read?](https://www.nngroup.com/articles/how-little-do-users-read/)는 정제 후 `45,237` 페이지뷰를 분석했고, 평균 페이지에서 사용자가 읽을 수 있는 최대치는 단어의 `28%`, 현실적으로는 `20%` 정도라고 정리했다.
- `직접 근거`: 같은 연구에서 사용자는 `111단어 이하`인 페이지에서만 정보의 절반 정도를 읽을 시간이 있었고, 텍스트를 `100단어` 늘릴 때 평균 체류 증가는 `4.4초`뿐이었다.
- `직접 근거`: NN/g의 [F-shaped Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)은 `45명+`의 시선 데이터를 기반으로, 사용자가 상단 가로줄을 먼저 훑고 그 아래를 더 짧게 읽은 뒤 왼쪽 축을 따라 내려가는 패턴을 재확인했다.
- `대리 근거`: 이 수치는 `포트폴리오 자기소개`에도 거의 그대로 적용된다. 긴 서사형 자기소개라고 해도 첫 1~2 스크린 밖의 텍스트는 읽히지 않을 확률이 급격히 오른다.

### 1-2. 사용자는 화면의 어디까지 보는가

- `직접 근거`: NN/g의 [Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)은 `120명`, `130,000+` eye fixation을 분석했다.
- `직접 근거`: 2018 데이터에서 사용자는 페이지 보기 시간의 `57%`를 fold 위에서 보냈고, 첫 `2`개 screenful 안에 `74%`, 상단 `20%` 구간에 `42%+`, 상단 `40%` 구간에 `65%+`를 썼다.
- `직접 근거`: 같은 연구는 현재도 사용자가 `세 번째 screenful`을 거의 넘지 않는다고 해석했다. 즉, 예전의 “fold 장벽”이 `첫 화면`에서 `세 번째 화면`쯤으로 내려갔을 뿐 사라지지 않았다.
- `직접 근거`: NN/g의 [The Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/)는 fold 위와 아래를 다루는 방식 차이가 평균 `84%`나 된다고 요약한다.
- `추론`: 자기소개 페이지의 첫 2~3 screenful 안에는 최소한 `정체성`, `역할 적합성`, `대표 성과`, `다음 챕터로 내려갈 이유`가 모두 있어야 한다.

### 1-3. 채용 담당자는 무엇을 읽고 무엇을 건너뛰는가

- `직접 근거`: TheLadders의 eye-tracking 연구를 인용한 [PR Newswire 발표](https://www.prnewswire.com/news-releases/theladders-reveals-that-job-seekers-have-six-seconds-to-succeed-143629046.html)와 [2020 후속 글](https://www.theladders.com/career-advice/you-only-get-6-seconds-of-fame-make-it-count)에 따르면, 채용 담당자는 첫 스캔에 평균 `7.4초` 정도를 쓰며, 이 시간의 `80%`를 `이름`, `현재/이전 직함`, `회사`, `근무 시작/종료일`, `학력`에 사용했다.
- `직접 근거`: [Using Machine Learning with Eye-Tracking Data to Predict if a Recruiter Will Approve a Resume](https://www.mdpi.com/2504-4990/5/3/38)는 이력서 스크리닝이 평균 `30초~3분` 사이라고 정리한다.
- `직접 근거`: 같은 논문은 `소개(introduction)`, `skills`, `projects`, `address` AOI의 시선 데이터는 합격/탈락 이력서 사이에서 큰 차이를 만들지 못했고, `Experience`와 `Education` 쪽이 더 중요했다고 보고했다.
- `직접 근거`: 특히 `Experience` AOI는 중요 특징으로 `4번` 등장했고, 해당 영역을 더 오래 본 이력서가 다음 단계로 넘어갈 상관이 있었다.
- `대리 근거`: 포트폴리오 자기소개 페이지에서도 “나는 어떤 사람인가”의 감성 문단보다 `무엇을 만들었는가`, `어떤 역할에 맞는가`, `어떤 결과를 냈는가`가 먼저 보여야 한다.
- `추론`: 자기소개 서사는 `이력`을 대체하면 안 되고, `이력/프로젝트를 읽게 만드는 컨텍스트` 역할을 해야 한다.

### 1-4. 긴 글 페이지에서 scroll depth를 높이는 검증된 패턴

- `직접 근거`: Baymard의 [Horizontal Tabs를 피하라](https://baymard.com/blog/avoid-horizontal-tabs) 연구에서 탭형 레이아웃은 사용자의 `27%`가 핵심 콘텐츠를 놓쳤다.
- `직접 근거`: 같은 글에서 `One Long Page with a Sticky TOC`는 sticky TOC를 놓친 사용자가 `7%`뿐이었고, 탭보다 훨씬 안전한 패턴으로 제시됐다.
- `직접 근거`: Baymard는 여전히 사이트의 `28%`가 문제 많은 horizontal tabs를 쓴다고 적었다.
- `직접 근거`: NN/g의 [TOC Design Decision Tree PDF](https://media.nngroup.com/media/articles/attachments/Table_of_Contents_Design_Decision_Tree_and_Common_Combinations.pdf)는 `sticky + progress indication` 조합을 “항상 접근 가능”, “스크롤 진행 피드백 제공”, “subtle animation이 discoverability와 delight를 올림”으로 정리한다.
- `직접 근거`: Chartbeat의 [article length vs engagement 연구](https://chartbeat.com/resources/articles/is-there-an-optimal-article-length-the-relationship-between-word-count-and-engagement/)는 `2019-01 ~ 2022-04` 사이 `10,000단어 이하` 기사 수백만 건을 분석했고, `0~2,000단어` 구간에서는 길수록 engaged time이 증가하지만, `4,000단어`를 넘기면 성과 변동성이 커진다고 봤다.
- `직접 근거`: 같은 연구에서 `6,000단어` 글의 평균 engaged time은 `80초`였다.
- `직접 근거`: Chartbeat의 [Engaged Time 연구](https://chartbeat.com/resources/research/using-engaged-time-to-understand-your-audience/)는 `100,000` 페이지 방문 샘플 중 `34,000`건 정도가 `15초 미만` 상호작용 후 이탈했다고 적었다.
- `추론`: 긴 자기소개 페이지는 단순히 길게 쓰는 것으로는 scroll depth가 오르지 않는다. `sticky chapter nav`, `중간 요약`, `숫자 배지`, `프로젝트 미리보기`, `명확한 다음 챕터 표지` 같은 “계속 내려가게 만드는 단위 사건”이 필요하다.

## 2. 게임 기획자/게임 디자이너 포트폴리오 자기소개 우수 사례

### 2-1. Brittany Chiang 스타일 scroll spy 네비게이션 구현 방식

- `직접 관찰`: 현재 [brittanychiang.com](https://brittanychiang.com/) 공개 HTML은 `About`, `Experience`, `Projects`의 인페이지 섹션 앵커 구조를 드러낸다.
- `직접 관찰`: 현재 사이트는 본문 하단에 `Built with Next.js and Tailwind CSS`와 `All text is set in Inter`를 명시한다.
- `직접 근거`: Brittany의 예전 포트폴리오인 [v4 GitHub 저장소](https://github.com/bchiang7/v4)는 공개되어 있으며, 해당 스타일이 오픈소스로 널리 복제되었다.
- `추론`: Brittany 스타일을 구현할 때 핵심은 `왼쪽 고정 rail`, `섹션 앵커`, `현재 섹션 하이라이트`, `짧은 챕터 리스트`, `본문과 rail의 2열 분리`다.

실무 구현 레시피:

1. 본문을 `section[id]` 단위로 나눈다.
2. 데스크톱에서 rail을 `position: sticky`로 상단 `80~112px` 아래에 고정한다.
3. `IntersectionObserver`로 현재 섹션을 추적한다.
4. active 상태는 색만 바꾸지 말고 `indicator bar`, `번호`, `weight`도 함께 바꾼다.
5. 모바일에서는 왼쪽 rail 대신 `상단 segmented pill nav`나 `챕터 드롭다운`으로 축약한다.

권장 파라미터:

```ts
const observer = new IntersectionObserver(callback, {
  root: null,
  rootMargin: "-35% 0px -45% 0px",
  threshold: [0, 0.25, 0.5, 0.75, 1],
});
```

- `추론`: 이 값은 Brittany의 소스를 직접 추출한 값이 아니라, `현재 섹션이 화면 중앙 근처에서 바뀌는 느낌`을 주는 실무용 기본값이다.
- `직접 근거`: sticky TOC 자체의 UX 타당성은 앞의 Baymard/NNG 자료가 뒷받침한다.

### 2-2. Damien Bel, Jason Yuan 계열 서사형 포트폴리오에서 읽을 수 있는 타이포그래피 수치

#### Damien Bel

- `직접 관찰`: [Damien Bel 포트폴리오](https://damienbelgames.com/)는 첫 화면 근처에 `3+ Years in the Industry`, `4 Shipped Products`, `100+ Happy Coworkers`, `12 Awards` 같은 `정량 배지`를 배치한다.
- `직접 관찰`: 프로젝트 블록에는 `74`, `79%`, `Team of ~25`, `Unity`, `Action-RPG` 같은 짧은 수치/태그가 반복된다.
- `직접 관찰`: 챕터 전환은 `대형 프로젝트 이미지`, `역할 라벨`, `성과 숫자`, `긴 서사 문단`, `인용 블록`의 반복 리듬으로 만들어진다.
- `관찰 기반 범위`: body copy는 시각적으로 `18px~20px` 정도, line-height는 `1.55~1.7`, 한 줄 폭은 `34em~40em` 정도로 보인다.

#### Jason Yuan

- `직접 관찰`: [UX Portfolios의 Jason Yuan 소개](https://www.uxportfolios.design/portfolios/jason-yuan)는 현재 [jasonyuan.design](https://jasonyuan.design/)을 `Dark Mode` 포트폴리오로 분류한다.
- `직접 관찰`: 공개 HTML 스냅샷은 JS-only라 precise CSS 추출이 불가능했다.
- `판단`: Jason Yuan은 `시각 레퍼런스`로는 유효하지만, 현재 공개 상태만으로 `font-size`, `line-height`, `max-width`를 신뢰도 있게 숫자화하기 어렵다.

#### 이 계열 사이트에 공통으로 적용 가능한 수치

- `추론`: narrative portfolio의 본문은 `17px~18px`, line-height `1.6` 전후, max-width `34em` 전후가 가장 안전하다.
- `추론`: chapter title은 본문 대비 `2.1x~2.6x`, hero title은 `3.3x~4.0x` 정도에서 “서사형인데 읽히는” 균형이 맞는다.
- `추론`: 숫자 배지는 본문보다 크고 제목보다 작은 `24px~32px`가 적절하며, label은 `11px~13px` 정도의 짧은 산세리프로 붙이는 방식이 스캔 효율이 높다.

### 2-3. 챕터 전환을 시각적으로 구분하는 방법

- `직접 관찰`: Damien Bel은 단락만으로 챕터를 나누지 않고, `이미지`, `숫자`, `역할 태그`, `인용문`, `프로젝트 제목`을 번갈아 배치한다.
- `추론`: 서사형 자기소개 페이지에서 챕터 전환은 아래 중 최소 2개 이상이 동시에 바뀌어야 한다.
- 배경 톤 또는 surface 톤
- 제목 체계
- 미디어 유무
- 숫자 배지 유무
- 좌우 정렬 리듬
- 여백 크기

권장 전환 규격:

- chapter 상단 여백: `96px~160px`
- chapter title 하단 여백: `20px~28px`
- 본문 블록 간 여백: `16px~24px`
- “숫자 배지 줄”과 본문 사이 여백: `24px~32px`

## 3. 한글 + SF 디스플레이 폰트 조합의 가독성 연구

### 3-1. 한글 본문에서 무엇이 중요한가

- `직접 근거`: KAIST 계열 연구 [Investigating the Effects of User Age on Readability](https://www.researchgate.net/publication/300705702_Investigating_the_Effects_of_User_Age_on_Readability)는 한글 화면 가독성에서 연령대별 차이는 있지만, `line height`와 `font size`가 반복해서 핵심 변수로 나타난다고 보고했다.
- `직접 근거`: 같은 논문은 인용 문헌 요약으로 한글 가독성의 상대 중요도를 `line-spacing 53%`, `font style 35%`, `font size 12%`로 소개한다.
- `직접 근거`: 같은 논문 실험 조건은 line spacing `50% / 100% / 150%`, size `10.7pt / 16.6pt / 22.5pt`였다.
- `직접 근거`: [스마트폰에서의 글자 크기, 글꼴, 행간 연구](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002433763)는 `20명` 대상으로 `9pt vs 12pt`, `100% vs 160%`를 비교했고, 두 연령대 모두 `글자 크기는 클수록`, `행간은 넓을수록` 가독성이 좋다고 보고했다.
- `직접 근거`: [모바일 텍스트 한글 폰트 가독성 향상 연구 - Noto Sans KR](https://journal.kci.go.kr/jksci/archive/articleView?artiId=ART002987878)는 작은 화면용 한글 본문에서 `너비 확대`, `무게 증가`, `획 대비 감소`, `글자 사이 증가`를 권장했다.
- `직접 근거`: [한글 고딕꼴 자간 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001154764)는 한글 자간은 음절 구조와 앞뒤 조합 의존성이 커서, 라틴식 균일 tracking보다 `조합 민감성`이 중요하다고 지적한다.
- `직접 근거`: Baymard의 [Readability: The Optimal Line Length](https://baymard.com/blog/line-length-readability)는 웹 본문 폭을 대체로 `50~75 characters`로 보고, WCAG 기준으로는 `CJK 40자 이하`를 언급한다. 한글 자기소개 본문을 `34em` 전후 또는 `38~40자/행`으로 제한하는 이유가 여기서 나온다.

### 3-2. Orbitron(영문 display) + Noto Sans KR(한글 본문) 조합에서의 추천 비율

- `직접 근거`: Orbitron은 display 성격이 강한 영문 서체이고, 한글 본문 연구는 일관되게 `더 큰 본문`, `더 넓은 행간`, `더 안정적인 산세리프`를 지지한다.
- `추론`: 따라서 이 조합에서 Orbitron은 `짧은 영문 라벨`, `숫자`, `장 제목`, `hero headline`에만 쓰고, 한글 문단은 전부 `Noto Sans KR`로 가져가는 것이 맞다.

권장 비율:

| 용도 | 권장 크기 | Noto Sans KR 본문 대비 비율 |
| --- | --- | ---: |
| 본문 | `17px` | `1.0x` |
| eyebrow / chapter index | `19px~21px` | `1.12x~1.24x` |
| chapter title (Orbitron) | `36px~44px` | `2.1x~2.6x` |
| hero title (Orbitron) | `56px~68px` | `3.3x~4.0x` |
| 숫자 배지 | `24px~32px` | `1.4x~1.9x` |

- `추론`: Orbitron은 작은 크기에서 정보 밀도가 급격히 높아지고, 획이 기하학적이라 문단 서체로는 불리하다. 반대로 제목/숫자에서는 SF 정체성을 빠르게 심어준다.

### 3-3. 한글 본문의 구체적인 CSS 값

권장 기본안:

```css
:root {
  --font-display: "Orbitron", sans-serif;
  --font-body: "Noto Sans KR", sans-serif;

  --body-size-mobile: 16px;
  --body-size-desktop: 17px;
  --body-line-height: 1.62;
  --body-letter-spacing: 0.005em;
  --body-max-width: 34em;

  --chapter-eyebrow-size: 1.125rem;
  --chapter-title-size: clamp(2.25rem, 3vw, 2.75rem);
  --hero-title-size: clamp(3.5rem, 7vw, 4.25rem);
}

.story-body {
  font-family: var(--font-body);
  font-size: var(--body-size-mobile);
  line-height: var(--body-line-height);
  letter-spacing: var(--body-letter-spacing);
  max-width: var(--body-max-width);
}

@media (min-width: 768px) {
  .story-body {
    font-size: var(--body-size-desktop);
  }
}
```

값 해석:

- `16px~17px`: 스마트폰의 `12pt` 실험 결과와 웹 본문 관행을 CSS px로 옮긴 안전 구간
- `1.62`: `160%` 행간이 우세했던 결과를 웹 본문용으로 내린 값
- `0.005em`: “자간을 늘리라”는 한글 모바일 연구를 반영하되, 한글 조합 리듬을 해치지 않게 아주 약하게 준 값
- `34em`: Baymard/WCAG의 `CJK 40자 이하` 원칙을 구현하기 쉬운 시작점

### 3-4. 다크 배경에서 한글 본문 가독성을 확보하는 기준

- `직접 근거`: Applied Ergonomics의 [contrast polarity 연구](https://www.sciencedirect.com/science/article/pii/S0003687016302459)는 어두운 조명에서 `white-on-black`가 불리했고, 그 불리함은 `글자가 작아질수록` 더 커졌다고 정리한다.
- `직접 근거`: PubMed의 [positive polarity advantage](https://pubmed.ncbi.nlm.nih.gov/25141597/) 연구도 작은 글자에서 밝은 글자/어두운 배경의 불리함이 더 커진다고 보고했다.
- `직접 근거`: [광삼효과 연구](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001427210)는 `22~24pt` 이상에서 흰 글자가 검은 배경에서 더 커 보이는 현상을 확인했다.
- `직접 근거`: [검정 농도 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002498793)는 모바일에서 완전한 검정보다 약간 완화된 농도(`N2`)가 읽기 편안함과 가독성에서 더 낫다고 보고했다.

실무 기준:

- `추론`: 다크 배경 본문은 `#FFFFFF`보다 `#E6EDF3` 또는 `#E8ECF1` 같은 off-white가 낫다.
- `추론`: 배경도 `#000000`보다 `#0B0F14`나 `#10161D` 계열이 더 안전하다.
- `추론`: 본문 weight는 `17px+`에서는 `400`, `16px 이하`에서는 `500`이 안전하다.
- `추론`: Orbitron heading은 `500~700`까지 가능하지만, 한글 본문은 `600+`를 기본값으로 두지 않는 편이 낫다.

추천 토큰:

```css
:root {
  --bg: #0b0f14;
  --surface: #111821;
  --text-primary: #e6edf3;
  --text-secondary: #c5d0dd;
  --text-tertiary: #97a6b8;
}
```

## 4. 서사형 자기소개 페이지에서 챕터 구분을 만드는 UI 패턴 연구

### 4-1. sticky chapter indicator / scroll spy의 UX 근거

- `직접 근거`: Baymard에서 sticky TOC를 놓친 사용자는 `7%`였고, horizontal tabs에서는 `27%`가 콘텐츠를 놓쳤다.
- `직접 근거`: NNG TOC PDF는 sticky TOC를 `항상 접근 가능`, `다른 내비게이션과 덜 혼동`, `progress feedback 제공` 패턴으로 평가한다.
- `직접 근거`: NNG의 scrolling 연구는 사용자가 상단 몇 screenful에서 대부분의 시간을 소비하므로, 사용자가 “지금 어디에 있는지”를 상시 보여주는 보조 장치가 유효함을 뒷받침한다.
- `추론`: 챕터가 `3개 이상`이고 본문 길이가 `2 screenful`을 넘으면 sticky chapter indicator를 넣는 것이 타당하다.

### 4-2. 읽기 진행도(progress)를 시각화하면 사용자 행동이 어떻게 바뀌는가

- `직접 근거`: [Shape of progress bar effect...](https://www.sciencedirect.com/science/article/pii/S0169814119305487)는 `36명` 실험에서 `percentage가 표시된 progress indicator`가 더 높은 선호와 더 빠르게 느껴지는 지각을 만들었다고 보고했다.
- `직접 근거`: 같은 연구는 `긴 대기 시간`에서 `ring type`이 더 낮은 정서적 각성과 인지 부하를 보였다고 적었다.
- `직접 근거`: [25,080개 설문 분석](https://journals.sagepub.com/doi/10.1177/0894439317695581)는 progress bar가 있을 때 completion rate가 항상 오르지 않으며, 오히려 `없는 설문`이 더 높은 completion rate를 보였다고 보고했다.
- `직접 근거`: [MTurk 연구](https://link.springer.com/article/10.3758/s13428-022-01955-9)는 progress bar가 없어서 생기는 불만도 있었지만, 실제 completion 차이는 `87.5%` 대 `86.8%` 정도로 크지 않았다고 요약했다.
- `추론`: 읽기 progress UI는 “진행 중임을 안심시키는 장치”로는 좋지만, 남은 분량을 과장하면 오히려 이탈을 부를 수 있다.

권장안:

- 긴 막대 하나보다 `현재 챕터 + 전체 챕터 수(예: 2/5) + 짧은 fill bar`가 더 낫다.
- 모바일에서는 세로 rail보다 상단의 얇은 progress stroke가 안전하다.
- progress UI는 본문보다 더 강한 시각 요소가 되면 안 된다.

### 4-3. 성과 수치를 카드/배지로 강조할 때의 시선 고정 효과 연구

- `직접 근거`: PLOS의 [numbers, size, brightness eye-tracking 연구](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0099499)는 `숫자`와 `크기` 단서가 시각 주의를 빠르게 이동시킬 수 있음을 보였다.
- `직접 근거`: Sandia의 [Patterns of Attention: How Data Visualizations Are Read](https://www.sandia.gov/research/publications/details/patterns-of-attention-how-data-visualizations-are-read-2017-07-01/)는 데이터 시각화에서 `text elements`가 특히 초기에 강하게 시선을 끈다고 보고했다.
- `직접 관찰`: Damien Bel은 자기소개형 포트폴리오 상단에서 바로 `3+`, `4`, `100+`, `12` 같은 숫자 배지를 사용한다.
- `추론`: 숫자 배지는 스캔 초기의 `정량 신뢰 신호`로 유효하다. 긴 문단을 읽히게 하려면 문단 앞에서 먼저 “왜 읽어야 하는지”를 숫자로 증명하는 편이 낫다.

권장 규격:

- 한 줄에 `3~5개`까지만
- 숫자는 `24px~32px`
- 라벨은 `11px~13px`
- 라벨 길이는 `2~4단어`
- 카드 자체보다 숫자가 먼저 보이게 `숫자 > 라벨 > 보조설명` 계층 유지

## 5. 이 프로젝트에 바로 적용할 실무안

### 레이아웃

1. 첫 screenful
   - 이름
   - 목표 직무 한 줄
   - `20~40단어` 자기 정의 문장
   - 정량 배지 `3~4개`
   - 다음 챕터를 암시하는 sticky rail
2. 본문 구조
   - chapter `4~5개`
   - 각 chapter 시작부에 `Orbitron eyebrow + 한글 H2 + 1문장 요약`
   - 본문은 `17px / 1.62 / 34em`
3. 중간 전환
   - chapter 사이마다 `숫자`, `이미지`, `quote`, `project proof` 중 최소 2개 교체

### 타이포그래피

```css
.eyebrow {
  font-family: "Orbitron", sans-serif;
  font-size: 1.125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chapter-title {
  font-family: "Orbitron", sans-serif;
  font-size: clamp(2.25rem, 3vw, 2.75rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
}

.body-copy {
  font-family: "Noto Sans KR", sans-serif;
  font-size: 17px;
  line-height: 1.62;
  letter-spacing: 0.005em;
  max-width: 34em;
  color: #e6edf3;
}

.stat-number {
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1.5rem, 2vw, 2rem);
  line-height: 1;
}

.stat-label {
  font-family: "Noto Sans KR", sans-serif;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.02em;
}
```

### 네비게이션

- 데스크톱: 왼쪽 sticky chapter rail
- 모바일: 상단 segmented nav
- active chapter: 색 + indicator bar + 번호 동시 변경
- progress: `2 / 5`처럼 분모가 보이게
- reduced motion: smooth scroll과 rail animation은 `prefers-reduced-motion`에서 끄기

## 6. 소스 목록

- NN/g, [How Little Do Users Read?](https://www.nngroup.com/articles/how-little-do-users-read/)
- NN/g, [F-Shaped Pattern of Reading on the Web](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- NN/g, [Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
- NN/g, [The Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/)
- NN/g, [Table of Contents Design Decision Tree PDF](https://media.nngroup.com/media/articles/attachments/Table_of_Contents_Design_Decision_Tree_and_Common_Combinations.pdf)
- Baymard, [PDP UX: Avoid Horizontal Tabs / Use Sticky TOC](https://baymard.com/blog/avoid-horizontal-tabs)
- Baymard, [Readability: The Optimal Line Length](https://baymard.com/blog/line-length-readability)
- Chartbeat, [Is there an optimal article length?](https://chartbeat.com/resources/articles/is-there-an-optimal-article-length-the-relationship-between-word-count-and-engagement/)
- Chartbeat, [Using Engaged Time to understand your audience](https://chartbeat.com/resources/research/using-engaged-time-to-understand-your-audience/)
- TheLadders / PR Newswire, [Six Seconds to Succeed](https://www.prnewswire.com/news-releases/theladders-reveals-that-job-seekers-have-six-seconds-to-succeed-143629046.html)
- TheLadders, [You have 7.4 seconds to make an impression](https://www.theladders.com/career-advice/you-only-get-6-seconds-of-fame-make-it-count)
- MDPI, [Using Machine Learning with Eye-Tracking Data to Predict if a Recruiter Will Approve a Resume](https://www.mdpi.com/2504-4990/5/3/38)
- Damien Bel, [Portfolio](https://damienbelgames.com/)
- Brittany Chiang, [Current Site](https://brittanychiang.com/)
- Brittany Chiang, [v4 GitHub](https://github.com/bchiang7/v4)
- UX Portfolios, [Jason Yuan listing](https://www.uxportfolios.design/portfolios/jason-yuan)
- KAIST/ResearchGate, [Investigating the Effects of User Age on Readability](https://www.researchgate.net/publication/300705702_Investigating_the_Effects_of_User_Age_on_Readability)
- KCI, [모바일 텍스트 한글 폰트 가독성 향상 연구 - 구글 본고딕을 중심으로](https://journal.kci.go.kr/jksci/archive/articleView?artiId=ART002987878)
- KCI, [스마트폰에서의 글자 크기, 글꼴, 행간이 가독성에 미치는 영향](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002433763)
- KCI, [한글 고딕꼴 글자에서 낱글자에 따른 글자사이에 대한 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001154764)
- KCI, [광삼효과를 이용한 흑백 대비에서의 여러 글자크기에 대한 주관적 평가와 분석](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001427210)
- KCI, [모바일 환경에서 글자의 검정 농도에 따른 가독성, 피로도, 단기기억 차이 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002498793)
- ScholarWorks, [모바일 플랫폼에서 전자책(e-Book) 가독성에 관한 실증연구](https://cau.scholarworks.kr/handle/2019.sw.cau/13317)
- Applied Ergonomics, [Effects of ambient illumination, contrast polarity, and letter size on text legibility under glance-like reading](https://www.sciencedirect.com/science/article/pii/S0003687016302459)
- PubMed, [Positive display polarity is particularly advantageous for small character sizes](https://pubmed.ncbi.nlm.nih.gov/25141597/)
- ScienceDirect, [Shape of progress bar effect on subjective evaluation, duration perception and physiological reaction](https://www.sciencedirect.com/science/article/pii/S0169814119305487)
- Sage, [Examining Completion Rates in Web Surveys via Over 25,000 Real-World Surveys](https://journals.sagepub.com/doi/10.1177/0894439317695581)
- Springer, [Frustration and ennui among Amazon MTurk workers](https://link.springer.com/article/10.3758/s13428-022-01955-9)
- PLOS ONE, [Are numbers, size and brightness equally efficient in orienting visual attention?](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0099499)
- Sandia, [Patterns of attention: How data visualizations are read](https://www.sandia.gov/research/publications/details/patterns-of-attention-how-data-visualizations-are-read-2017-07-01/)
