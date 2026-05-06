# Task 05 — Fix Hook Paths in `settings.local.json`

**Goal:** Ensure all 3 hooks point to the current workspace's absolute path.
**Conflict check:** No other files reference `settings.local.json`. No conflicts.

## Diagnose

```bash
# Check current hook paths
grep "command" .claude/settings.local.json
```

Compare the paths shown against your actual workspace root. If they point to a different directory, fix them.

## Fix

Update `.claude/settings.local.json` hooks section. Replace `<ABSOLUTE_PATH>` with your workspace root (e.g., `d:/Github/my-project` — use forward slashes):

```json
"hooks": {
  "UserPromptSubmit": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "node \"<ABSOLUTE_PATH>/.claude/hooks/gemini-router.js\""
        }
      ]
    }
  ],
  "PreToolUse": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "node \"<ABSOLUTE_PATH>/.claude/hooks/agent-guard.js\""
        }
      ]
    }
  ],
  "PostToolUse": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "node \"<ABSOLUTE_PATH>/.claude/hooks/post-task-check.js\""
        }
      ]
    }
  ]
}
```

## Verification

Run all four tests. Each expected exit code must match exactly.

```bash
# Test 1: blocks source file edits (exit 2)
echo '{"tool_name":"Edit","tool_input":{"file_path":"src/App.tsx","old_string":"a","new_string":"b"}}' \
  | node ".claude/hooks/agent-guard.js"; echo "exit:$?"
# Expected: exit:2

# Test 2: allows .md edits (exit 0)
echo '{"tool_name":"Edit","tool_input":{"file_path":"docs/readme.md","old_string":"a","new_string":"b"}}' \
  | node ".claude/hooks/agent-guard.js"; echo "exit:$?"
# Expected: exit:0

# Test 3: routes source edit prompts (exit 1 + ADVISORY)
echo '{"prompt":"버튼 컴포넌트 추가해줘"}' | node ".claude/hooks/gemini-router.js"; echo "exit:$?"
# Expected: exit:1

# Test 4: reminds after codex (exit 0 + EVALUATE message)
echo '{"tool_name":"Bash","tool_input":{"command":"codex exec test"}}' \
  | node ".claude/hooks/post-task-check.js"; echo "exit:$?"
# Expected: exit:0
```

All 4 tests must pass before marking this task complete.
