---
name: two-phase-guard
description: "Remind two-phase verify and PERSIST gating for webnovel chapters"
metadata:
  {
    "openclaw": {
      "emoji": "🛡️",
      "events": ["command:new", "command:reset", "command:stop", "message:sent"],
      "os": ["darwin", "linux", "win32"]
    }
  }
---

# two-phase-guard

Project-level OpenClaw hook for `xt-webnovel-writing`.

Purpose:

- Remind the agent and user that chapter generation must follow:
  `LOAD -> DRAFT -> VERIFY (self-check + stats + green-line fields) -> PERSIST`.
- Warn when outbound content appears to claim "final/done/persisted" without visible
  self-check signals.

Notes:

- This hook is a **guardrail reminder**, not a strict blocker.
- It does not replace `references/openclaw-enforcement-two-phase.md`.
- Green-line metrics (`style_temperature_band` / `human_noise_hits` / `clean_closure_hits` /
  `exposition_density_band` / `dialogue_mismatch_ratio`) are required as process outputs, but
  out-of-range values are warning-only and must not be treated as standalone rollback triggers.
