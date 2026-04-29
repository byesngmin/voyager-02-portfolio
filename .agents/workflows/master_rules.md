---
description: 게임 포트폴리오 SPA Master Rules — Principles 1–8 that all agents must follow before any task
---
// turbo-all
1. Read `agentmanager/taskboard.md` — confirm no conflicting "In Progress" entries for the same files you plan to touch
2. Read `agentmanager/agents.md` — confirm this task falls within your domain; if delegation is needed, use the appropriate execution agent (codex or gemini-cli)
3. Read `agentmanager/conflicts.md` — check no file locks are active for files you need to modify
4. Read `agentmanager/conventions.md` — confirm you understand code style, docs language, and reporting rules
5. Register your task in `agentmanager/taskboard.md` under "In Progress" before touching any files
6. If performing cross-domain work: add `[cross]` tag in taskboard entry
7. On task completion: move taskboard entry to changelog and remove from "In Progress"
8. If claude-code directly modified source files without delegating: append an entry to `agentmanager/changelog.md` in the **same session** before ending
