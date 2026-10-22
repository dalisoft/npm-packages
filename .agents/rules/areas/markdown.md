---
paths:
  - "**/*.md"
---

# Markdown

- rumdl checks every Markdown file; its formatter aligns tables only when MD060 is enabled with
  `style = "aligned"`, so "No issues found" alone does not mean tables are aligned. Keep the wrapping style the
  file already uses.
- Plain, direct wording. Document only behaviour verified in the code: check every claim (commands, env, steps)
  against the source before writing it, and keep the README in sync with scripts and config.
