import { Link } from "react-router-dom";
import { ContentDocument, PageFrontmatter } from "../lib/content";

type SelfIntroPageProps = { document: ContentDocument<PageFrontmatter> };

const fitCards = [
  { no: "01", title: "시스템 × 콘텐츠", body: "메인과 서브를 나누어 보지 않습니다. 규칙, 보상, 서사가 한 흐름 안에서 다음 플레이를 만들도록 설계합니다." },
  { no: "02", title: "트릭컬 이해", body: "트릭컬 리바이브를 꾸준히 플레이한 숙련자로서, 스토리 연출과 데이터테이블 구조를 역기획해 실제 프로젝트에 적용했습니다." },
  { no: "03", title: "문서화 × 협업", body: "개발자와 테이블 구조를 협의하고, 반복 업무는 규칙과 자동화로 바꿉니다. 의도가 전달되고 다시 쓰이는 문서를 만듭니다." },
];

const proofs = [
  ["요구 역량", "실제 근거", "확인 포인트"],
  ["수집형 RPG 이해", "트릭컬 리바이브 숙련·스토리 콘텐츠 역기획", "연출 구조와 테이블 구조 분석"],
  ["시스템/레벨 기획", "ICH 퍼즐: 스킬·레벨 기획", "팀원 이탈 대응, 기수 대표 게임 선정"],
  ["출시와 피드백", "스토리플레이·Roblox Obby 출시", "타 게임 피드백·QA 기반 상점/유료화 설계"],
  ["협업과 운영", "교안 규칙 표준화·훈련일지 자동화", "교강사 2명 협업, 일 10~20분 절감"],
];

export function SelfIntroPage({ document }: SelfIntroPageProps) {
  return (
    <section className="si-landing">
      <header className="si-hero">
        <div className="si-hero__copy">
          <p className="signal-label">APPLICATION / EPID GAMES · TRICKCAL PATIMA</p>
          <h2>관계의 재미를<br /><em>플레이의 구조</em>로 만듭니다.</h2>
          <p className="si-hero__lead">시스템과 콘텐츠를 따로 떼지 않고, 캐릭터를 만나는 순간부터 관계를 쌓고 수집의 성취를 확인하는 흐름까지 설계하는 기획자 황승민입니다.</p>
          <div className="si-chip-row" aria-label="핵심 역량">
            <span>TRICKCAL PLAYER</span><span>SYSTEM DESIGN</span><span>CONTENT FLOW</span>
          </div>
        </div>
        <div className="si-visual" aria-hidden="true">
          <span>MIX</span><b>RELATION</b><i>→</i><b>COLLECT</b><i>→</i><b>ACHIEVE</b>
          <div className="si-eq">{[3,7,5,9,4,8,6,10,5,7,3,8].map((n,i)=><span key={i} style={{height:`${n*8}%`}} />)}</div>
        </div>
      </header>

      <section className="si-section">
        <div className="si-section__heading"><p>WHY PATIMA</p><h3>제가 맞는 이유, 세 가지</h3></div>
        <div className="si-fit-grid">{fitCards.map(card => <article key={card.no} className="si-fit-card"><span>{card.no}</span><h4>{card.title}</h4><p>{card.body}</p></article>)}</div>
      </section>

      <section className="si-viewpoint">
        <p>MY VIEW / COLLECTION RPG</p>
        <blockquote>서브컬처의 재미는 <strong>캐릭터 간 관계성</strong>에서 나옵니다. 수집은 그 관계의 시작점이자 결실이며, 플레이어가 쌓아 온 성취를 보여 주는 지표입니다.</blockquote>
      </section>

      <section className="si-section">
        <div className="si-section__heading"><p>FIT MATRIX</p><h3>공고의 언어를, 작업의 증거로</h3></div>
        <div className="si-proof-table" role="table">{proofs.map((row, ri) => <div className={ri===0?"is-head":""} role="row" key={row[0]}>{row.map(cell=><span role="cell" key={cell}>{cell}</span>)}</div>)}</div>
      </section>

      <section className="si-section">
        <div className="si-section__heading"><p>SELECTED EVIDENCE</p><h3>분석하고, 연결하고, 남겼습니다</h3></div>
        <div className="si-cases">
          <article><span className="si-case__tag">CASE 01 / REVERSE DESIGN</span><h4>트릭컬의 구조를 읽고, 다음 프로젝트의 언어로 바꾸다</h4><p>트릭컬 스토리 콘텐츠의 연출 구조와 데이터테이블 구조를 분석했습니다. 이후 기업협약 수집·방치형 프로젝트에서 비주얼노벨 구조를 설계하며 배경·시나리오·UI를 맡고, 개발자와 테이블 구조를 협의했습니다.</p><strong>분석 → 구조화 → 실제 적용</strong></article>
          <article><span className="si-case__tag">CASE 02 / SHIP & SYSTEM</span><h4>제약 속에서도 플레이 가능한 결과까지</h4><p>ICH 퍼즐에서 스킬 시스템과 레벨을 기획하고 팀원 이탈 리스크에 대응해 기수 대표 게임 선정까지 완주했습니다. 스토리플레이와 Roblox Obby는 실제 출시했고, 피드백과 QA를 바탕으로 상점·유료화 구조를 설계했습니다.</p><strong>시스템 설계 → 리스크 대응 → 출시</strong></article>
          <article><span className="si-case__tag">CASE 03 / OPERATION</span><h4>반복되는 혼선을 규칙과 자동화로 줄이다</h4><p>학습매니저로서 교안 서식과 관리 규칙을 표준화하고 교강사 2명과 협업했습니다. 담당 3기 만족도는 전체 4.6 대비 4.7이었고, 훈련일지 자동화로 교강사 1인당 하루 10~20분을 줄였습니다.</p><strong>표준화 → 협업 → 측정 가능한 개선</strong></article>
        </div>
      </section>

      <section className="si-section si-trend">
        <div className="si-section__heading"><p>TREND PIPELINE</p><h3>밈은 외우지 않고, 맥락을 추적합니다</h3></div>
        <div className="si-pipeline">{[["01","수집","커뮤니티·숏폼·행사"],["02","판별","맥락과 수명"],["03","변주","캐릭터 관계와 상황"],["04","기록","반응과 다음 가설"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{x[2]}</small></div>)}</div>
        <p>타입문 아레나에서 캐릭터성과 규칙이 맞물릴 때 생기는 재미를 처음 체감했습니다. 지금은 유행 자체보다, 어떤 관계와 상황에서 살아나는지를 먼저 봅니다.</p>
      </section>

      <section className="si-gap">
        <span>HONEST GAP</span><div><h3>라이브 서비스 경험은 아직 없습니다.</h3><p>대신 출시, QA, 피드백 수취와 출시 지원의 사이클을 경험했습니다. 모르는 영역을 감추기보다 빠르게 검증하고 문서화하겠습니다. Stable Diffusion 도입, Tilemap R&amp;D와 규약 정의, Google Workspace·GitHub Actions·AI 자동화는 그 학습 방식을 실제 업무에 적용한 증거입니다.</p></div>
      </section>

      <footer className="si-closing"><p>READY FOR THE NEXT MIX</p><h3>안일함 대신,<br />한 끗을 끝까지 폴리싱하겠습니다.</h3><Link to="/projects">프로젝트 근거 보기 <span>→</span></Link></footer>
      <span className="sr-only">{document.frontmatter.title}</span>
    </section>
  );
}
