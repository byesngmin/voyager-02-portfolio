---
description: 게임 포트폴리오 SPA Master Rules — Principles 1–8 that all agents must follow before any task
---

# 게임 포트폴리오 SPA Agent Master Prompt (Master Proxy Rules)

You are a dedicated agent for the Game Portfolio SPA project — a React 19 + Vite + TypeScript single-page application for a game content planner's portfolio. Whenever you receive a task, strictly adhere to the following Master Rules in the background at all times.

## 📌 Principle 1. "Load Required Context Before Work"
- When given a development instruction (code modification, feature addition, etc.), before blindly exploring the code, recall the `.agents/workflows/reference_core_docs.md` workflow first.
- Treat the 3 core documents in `docs/` (`brief.md`, `site-plan.md`, `decisions.md`) as your map. Always search these documents first to identify the target location and design intent for any modification.

## 📌 Principle 2. "Avoid Full-File Edits — Use Targeted (Diff) Changes"
- Source files (`src/` components, hooks, etc.) can be large. It is strictly prohibited to regenerate an entire file or unconditionally output new code that replaces everything.
- Always precisely identify the component, hook, or function that needs changing, and use a replace/diff approach to apply targeted changes only.

## 📌 Principle 3. "Real-time Auto Documentation Sync"
- If modifying logic causes any change to the **routing structure, content schema, or design decisions**, you must **immediately and concurrently update the relevant core document(s)** without delay.
- (Example: if a new route is added, update `docs/site-plan.md` right after modifying the code to keep the app and documents in sync.)

## 📌 Principle 4. Language & Communication Convention
- Although internal reasoning may be done in any language, **all output — documents, comments, and direct feedback to the user — must be in clear and professional Korean**.

## 📌 Principle 5. No Unauthorized Version Number Changes
- The version number in `package.json` may **only be modified when the user explicitly requests a version change**.
- Agents are prohibited from incrementing or changing the version on their own due to feature additions, modifications, or refactoring.

## 📌 Principle 6. No Self-Interpretation of Component Interfaces
- When using existing components or hooks declared in the project (e.g., `loadCollection`, `createDocument`), it is **strictly prohibited to abbreviate or guess prop names or function signatures**.
- Always look up the actual declaration (via Read/Grep) or check `docs/decisions.md` before calling a function, and use the exact correct signature.

---

## 🔌 Principle 7. CCE (Claude Code Everything) Usage Guidelines

This project **actively uses CCE features as auxiliary tools**, but only within the boundaries that do not conflict with Principles 1–6.

### ✅ Recommended CCE Features & Contexts

| Purpose | CCE Feature | When to Apply |
|---|---|---|
| Understanding existing component structure before work | `skills/search-first/` | After reviewing the 3 core docs (Principle 1), when additional exploration is needed |
| Code quality review | `agents/code-reviewer.md` | Check for Principle 2 (Diff method) violations |
| Automated documentation sync | `agents/doc-updater.md` | Supports Principle 3's real-time doc updates |

### ⚠️ CCE Usage Restrictions
- **Principle 4 (Language Rule) takes top priority**: Even if a CCE agent or skill prompts for English output, **all output delivered to the user must be in Korean**.
- **Principle 5 (Version protection)**: No CCE feature may change the version number without an explicit user request.
- **Principle 2 (No full-file regeneration) protection**: Even if a CCE agent suggests rewriting an entire file, it must be restricted to a diff/replacement approach.

---

## 🚨 Principle 8. Conflict Resolution Procedure When CCE Guidelines Conflict

If a CCE feature **generates or is expected to generate instructions that conflict with existing Principles 1–6**, the agent must follow this procedure:

1. **Immediately halt the task** and clearly report the conflict to the user in Korean.
2. The report must include:
   - **Conflicting item**: Which CCE feature/guideline conflicts with which Principle (include number)
   - **Conflict summary**: What each side requires, in 1–2 sentences
   - **Agent's recommendation**: The most reasonable resolution to resolve the conflict
3. **Resume work only after receiving the user's explicit decision**.
