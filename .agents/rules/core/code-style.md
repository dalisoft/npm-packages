# Code style

- Priorities, in order: easy to read, fast, secure, good DX, then features.
- Early returns, small pure functions, and one subject per module.
- Validate all input at the boundary; trust typed values inside.
- Config comes from env only, parsed and validated at startup with clear failures. Never hard-code vendor models,
  voices, keys, or hosts.

## Names

- Descriptive names: `session`, `question`, `response`, `error`, `time`, never `s`, `r`, `t`, `h`, `g`, `q`.
  Single letters only for numeric loop indices (`index` reads better when the loop body is long).
- No cryptic abbreviations: `milliseconds`, not `ms`; `message`, not `msg`; `button`, not `btn`. Common
  domain words (`id`, `url`, `api`, `csrf`) are fine.
- Booleans read as predicates (`isReady`, `hasAudio`); functions start with a verb or name what they return
  (`loadUser`, `activeItems`); constants are named for meaning (`retryDelayMilliseconds`, not `30000` inline).

## Readable layout

Code must read like source, never like a minified bundle.

- One statement per line, and braces on every block; no nested ternaries (use an early-return helper or a lookup
  map).
- A blank line between top-level declarations, and between the logical steps inside a long function.
- Name intermediate values instead of chaining more than about three calls or packing logic into one expression.
- Doc comments on every exported function, hook, component, and type that is not self-explanatory. Comments
  explain why, not what.
