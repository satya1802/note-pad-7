# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Create a new note | US-001 | 1 | local_store, note, spa | frontend/e2e/notes.spec.ts, frontend/src/App.test.ts, frontend/src/App.vue, frontend/src/main.ts, frontend/src/screens/Notes.test.ts +3 more | f927ac3 | delivered | succeeded | 2/2 tested · 1/2 passing | — |
| US-002 | EPIC-001 | Give a note a title | US-002 | 1 | note, spa | frontend/e2e/notes.spec.ts, frontend/src/screens/NoteDetail.test.ts, frontend/src/screens/NoteDetail.vue | 9ca8a3c | delivered | succeeded | 2/2 tested · 1/2 passing | — |
| US-003 | EPIC-001 | Write and edit a plain-text note body | US-003 | 1 | note, spa | — | 9ca8a3c | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-004 | EPIC-001 | Auto-save notes while typing | US-004 | 2 | local_store, note, spa | frontend/e2e/notes.spec.ts, frontend/src/screens/NoteDetail.test.ts, frontend/src/stores/notes.ts | 278c63d, 0f6ba79 | delivered | not run | 3/3 tested · 0/3 passing | — |
| US-005 | EPIC-002 | Browse a list of all notes | US-005 | 1 | local_store, note, spa | — | f927ac3 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-006 | EPIC-002 | Open a note to view and edit | US-006 | 2 | note, spa | frontend/src/screens/NoteNavigation.test.ts | 278c63d, 0f6ba79 | delivered | succeeded | 2/2 tested · 0/2 passing | — |
| US-007 | EPIC-002 | Search across notes | US-007 | 2 | note, spa | frontend/e2e/search.spec.ts, frontend/src/screens/NoteNavigation.test.ts, frontend/src/screens/Notes.test.ts | 278c63d | delivered | succeeded | 3/3 tested · 0/3 passing | — |
| US-008 | EPIC-002 | Delete a note | US-008 | 2 | local_store, note, spa | — | 278c63d, 0f6ba79 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-009 | EPIC-003 | Keep notes in the browser between visits | US-009 | 1 | local_store, note, spa | — | f927ac3 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-010 | EPIC-003 | Notes stay private to this browser with no cross-device sync | US-010 | 2 | local_store, note | frontend/e2e/privacy.spec.ts, frontend/src/stores/notes.test.ts | 0f6ba79 | failed | succeeded | 2/2 tested · 0/2 passing | — |
| US-011 | EPIC-004 | Use the app free with no login or accounts | US-011 | 1 | spa | — | f927ac3 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-012 | EPIC-004 | Use the app on desktop and mobile browsers responsively | US-012 | 2 | spa | frontend/e2e/responsive.spec.ts, frontend/src/screens/NoteDetail.vue | a88022a | failed | succeeded | 2/2 tested · 0/2 passing | — |
| US-013 | EPIC-004 | English-only interface | US-013 | 1 | spa | — | f927ac3 | delivered | not run | 1/1 tested · 0/1 passing | — |
<!-- sdlc:auto:end matrix -->
