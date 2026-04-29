/**
 * gemini-router.js --- UserPromptSubmit Hook
 * 사용자 프롬프트에서 위임 필요 태스크 감지 → exit 2 (차단)
 * claude-code는 감독/조율만 수행. 실행은 codex/gemini-cli에 위임 강제.
 */

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  let data = {};
  try { data = JSON.parse(Buffer.concat(chunks).toString()); } catch (_) {}

  const prompt = (data.prompt || '').toLowerCase();

  const hasUrl = /https?:\/\/\S+/.test(data.prompt || '');

  const patterns = [
    // codex --search 위임 (URL 포함 웹 리서치)
    { label: 'URL 포함 웹 리서치', delegate: 'codex-search',
      test: () => hasUrl && /리서치|분석|레퍼런스|조사|구조|파악/.test(prompt) },
    // gemini-cli 위임
    { label: '웹 검색', delegate: 'gemini',
      test: () => /검색|찾아\s*줘|조사|트렌드|최신|뉴스|사례|레퍼런스|best\s*practice/.test(prompt) },
    { label: '대용량 분석', delegate: 'gemini',
      test: () => /전체\s*(파일|코드)\s*(읽|분석|요약)|전수\s*검사|모든\s*파일/.test(prompt) },
    { label: 'UI 제안', delegate: 'gemini',
      test: () => /(ui|ux|디자인|화면|레이아웃).*(제안|아이디어|보완|개선)|(제안|아이디어|보완|개선).*(ui|ux|디자인|화면)/.test(prompt) },
    { label: '게임 디자인 레퍼런스', delegate: 'gemini',
      test: () => /게임.*(디자인|패턴|레퍼런스|사례)|(ux|애니메이션|모션|인터랙션).*(제안|레퍼런스|조사)/.test(prompt) },
    { label: '이미지 분석', delegate: 'gemini',
      test: () => /이미지\s*(분석|설명|해석)|스크린샷\s*보고/.test(prompt) },
    // codex 위임
    { label: 'Codex 위임 필요 (소스 코드 편집)', delegate: 'codex',
      test: () => /[.](js|html|css|ts|py|jsx|tsx)\s*(수정|편집|추가|삭제|구현|패치|고쳐|바꾸)|소스\s*코드\s*(수정|편집)|함수\s*(추가|수정|구현)|버그\s*수정|(기능|ui|ux|화면|버튼|팝업|모달|패널|단계|탭|툴바|카드|컴포넌트)\s*(추가|구현|만들|적용|진행|수정|변경|개선|나눠|분리|비활성|확대|개편)/.test(prompt) },
  ];

  const matched = patterns.find(p => p.test());

  if (matched) {
    if (matched.delegate === 'codex-search') {
      console.log('[advocate-loop] ADVISORY: ' + matched.label + ' task detected.');
      console.log('→ URL 웹 리서치는 codex --search 위임 대상입니다. 직접 처리하지 말고 아래 절차를 따르세요:');
      console.log('  1. 태스크를 taskboard.md In Progress에 등록');
      console.log('  2. codex --search exec --full-auto "[spec]" 로 위임');
      console.log('  3. 결과 평가 후 보고');
      process.exit(1);
    } else if (matched.delegate === 'gemini') {
      console.log('[advocate-loop] ADVISORY: ' + matched.label + ' task detected.');
      console.log('→ gemini-cli 위임 대상입니다. 직접 처리하지 말고 아래 절차를 따르세요:');
      console.log('  1. 태스크를 taskboard.md In Progress에 등록');
      console.log('  2. gemini -p "[task]" 로 위임 (웹 접근 불가 시 codex --search exec --full-auto 대체)');
      console.log('  3. 결과 평가 후 보고');
      process.exit(1);
    } else if (matched.delegate === 'codex') {
      console.log('[advocate-loop] ADVISORY: ' + matched.label + ' task detected.');
      console.log('→ codex 위임 대상입니다. 직접 처리하지 말고 아래 절차를 따르세요:');
      console.log('  1. 태스크를 taskboard.md In Progress에 등록');
      console.log('  2. codex exec --full-auto "[spec]" 로 위임');
      console.log('  3. 결과 평가 후 보고');
      process.exit(1);
    }
  }

  process.exit(0);
});
