# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:v1

Product owner approved technology stack and scope boundaries for this lightweight delivery.

Approved stack (design against exactly these, no substitution): Backend Spring Boot 4.1, Cloud AWS (S3 + CloudFront for static file delivery, chosen for near-zero cost since the app is fully client-side), Database PostgreSQL 16 (named to satisfy the stack but holds no data -- each browser's local storage is the real store), Frontend Vue 3. Out of scope: cross-device sync/cloud backup of notes; rich text formatting (bold, headings, lists, checkboxes).

### EPIC-001 · approved · source: requirements:EPIC-001

Note Creation and Editing: visitors can create multiple separate notes, title them, write/edit plain-text bodies, with auto-save as they type. Rich formatting is explicitly excluded.

US-001 (critical): Creating a new note produces an empty, separately-stored note with editable title and body, opened ready for editing (AC-001, AC-002). US-002 (high): Typing a title saves and labels the note in the list; an empty title still saves the note but shows a placeholder like 'Untitled' (AC-003, AC-004). US-003 (critical): Body text edits are reflected exactly as plain text; any pasted/applied rich formatting is stripped, retaining only plain text (AC-005, AC-006). US-004 (critical): Title/body changes auto-save as the user types with no manual save button; reopening the note shows the latest changes; the editor UI reflects that saving is automatic (AC-007, AC-008, AC-009).

**Related:** US-001, US-002, US-003, US-004, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009

### EPIC-002 · approved · source: requirements:EPIC-002

Browsing, Searching, and Managing Notes: a browsable list of all notes, opening a note to view/edit, searching across notes, and deleting a note with confirmation.

US-005 (critical): The list shows every saved note by title/placeholder; with no notes, an empty state explains there are none yet and how to create one (AC-010, AC-011). US-006 (critical): Selecting a note from the list opens its full title and body for viewing/editing; switching notes always shows the correct content (AC-012, AC-013). US-007 (high): A search term filters the list to notes whose title or body contains it; no matches show an empty/no-results state; clearing the search restores the full list (AC-014, AC-015, AC-016). US-008 (high): Deleting a note requires confirmation -- confirming permanently removes it from the list and local storage; cancelling leaves it unchanged (AC-017, AC-018).

**Related:** US-005, US-006, US-007, US-008, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018

### EPIC-003 · approved · source: requirements:EPIC-003

Local Browser Persistence and Privacy: notes persist only in the visitor's own browser via local storage, with no server-side database, cross-device sync, or cloud backup.

US-009 (critical): Notes and their content remain present after closing/reopening the browser on the same device, with no account or server storage required (AC-019, AC-020 -- assumption: localStorage/IndexedDB, no server-side database). US-010 (high): Notes saved in one browser do not appear in a different browser or device (no cross-device sync/cloud backup, explicitly out of scope); clearing browser data erases the notes (AC-021, AC-022 -- assumption: clearing browser data erases them). Assumption surfaced: no export/import of notes to file in this version.

**Related:** US-009, US-010, AC-019, AC-020, AC-021, AC-022, NFR-001, NFR-004

### EPIC-004 · approved · source: requirements:EPIC-004

Access, Platform, and Interface: free responsive web app for desktop and mobile with no login/accounts/payments, English-only interface.

US-011 (critical): New visitors can immediately create/use notes with no login, account creation, or sign-up; the app never asks for payment or subscription (AC-023, AC-024 -- assumption: no payments/billing/subscription). US-012 (high): Desktop layout suits larger screens; mobile layout adapts responsively, keeping create/edit/search/delete usable on both (AC-025, AC-026 -- assumption: responsive web app, not native). US-013 (low): All interface labels/messages are shown in English only, with no language-switching option (AC-027 -- assumption: no localization in this version).

**Related:** US-011, US-012, US-013, AC-023, AC-024, AC-025, AC-026, AC-027, NFR-002, NFR-003, NFR-006

### NFR-001 · approved · source: requirements:NFR-001

Privacy: notes stored only in the visitor's browser, never sent to or kept on a server.

Each browser holds its own private notes, not visible on any other browser or device. Applies to US-009, US-010.

**Related:** US-009, US-010

### NFR-002 · approved · source: requirements:NFR-002

Usability: instant access with no barriers.

A visitor can open the app and immediately create/use notes with no login, account creation, sign-up, or payment step at any point. Applies to US-011.

**Related:** US-011

### NFR-003 · approved · source: requirements:NFR-003

Compatibility: works responsively on desktop and mobile browsers.

The app works and adapts responsively on both desktop and mobile web browsers, keeping all core actions usable on each, delivered as a web app rather than a native app. Applies to US-012.

**Related:** US-012

### NFR-004 · approved · source: requirements:NFR-004

Availability (accepted risk): no cross-device sync or backup.

Notes are kept only in local browser storage with no cross-device sync and no cloud backup; clearing browser data for the site permanently erases notes. This loss of backup/recovery path is an accepted trade-off for this version. Applies to US-010.

**Related:** US-010

### NFR-005 · approved · source: requirements:NFR-005

Scalability (accepted risk): no server-side scale concerns.

Because all data lives locally in each visitor's browser and there is no backend data load, no concurrent-user or server scaling capacity is designed for in this version. Applies to the whole system.

### NFR-006 · approved · source: requirements:NFR-006

Compliance (accepted risk): English only, no localization.

The interface is provided in a single language, English, with no localization or language-switching option in this version. Applies to US-013.

**Related:** US-013
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
