# Workflow

Intake → Explore → Plan → Execute → Verify → Report. A typo or test-only fix may go straight to Execute → Verify.

1. **Intake:** restate the goal, constraints, and acceptance criteria. If the request changes a durable rule,
   update the owning rule first. Ask only when a choice is genuinely the user's, with the recommended option
   first; otherwise pick the sensible default and say so. A question or configuration request never starts
   project work.
2. **Explore:** repo-first. Read the target files, their callers, and their last three commits.
3. **Plan:** keep a small, verifiable plan. For multi-phase work keep a scratch plan with findings, progress, and
   an error log in `DRAFTS/<task>.md` (git-ignored, this task only). When the task is done, record the outcome in
   `project/memory/todo.md` and delete the draft.
4. **Execute:** deterministic, idempotent edits in the owning files. Finish the whole slice of a feature: its
   states, config, persistence, localization, accessibility, failures, and empty or fallback states. Add a
   regression test for every behaviour change. Delegated work is not done until it is integrated and verified.
5. **Verify:** read a failure fully and fix the root cause; re-run the failed check, then the rest. Compare
   expected and actual state before retrying; never repeat an unchanged failing action. Earlier passes never
   verify changed code.
6. **Report:** lead with the outcome. List the commands and their results; separate verified results from
   assumptions; name anything skipped, failed, or blocked. Claim only the exact path exercised: unit tests and a
   build are not a browser, hardware, or provider check. Verify changing facts (model names, prices, APIs)
   against primary sources before stating them.

Definition of Done (never mark a task finished before all of these hold):

- The format command in `project/commands` ran last, after the final edit, so code and Markdown are formatted.
- Every check in `project/commands` passes; the build passes when the app or its build config changed.
- No new console errors or warnings in changed areas; JSDoc for new or changed public APIs.
- `project/memory/todo.md` reflects the outcome.
