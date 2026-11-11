# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-RUN-CHECKS · approved · source: testing:run_checks

General check run succeeded.

run_checks: status=succeeded, 8/8 checks passed.

### TEST-US-006 · approved · source: testing:c6a14ee3-8449-4905-adb6-c601e7362dbb

Closed a coverage gap for opening/switching notes (US-006).

AC-012/AC-013 were already proven end-to-end in frontend/e2e/editor.spec.ts (verified passing). Gap: unit suites Notes.test.ts and NoteDetail.test.ts each stubbed the other screen, so no Vitest coverage proved the real list handing the real editor the right note. Added frontend/src/screens/NoteNavigation.test.ts mounting both real components behind one router to cover AC-012 (selecting a note opens the real editor with its title/body) and AC-013 (switching between two notes shows each one's own content, both directions).

**Related:** US-006, AC-012, AC-013

### TEST-US-007 · approved · source: testing:4dd8edc7-6ec5-4dea-a421-71b866bf67ce

Extended search coverage (US-007) with case-insensitivity and filtered-selection correctness.

Added case-insensitive matching unit test to Notes.test.ts. Added the one gap not yet covered -- selecting a note from a filtered search result opens that exact note, not another sharing the term -- as both a Pinia+router integration test (NoteNavigation.test.ts) and a full-browser Playwright spec (search.spec.ts). AC-014/015/016 were already solidly covered at unit and e2e level and left as-is.

**Related:** US-007, AC-014, AC-015, AC-016

### TEST-US-012 · approved · source: testing:583dab41-fbbf-491a-b38d-2d00f531acc0

Closed two responsive-layout coverage gaps (US-012) for desktop and mobile usability.

Extended frontend/e2e/responsive.spec.ts: AC-025 now proves search and delete, not just layout and typing, remain usable at desktop width, matching the bar AC-026 already set for mobile; AC-026 now also proves the list reflows to a single column on mobile and that primary create/delete actions meet a 44px touch-target minimum. All existing and new tests pass frontend-e2e-specs, frontend-lint, and frontend-typecheck.

**Related:** US-012, AC-025, AC-026

### TEST-US-010 · approved · source: testing:11d157a4-0888-46b9-8f2a-6de4148d3487

Confirmed privacy/no-sync coverage (US-010) and added a fast unit-level no-network proof.

AC-021/AC-022/NFR-001 were already fully covered end-to-end by frontend/e2e/privacy.spec.ts (cross-browser-context isolation, storage-clearing erasure, zero-network-request flows) and left untouched. Extended frontend/src/stores/notes.test.ts with a unit-level counterpart spying on global fetch across the full load/create/update/delete lifecycle (plus a second store instance simulating a fresh session) to prove local_store never calls the network.

**Related:** US-010, NFR-001, AC-021, AC-022
<!-- sdlc:auto:end narrative -->
