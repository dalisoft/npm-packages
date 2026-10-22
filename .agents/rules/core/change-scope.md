# Change scope

Deliver the request with the smallest clear, maintainable change. Optimize correctness and clarity, not line count;
never remove necessary checks.

- Edit the owning files in place. Preserve user changes, existing behaviour, and project style.
- One source of truth: no copies, backups, `v2` variants, wrapper layers, or duplicate docs. Rewrite to the better
  version in place; if the new version is not better, say so and keep the old one.
- Add files, dependencies, or abstractions only when requested or required. No speculative refactors or optional
  follow-up work.
- Before moving or deleting code, copy the exact source lines; never delete a line range blind.
- Use the available tools. Do not write standalone scripts for edits, searches, or analysis unless asked.
- Never spawn, bundle, or leave running local model servers or runtimes (Python, MLX, llama.cpp, Ollama).
- Remove only exact, verified leftovers created by the task; never use broad deletion or clean user data or
  unknown files. Stop task-owned processes and resolve delegated work before finishing.
- Keep research, validation, and cleanup proportional to the request.
