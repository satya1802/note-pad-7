# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### EPIC-001 · approved · source: requirements:EPIC-001

Visitors can create multiple separate notes, title them, edit plain-text bodies, and have changes auto-save as they type. Rich formatting is explicitly excluded.

- US-001 (critical): Create a new, separate note; opens empty and editable, stored independently without overwriting existing notes (AC-001, AC-002).
- US-002 (high): Title a note; title saves and labels the note in the list; empty title still saves with an "Untitled" placeholder (AC-003, AC-004).
- US-003 (critical): Write/edit plain-text body; edits reflected exactly as typed; any pasted/applied rich formatting (bold, headings, lists, checkboxes) is stripped to plain text (AC-005, AC-006).
- US-004 (critical): Auto-save while typing, no manual save button; reopening the note in the same browser shows the latest changes; UI reflects automatic saving (AC-007, AC-008, AC-009).

**Related:** US-001, US-002, US-003, US-004, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009

### EPIC-002 · approved · source: requirements:EPIC-002

Visitors can browse a list of all notes, open any note to view/edit it, search across notes, and delete notes with confirmation.

- US-005 (critical): Browsable list shows each note by title/placeholder; empty state shown with no notes and guidance to create one (AC-010, AC-011).
- US-006 (critical): Selecting a note opens it with full title/body for view and edit; switching notes always shows the correct content (AC-012, AC-013).
- US-007 (high): Search filters the list by title/body match; no-match shows empty/no-results state; clearing search restores full list (AC-014, AC-015, AC-016).
- US-008 (high): Delete requires confirmation; confirming permanently removes the note from list and local storage; cancelling leaves it unchanged (AC-017, AC-018).

**Related:** US-005, US-006, US-007, US-008, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018

### EPIC-003 · approved · source: requirements:EPIC-003

Notes persist only in the visitor's own browser between visits via local storage, with no server database, no cross-device sync, and no cloud backup. Clearing browser data erases notes (an accepted risk).

- US-009 (critical): Notes and content persist across browser close/reopen on the same device; no account or server storage required (AC-019, AC-020).
- US-010 (high): Notes stay private to the originating browser -- not visible in another browser/device, since there is no sync or backup; clearing site data erases notes (AC-021, AC-022).
- NFR-004 (accepted risk): No backup/recovery path exists if browser data is cleared -- deliberate trade-off for this version.

**Related:** US-009, US-010, NFR-001, NFR-004, AC-019, AC-020, AC-021, AC-022

### EPIC-004 · approved · source: requirements:EPIC-004

The app is free with no login/accounts/payments, works responsively on desktop and mobile browsers, and presents an English-only interface with no localization.

- US-011 (critical): New visitors can create/use notes immediately with no login, sign-up, or payment at any point (AC-023, AC-024).
- US-012 (high): Responsive layout -- desktop shows list and editor suited to larger screens; mobile adapts layout and keeps create/edit/search/delete usable (AC-025, AC-026).
- US-013 (low): Single-language English UI, no language-switching option (AC-027).
- NFR-002/NFR-003/NFR-006 restate the no-barrier access, cross-platform responsiveness, and English-only scope as accepted non-functional qualities.

**Related:** US-011, US-012, US-013, NFR-002, NFR-003, NFR-006, AC-023, AC-024, AC-025, AC-026, AC-027

### NFR-001 · approved · source: requirements:NFR-001

Privacy quality requirement: notes must never be sent to or kept on a server.

Notes are stored only in the visitor's own browser; each browser's notes are private and not visible from any other browser or device. Applies to US-009, US-010.

**Related:** US-009, US-010

### NFR-005 · approved · source: requirements:NFR-005

Accepted risk: no server-side scalability is designed for since there is no backend data load.

Because all data lives locally per-browser with no backend, no concurrent-user or server scaling capacity was designed for in this version. Applies to the whole system.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-06

**Capabilities in scope:** Create multiple separate notes, Give each note a title, Write and edit a plain-text note body, Browsable list of all notes, Open a note to view and edit, Delete a note, Search across notes, Auto-save notes while typing, Keep notes in the visitor's own browser between visits, Responsive layout for desktop and mobile browsers, Plain-text notes only, no bold/headings/checkboxes, Notes stored only in the visitor's own browser, no sync, Free to use with no login, accounts, or payments, English-only interface

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | Spring Boot | — |
| cloud | AWS | Because the whole app is static files running in the browser, hosting just needs to deliver those files reliably to desktop and mobile visitors for near-zero cost. AWS (S3 for the files plus CloudFront for fast global delivery) does this cheaply and is the available option; a free notepad with no backend load will likely cost only cents per month. |
| database | PostgreSQL | You deliberately chose to keep notes in the visitor's own browser with no server-side database and no cross-device sync, so this product stores nothing centrally. PostgreSQL is the only database option available and is named here only to satisfy the stack; in the actual app it holds no data -- each browser's local storage is the real store. |
| frontend | Vue | — |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Note Creation and Editing

Allow each visitor to create multiple separate notes, give each a title, write and edit a plain-text body, and have changes auto-saved as they type. Content is plain text only; rich formatting (bold, headings, lists, checkboxes) is explicitly out of scope for this version.

### US-001: Create a new note

**Priority:** critical

> As a visitor using the notepad app, I want to create a new, separate note, so that I can capture a distinct piece of information independently from my other notes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am on the notepad app with any number of existing notes | I choose the action to create a new note | a new empty note is created with an editable title and an empty plain-text body, opened ready for editing, and added as a separate entry alongside my existing notes |
| AC-002 | I already have one or more notes | I create another new note | the new note is stored separately and does not overwrite or merge with any existing note |

### US-002: Give a note a title

**Priority:** high

> As a visitor editing a note, I want to give the note a title, so that I can identify and recognise the note in my list.

| ID | Given | When | Then |
|---|---|---|---|
| AC-003 | I have a note open for editing | I type text into the title field | the title is saved for that note and shown as the note's label in the list |
| AC-004 | I have a note open for editing | I leave the title empty | the note is still created and saved, and the list shows a clear placeholder label (e.g. "Untitled") so the note remains identifiable |

### US-003: Write and edit a plain-text note body

**Priority:** critical

> As a visitor editing a note, I want to write and edit plain text in the note body, so that I can record and change the content of my note.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | I have a note open for editing | I type, change, or delete text in the body | the body reflects my edits exactly as plain text |
| AC-006 | I am editing a note body | I apply or paste any rich formatting (bold, headings, lists, checkboxes) | only the plain text is retained because rich-text formatting is out of scope for this version |

### US-004: Auto-save notes while typing

**Priority:** critical

> As a visitor writing or editing a note, I want my note to save automatically as I type, so that I do not lose my work and do not have to press a save button.

| ID | Given | When | Then |
|---|---|---|---|
| AC-007 | I have a note open and am making changes to its title or body | I pause or continue typing | the changes are automatically persisted without any manual save action |
| AC-008 | I have made changes to a note that have been auto-saved | I close and reopen the note in the same browser | my most recent changes are present |
| AC-009 | auto-save is the only save mechanism (assumption: notes auto-save as the user types, with no manual save button) | I view the editor | the interface reflects that saving happens automatically and does not rely on a manual save step |

## EPIC-002: Browsing, Searching, and Managing Notes

Provide a browsable list of all notes, the ability to open a note to view and edit it, search across notes, and delete a note.

### US-005: Browse a list of all notes

**Priority:** critical

> As a visitor with saved notes, I want to see a list of all my notes, so that I can browse and find the note I want.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | I have one or more notes saved in this browser | I open the app | I see a list showing each note identified by its title (or placeholder for untitled notes) |
| AC-011 | I have no notes saved in this browser | I open the app | I see an empty state indicating there are no notes yet and how to create one |

### US-006: Open a note to view and edit

**Priority:** critical

> As a visitor browsing my notes, I want to open a note from the list, so that I can view its full content and edit it.

| ID | Given | When | Then |
|---|---|---|---|
| AC-012 | I am viewing the list of notes | I select a note from the list | the note opens showing its title and full plain-text body, ready for viewing and editing |
| AC-013 | I have a note open | I return to the list and open a different note | the correct selected note's content is displayed |

### US-007: Search across notes

**Priority:** high

> As a visitor with many notes, I want to search across my notes, so that I can quickly find the note that contains what I am looking for.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | I have multiple notes saved in this browser | I enter a search term | the list is filtered to show only notes whose title or body contains the search term |
| AC-015 | I have entered a search term that matches no notes | the search runs | an empty/no-results state is shown |
| AC-016 | I have an active search term | I clear the search | the full list of all notes is shown again |

### US-008: Delete a note

**Priority:** high

> As a visitor managing my notes, I want to delete a note, so that I can remove notes I no longer need.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | I have a note I no longer want | I choose to delete it and confirm | the note is permanently removed from the list and from this browser's local storage |
| AC-018 | I have chosen to delete a note | I am asked to confirm and I cancel | the note is retained unchanged |

## EPIC-003: Local Browser Persistence and Privacy

Notes persist in the visitor's own browser between visits using local storage (localStorage/IndexedDB). There is no server-side database, no cross-device sync, and no cloud backup; each browser holds its own private notes. Clearing browser data erases the notes. Assumption surfaced: no export/import of notes to file in this version.

### US-009: Keep notes in the browser between visits

**Priority:** critical

> As a returning visitor on the same device and browser, I want my notes to still be there when I come back, so that I do not lose my notes between sessions.

| ID | Given | When | Then |
|---|---|---|---|
| AC-019 | I created and edited notes in this browser earlier | I close the browser and reopen the app later on the same device and browser | all my previously saved notes and their content are present |
| AC-020 | notes are stored via browser local storage (assumption: localStorage/IndexedDB, no server-side database) | I use the app | no account or server storage is required for my notes to persist |

### US-010: Notes stay private to this browser with no cross-device sync

**Priority:** high

> As a visitor, I want my notes to stay only in my own browser, so that my notes remain private to this device and browser.

| ID | Given | When | Then |
|---|---|---|---|
| AC-021 | I have notes saved in one browser | I open the app in a different browser or on a different device | those notes do not appear, because there is no cross-device sync or cloud backup (explicitly out of scope) |
| AC-022 | notes are held only in local browser storage (assumption: clearing browser data erases them) | the user clears their browser data for the site | the notes are erased, consistent with local-only storage and no cloud backup |

## EPIC-004: Access, Platform, and Interface

The notepad is a free, responsive web app for desktop and mobile browsers, with no login, accounts, or payments, and an English-only interface. Assumptions surfaced: responsive web app (not a native app) and single-language English UI with no localization.

### US-011: Use the app free with no login or accounts

**Priority:** critical

> As a visitor, I want to use the notepad for free without logging in or creating an account, so that I can start taking notes immediately with no barriers or cost.

| ID | Given | When | Then |
|---|---|---|---|
| AC-023 | I am a new visitor | I open the app | I can immediately create and use notes without any login, account creation, or sign-up step |
| AC-024 | the app is free to use (assumption: no payments, billing, or subscription) | I use any feature of the app | I am never asked for payment or subscription |

### US-012: Use the app on desktop and mobile browsers responsively

**Priority:** high

> As a visitor on different devices, I want the app to work and adapt to my screen on desktop and mobile browsers, so that I can take notes comfortably whatever device I am using.

| ID | Given | When | Then |
|---|---|---|---|
| AC-025 | I open the app on a desktop browser | the app loads | the note list and editor are laid out appropriately for a larger screen and are fully usable |
| AC-026 | I open the app on a mobile browser | the app loads | the layout adapts responsively to the small screen and all core actions (create, edit, search, delete) remain usable (assumption: responsive web app, not a native app) |

### US-013: English-only interface

**Priority:** low

> As a visitor, I want the interface presented in English, so that I have a consistent, clear interface for this version.

| ID | Given | When | Then |
|---|---|---|---|
| AC-027 | the app provides a single-language English UI (assumption: no localization in this version) | I use any screen of the app | all interface labels and messages are shown in English with no language-switching option |
<!-- sdlc:auto:end epics -->
