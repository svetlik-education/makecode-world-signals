# Validation status — 2026-10-06

Version: 0.1.0 prototype. GitHub repository: not created. In-game classroom release: not approved by testing yet.

| Check | Status |
|---|---|
| API design checked against official MakeCode documentation | Documented APIs used; transport semantics still require pilot |
| TypeScript transformation and syntax | Passed in Node 24.19.0; extension and example source transformed and executed |
| State/dispatch logic against mocked MakeCode APIs | Passed: 11 test groups; includes baseline, edges, disappearance/recovery, multiple listeners, replacement, cancellation, busy handlers, yielding reads, fixed positions, pause bounds, and package checks |
| PXT compiler / Minecraft target typecheck | Not run; target compiler unavailable in this session |
| Toolbox rendering / Blocks decompilation | Not run |
| Python conversion | Not run |
| Minecraft lit/unlit lamp bridge | Not run |
| Lever/button inventory matrix | Not run |
| Device/version and multiplayer compatibility | Not run |
| GitHub extension import | Not run; GitHub connector is disabled by workspace administrator; no GitHub CLI/authentication is available |

Offline tests use Node's TypeScript transformation and a mocked API. They validate the extension's logic, not the Minecraft implementation of the tested API. A passing offline test is not evidence that the game bridge supports the lamp queries.

Before classroom use, complete `docs/teacher-pilot.md` and append actual versions, devices, and measured results here.
