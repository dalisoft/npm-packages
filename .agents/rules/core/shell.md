# Shell and tools

- Prefer the dedicated read, search, and edit tools over shell commands for files.
- Read files one by one; one command that prints many files overflows the output.
- Pipes only for read-only inspection; no `find -exec`, `-delete`, or `xargs rm`.
- The user's interactive shell may differ from the agent's (fish versus zsh or bash). Write POSIX-style loops
  (`for …; do …; done`), quote `"==="` and globs such as `--include=*.ts`, and do not rely on word splitting of
  unquoted variables or on empty heredocs to interpreters. Never name loop variables after shell specials
  (`path`, `PATH`, `status`, `HOME`): in zsh, `path` rewrites command lookup.
- Stop every process the task started (dev servers, watchers) before finishing.
