# Safety

Stop and ask for explicit approval when:

- A task needs credentials, tokens, API URLs, IDs, or env values that are not in the repo or the conversation.
- An action is destructive or hard to revert: deleting data, migrations or schema changes against real data,
  bulk rewrites outside the task, or anything under a private-data path listed in `project/stack`.
- A command would write into unknown locations, produce a large unrelated diff, or update snapshots or goldens
  that the user did not ask for.
- An assumption would materially change scope or behaviour. Treat "is this approval-gated?" doubt as yes.
- The same sub-task failed three times: narrow the scope and change the approach instead of repeating it.

Secrets and privacy:

- Never read, print, or commit `.env*` files, including `*.env.example`. Never dump the environment (`env`,
  `printenv`, `set`, `export`).
- Run tools without automatic env loading (Bun: `--no-env-file`); when a task needs env, pass the keys inline.
- Never send repository content, personal data, or the user's identity to services the user did not name, and
  make network requests only to URLs the user or the project config provides.
- Never put secrets in code, logs, commit messages, or reports.
- Do not weaken security guards: Host/Origin and CORS allowlists, CSRF, auth, and private-data paths.
- No `sudo`, no edits to editor or AI-tool settings, and no system-level commands.
