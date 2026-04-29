/**
 * agent-guard.js --- PreToolUse Hook
 * claude-code = 감독/조율 전용. 실행은 codex/gemini-cli에 위임.
 *
 * [1] Edit/Write + source file -> exit 2 (block) → codex 위임
 * [2] Agent(general-purpose) + source edit intent -> exit 2 (block) → codex 위임
 * [3] WebSearch/WebFetch -> exit 2 (block) → gemini-cli 위임
 */

const chunks = [];
process.stdin.on("data", d => chunks.push(d));
process.stdin.on("end", () => {
  let data = {};
  try { data = JSON.parse(Buffer.concat(chunks).toString()); } catch (_) {}

  const toolName = data.tool_name || "";
  const toolInput = data.tool_input || {};

  // [1] Edit/Write on source files → codex
  if (toolName === "Edit" || toolName === "Write") {
    const norm = (toolInput.file_path || "").split("\\").join("/");
    const isSrc = /[.](js|ts|jsx|tsx|html|css|py)$/i.test(norm);
    const INFRA = ["/.claude/", "/agentmanager/", "/public/", "/tmp/", "/node_modules/", "/skills/"];
    const isOk =
      norm.includes("/docs/") ||
      /[.](md|json|yaml|yml|toml|env|csv|txt)$/i.test(norm) ||
      INFRA.some(d => norm.includes(d));
    if (isSrc && !isOk) {
      console.log("[agent-guard] BLOCKED: direct source edit -> " + norm);
      console.log("Delegate to Codex: codex \"[spec]\" -y");
      process.exit(2);
    }
  }

  // [2] Agent(general-purpose) with source edit intent → codex
  if (toolName === "Agent") {
    const sub = toolInput.subagent_type || "";
    const prompt = (toolInput.prompt || "").toLowerCase();
    if (sub === "general-purpose" || sub === "") {
      const srcEditRe = /[.](js|html|css|ts|py|jsx|tsx)|edit|write|수정|편집|구현|삽입|추가|삭제|생성|패치/;
      if (srcEditRe.test(prompt)) {
        console.log("[agent-guard] BLOCKED: Agent(general-purpose) source edit intent.");
        console.log("P1 breach. Delegate to Codex: codex \"[spec]\" -y");
        process.exit(2);
      }
    }
  }

  // [3] WebSearch/WebFetch → gemini-cli
  if (toolName === "WebSearch" || toolName === "WebFetch") {
    console.log("[agent-guard] BLOCKED: " + toolName + " call intercepted.");
    console.log("Delegate to gemini-cli: gemini -p \"[task]\"");
    process.exit(2);
  }

  process.exit(0);
});
