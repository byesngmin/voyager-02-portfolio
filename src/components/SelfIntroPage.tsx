import { Link } from "react-router-dom";
import { ContentDocument, PageFrontmatter } from "../lib/content";

type SelfIntroPageProps = { document: ContentDocument<PageFrontmatter> };

const strengths = [
  ["시스템 × 콘텐츠", "규칙·보상·서사가 다음 플레이를 함께 만들도록 연결합니다."],
  ["트릭컬 이해", "스토리 연출과 데이터테이블 구조를 역기획하고 후속 프로젝트에 적용했습니다."],
  ["문서화 × 협업", "개발자와 구조를 합의하고 반복 업무를 규칙과 자동화로 바꿉니다."],
];

const cases = [
  {
    title: "ICH 퍼즐 개발",
    steps: [
      ["문제", "팀원 2명 이탈로 범위와 일정의 위험이 커졌습니다."],
      ["판단", "완주를 위해 남은 인력의 범위와 콘텐츠 연결점을 먼저 조율했습니다."],
      ["행동", "스킬 시스템과 레벨 기획을 맡아 플레이 가능한 결과물에 집중했습니다."],
      ["결과", "프로젝트를 완주해 기수 대표 게임으로 선정되었습니다."],
    ],
  },
  {
    title: "학습매니저 운영 개선",
    steps: [
      ["문제", "교안 서식과 관리 규칙이 달랐고 훈련일지 작성이 반복 업무로 남아 있었습니다."],
      ["판단", "개인의 숙련보다 모두가 따를 규칙과 자동화가 먼저라고 보았습니다."],
      ["행동", "교안 서식·관리 규칙을 표준화하고 GitHub Actions 기반 훈련일지 자동화를 구축했습니다."],
      ["결과", "담당 3기 만족도 4.7점(전체 4.6점), 교강사 하루 10~20분 절감으로 이어졌습니다."],
    ],
  },
];

export function SelfIntroPage({ document }: SelfIntroPageProps) {
  return (
    <article className="si-landing">
      <header className="si-hero">
        <div className="si-hero__copy">
          <p className="signal-label">PATIMA 시스템·콘텐츠 기획 지원</p>
          <h2>PATIMA의 관계를<br /><em>플레이의 구조</em>로 잇겠습니다.</h2>
          <p className="si-hero__lead">트릭컬의 캐릭터성과 데이터 구조를 함께 읽고, 시스템과 콘텐츠를 하나의 경험으로 문서화해 온 기획자 황승민입니다.</p>
          <div className="si-chip-row" aria-label="핵심 역량"><span>시스템 × 콘텐츠</span><span>트릭컬 이해</span><span>문서화 × 협업</span></div>
        </div>
        <div className="si-visual" aria-hidden="true"><span>VOYAGER-02 SIGNAL</span><b>관계</b><i>→</i><b>수집</b><i>→</i><b>성취</b><div className="si-eq">{[3,7,5,9,4,8,6,10,5,7,3,8].map((n,i)=><span key={i} style={{height:`${n*8}%`}} />)}</div></div>
      </header>

      <section className="si-section" aria-labelledby="motivation-title">
        <div className="si-section__heading"><p>01</p><h3 id="motivation-title">지원동기</h3></div>
        <div className="si-story-card">
          <p>타입문 아레나에서 캐릭터성과 규칙이 맞물릴 때, 익숙한 유닛이 전혀 다른 인물로 느껴지는 재미를 체감했습니다. 이후 서브컬처의 재미를 캐릭터 간 관계성으로 해석했고, 트릭컬 스토리 콘텐츠의 연출과 데이터 구조를 역기획했습니다.</p>
          <p>그 분석은 후속 기업협약 수집·방치형 프로젝트의 비주얼노벨 구조와 테이블 협의에 적용했습니다. 이처럼 분석을 실제 구조로 옮긴 경험으로 PATIMA에서도 시스템과 콘텐츠가 서로의 이유가 되는 플레이를 만들고 싶습니다.</p>
        </div>
      </section>

      <section className="si-section" aria-labelledby="strength-title">
        <div className="si-section__heading"><p>02</p><h3 id="strength-title">장점·역량</h3></div>
        <div className="si-fit-grid">{strengths.map(([title, body], i)=><article className="si-fit-card" key={title}><span>0{i+1}</span><h4>{title}</h4><p>{body}</p></article>)}</div>
        <div className="si-viewpoint"><p>수집형 RPG 관점</p><blockquote>수집은 관계의 <strong>시작점</strong>이자 <strong>결실</strong>이며, 플레이어가 쌓은 성취를 확인하는 지표입니다.</blockquote></div>
        <div className="si-trend"><h4>밈 트렌드 파이프라인</h4><div className="si-pipeline">{[["수집","커뮤니티·숏폼·행사"],["판별","맥락과 수명"],["변주","캐릭터 관계와 상황"],["기록","반응과 다음 가설"]].map(([title,body],i)=><div key={title}><span>0{i+1}</span><strong>{title}</strong><small>{body}</small></div>)}</div></div>
      </section>

      <section className="si-section" aria-labelledby="problem-title">
        <div className="si-section__heading"><p>03</p><h3 id="problem-title">문제해결능력</h3></div>
        <div className="si-case-grid">{cases.map((item)=><article className="si-case-flow" key={item.title}><h4>{item.title}</h4><div>{item.steps.map(([label,body])=><section key={label}><span>{label}</span><p>{body}</p></section>)}</div></article>)}</div>
      </section>

      <section className="si-section" aria-labelledby="aspiration-title">
        <div className="si-section__heading"><p>04</p><h3 id="aspiration-title">포부</h3></div>
        <div className="si-gap"><span>정직한 출발점</span><div><h4>라이브 서비스 경험은 아직 없습니다.</h4><p>대신 출시, QA, 피드백 수취와 출시 지원을 경험했고, 모르는 영역은 빠르게 검증해 다시 쓸 수 있는 문서로 남겨 왔습니다. 이 습관으로 PATIMA의 운영 맥락을 빠르게 익히겠습니다.</p></div></div>
        <footer className="si-closing"><p>VOYAGER-02 / NEXT SIGNAL</p><h3>안일함 대신,<br />한 끗을 끝까지 폴리싱하겠습니다.</h3><p className="si-closing__copy">몇 번의 좌절 뒤에도 방향을 잃지 않은 보이저 2호처럼, 끝내 목표한 경험에 도달하겠습니다.</p><Link to="/projects">프로젝트 근거 보기 <span>→</span></Link></footer>
      </section>
      <span className="sr-only">{document.frontmatter.title}</span>
    </article>
  );
}
