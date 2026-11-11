# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
32 tests · Passed 21 · Failed 0 · Skipped 0 · Not run 11

Acceptance criteria covered: 13/27 · passing: 2/27
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Create a new note

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | App > renders a screen inside the app shell and shows its menu | Unit | Passed | `frontend/src/App.test.ts` |
| AC-001 | Notes > [AC-001] Begin a Note creates a note and navigates to the editor | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-002 | Notes > [AC-002] creating a second note keeps the first one intact | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-010 | Notes > [AC-010] lists every note by title, and 'Untitled' for a blank title | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-011 | Notes > [AC-011] shows an empty state with no notes and an action to create one | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-001 | notes store > [AC-001] createNote starts with an empty title and body | Unit | Passed | `frontend/src/stores/notes.test.ts` |
| AC-002 | notes store > [AC-002] createNote adds a distinct record each time, none overwritten | Unit | Passed | `frontend/src/stores/notes.test.ts` |
| AC-019 | notes store > [AC-019] a fresh store instance loads notes persisted earlier | Unit | Passed | `frontend/src/stores/notes.test.ts` |
| — | notes store > deleteNote removes only the targeted note | Unit | Passed | `frontend/src/stores/notes.test.ts` |
| — | notes store > notes getter sorts by updated_at desc | Unit | Passed | `frontend/src/stores/notes.test.ts` |
| — | notes store > updateNote changes only the targeted note | Unit | Passed | `frontend/src/stores/notes.test.ts` |
| AC-001 | [AC-001] creating a note lands in the editor with empty title and body and adds one entry to the list | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-003 | [AC-003] a title typed in the editor appears as the note's label in the list after navigating back | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-005 | [AC-005] body content survives a page reload exactly as typed | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-006 | [AC-006] pasting HTML/rich content into the body stores and renders plain text only, with no markup | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-010 | [AC-010] a note saved with a blank title appears in the list as 'Untitled' | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-011 | [AC-011] fresh browser profile shows the empty state with a create action | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-019 | [AC-019] notes created in the session are still present with identical content after a full page reload | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-020 | [AC-020][NFR-001] no network request for notes data is made | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-023, AC-024 | [AC-023][AC-024] no login, sign-up or payment prompt appears at any point in the create-and-use flow | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-027 | [AC-027] visible labels on the list screen are English and no language switcher exists | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |

### US-002: Give a note a title

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-003 | NoteDetail > [AC-003] typing in the title field saves the title to the note in the store | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| AC-004 | NoteDetail > [AC-004] leaving the title empty still creates and saves the note, shown as 'Untitled' | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| AC-005 | NoteDetail > [AC-005] typing, changing and deleting body text is reflected exactly as plain text and persisted | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| AC-006 | NoteDetail > [AC-006] pasting rich HTML content retains only plain text | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| — | NoteDetail > deletes the note from the store and persistence, then returns to the list | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| — | NoteDetail > shows a clear English 'note not found' state with a link back to the list for an unknown id | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| — | NoteDetail > shows no login, payment, or non-English copy | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | dropsTheDriverPartThePlatformWrites | Unit | Passed | `backend/src/test/java/app/DatabaseUrlEnvironmentPostProcessorTest.java` |
| — | runsInMemoryWithNoDatabaseSet | Unit | Passed | `backend/src/test/java/app/DatabaseUrlEnvironmentPostProcessorTest.java` |
| — | reportsOk | Unit | Passed | `backend/src/test/java/app/HealthControllerTest.java` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
