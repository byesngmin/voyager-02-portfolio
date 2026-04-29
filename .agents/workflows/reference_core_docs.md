---
description: Workflow for reading and syncing core architecture, site plan, and decision documents
---

# Reference & Sync Core Docs

This workflow defines the mandatory steps an agent must perform when modifying code or developing new features in the Game Portfolio SPA project.

1. **Context Acquisition (Read Before Write)**
   Before starting any task, the agent must always read the following 3 core management documents to understand the current system structure and rules:
   - `docs/brief.md` (project goals, timeline, deliverables)
   - `docs/site-plan.md` (routing structure, page design, UX intent)
   - `docs/decisions.md` (key technical decisions: intro timing, transition durations, component choices)

2. **Document-Driven Development (Develop by Rules)**
   - Writing code that deviates from the understood routing structure, content schema (frontmatter types), or UX decisions is prohibited.
   - If a situation unavoidably requires creating a new route or adding a content type, immediately stop and report or clearly document the issue for the user.

3. **Real-time Documentation Sync**
   - If the result of code work causes changes to the existing routing structure, content schema, or design decisions, **you must immediately update `docs/site-plan.md` or `docs/decisions.md` before completing the task** to ensure 100% alignment with the code.
   - Never skip documentation updates after making code changes — it is your responsibility to keep them in sync.

4. **CCE Agent Integration Check (Required — Cannot Be Skipped)**

   This step evaluates the following two trigger conditions **in order**. If a condition is met, the specified CCE agent **must** be executed. Report the evaluation result to the user before proceeding.

   **[Trigger A] If one or more components, hooks, or content types were changed by code modifications**
   → Run `agents/code-reviewer.md` and verify:
   - [ ] Does the changed code violate Principle 2 (Diff method)?
   - [ ] Does it match the actual props/signatures of components like `MarkdownPage`, `loadCollection`? (Principle 6)
   - [ ] Does the review result include any findings that conflict with Principles 1–6?
     - **Conflict found** → Immediately halt. Report to user per Principle 8 procedure.
     - **No conflict** → Declare review complete and proceed to the next trigger.

   **[Trigger B] After Step 3, if 2 or more document items were modified or a new schema/route was added**
   → Verify:
   - [ ] Are all 3 documents (`brief.md`, `site-plan.md`, `decisions.md`) fully aligned with the code changes?
   - [ ] If any missing sync items are found, immediately update the relevant documents.

   **[Required Completion Report Format — Cannot Be Omitted]**
   At the end of this step, the agent must report results to the user in the following format:
   ```
   [Step 4 CCE Check Complete]
   - Trigger A (code-reviewer): Applicable / Not applicable — (if applicable) No conflict / Principle N conflict → Awaiting report
   - Trigger B (doc-sync): Applicable / Not applicable — (if applicable) Sync complete / N additional fix items
   ```
