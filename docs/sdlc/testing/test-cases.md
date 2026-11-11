# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
59 tests · Passed 28 · Failed 0 · Skipped 0 · Not run 31

Acceptance criteria covered: 27/27 · passing: 2/27
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
| AC-014 | Notes > [AC-014] a search term filters the list to notes whose body matches, even when the title does not | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-014 | Notes > [AC-014] a search term filters the list to notes whose title matches | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-015 | Notes > [AC-015] a search term matching no notes shows an empty/no-results state, not the full list | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
| AC-016 | Notes > [AC-016] clearing an active search term shows the full list of all notes again | Unit | Passed | `frontend/src/screens/Notes.test.ts` |
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
| AC-007 | [AC-007] continuing to type after a pause keeps saving automatically, with no manual save action | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-008 | [AC-008] closing a note by returning to the list and reopening it shows the latest auto-saved changes | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
| AC-009 | [AC-009] the editor has no manual save control and shows that saving is automatic | E2E | Not run yet | `frontend/e2e/notes.spec.ts` |
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
| AC-007 | NoteDetail > [AC-007] pausing then continuing to type keeps saving automatically with no manual save action | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| AC-008 | NoteDetail > [AC-008] reopening the note after it was closed shows the most recently auto-saved changes | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| AC-009 | NoteDetail > [AC-009] the editor shows no manual save button and states that saving is automatic | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| — | NoteDetail > deletes the note from the store and persistence, then returns to the list | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| — | NoteDetail > shows a clear English 'note not found' state with a link back to the list for an unknown id | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |
| — | NoteDetail > shows no login, payment, or non-English copy | Unit | Passed | `frontend/src/screens/NoteDetail.test.ts` |

## Sprint 2

### US-007: Search across notes

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-014 | [AC-014] entering a search term filters the list to notes whose title or body matches it | E2E | Not run yet | `frontend/e2e/search.spec.ts` |
| AC-015 | [AC-015] a search term matching no notes shows an empty/no-results state | E2E | Not run yet | `frontend/e2e/search.spec.ts` |
| AC-016 | [AC-016] clearing the search term shows the full list of all notes again | E2E | Not run yet | `frontend/e2e/search.spec.ts` |

### US-010: Notes stay private to this browser with no cross-device sync

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-021 | [AC-021] a note created in one browser profile does not appear in a separate, | E2E | Not run yet | `frontend/e2e/privacy.spec.ts` |
| AC-022 | [AC-022][NFR-001] clearing the site's browser data erases every note, with no copy | E2E | Not run yet | `frontend/e2e/privacy.spec.ts` |
| — | [NFR-001] create, edit, search and delete flows issue no cross-origin request and no | E2E | Not run yet | `frontend/e2e/privacy.spec.ts` |

### US-012: Use the app on desktop and mobile browsers responsively

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-025 | [AC-025] the editor is usable with no horizontal overflow at 1280x800 | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-025 | [AC-025] the list renders in more than one column at 1280x800 | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-026 | [AC-026] create, edit, search and delete each complete end to end at 390x844 with no horizontal scrolling | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |
| AC-026 | [AC-026] the delete confirmation dialog and both of its buttons are visible within the viewport at 390x844 | E2E | Not run yet | `frontend/e2e/responsive.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | dropsTheDriverPartThePlatformWrites | Unit | Passed | `backend/src/test/java/app/DatabaseUrlEnvironmentPostProcessorTest.java` |
| — | runsInMemoryWithNoDatabaseSet | Unit | Passed | `backend/src/test/java/app/DatabaseUrlEnvironmentPostProcessorTest.java` |
| — | reportsOk | Unit | Passed | `backend/src/test/java/app/HealthControllerTest.java` |
| AC-007 | [AC-007] typing in title and body persists with no save button clicked, after the debounce window | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| AC-008 | [AC-008] closing the note and reopening it in the same browser shows the most recent changes | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| AC-009 | [AC-009] the editor exposes an automatic-save status and no element matching /save/i acting as a save button | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| AC-012 | [AC-012] clicking a note from the list opens the editor populated with that note's title and body | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| AC-013 | [AC-013] returning to the list and opening a second note shows the second note's content, not the first's | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| AC-017 | [AC-017] delete plus confirm removes the note from the list and it is absent after a reload | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| AC-018 | [AC-018] delete plus cancel retains the note unchanged | E2E | Not run yet | `frontend/e2e/editor.spec.ts` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
