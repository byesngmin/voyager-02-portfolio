# Task 99 — Full Acceptance Checklist

Run after all tasks (01–06) are complete. All checks must pass.

```bash
# 1. Split files exist
ls .claude/coding-principles.md .claude/workflow.md .claude/management.md
echo "exit:$?"   # Expected: 0

# 2. CLAUDE.md is lean with @imports at top
head -10 CLAUDE.md | grep -c "@.claude/"
# Expected: 3

wc -l CLAUDE.md
# Expected: < 65

# 3. Karpathy 4 principles present
grep -c "Think Before Coding\|Simplicity First\|Surgical Changes\|Goal-Driven Execution" \
  .claude/coding-principles.md
# Expected: 4

# 4. XML tags in workflow
grep "<task>" .claude/workflow.md | wc -l
# Expected: >= 3

# 5. Delta pattern present
grep "<correction>" .claude/workflow.md | wc -l
# Expected: >= 1

# 6. conventions.md updated
grep -c "<task>\|재위임(PARTIAL)" agentmanager/conventions.md
# Expected: >= 2

# 7. Hooks fire correctly
echo '{"tool_name":"Edit","tool_input":{"file_path":"src/App.tsx","old_string":"a","new_string":"b"}}' \
  | node ".claude/hooks/agent-guard.js"; echo "exit:$?"
# Expected: exit:2

echo '{"tool_name":"Edit","tool_input":{"file_path":"docs/readme.md","old_string":"a","new_string":"b"}}' \
  | node ".claude/hooks/agent-guard.js"; echo "exit:$?"
# Expected: exit:0

echo '{"prompt":"버튼 추가해줘"}' | node ".claude/hooks/gemini-router.js"; echo "exit:$?"
# Expected: exit:1

echo '{"tool_name":"Bash","tool_input":{"command":"codex exec test"}}' \
  | node ".claude/hooks/post-task-check.js"; echo "exit:$?"
# Expected: exit:0
```

All expected values matched = optimization complete.
