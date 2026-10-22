# Git and dependencies

- Do not initialize Git. Read-only Git (`status`, `diff`, `log`, `show`, `blame`) is always fine.
- Commit, push, reset, checkout, stash, or clean only when asked in the current conversation. Preserve existing
  work; never reset, stash, or create backups for convenience.
- Commits follow Conventional Commits, small and atomic, and never contain secrets.
- Review the last changes of a file before editing it: `git log -n 3 --oneline -- <path>`.
- Install from the committed lockfile (frozen). Change the lockfile only for the task at hand.
- Keep every dependency, devDependency, and tool on its latest release, major versions included (see
  `areas/tooling`), and migrate code and config to current APIs when upgrading.
- Justify every new runtime dependency (need, size, alternatives). Prefer runtime and platform built-ins and the
  tools already in the project over new packages.
