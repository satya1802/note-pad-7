# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Stand up local-storage persistence and deliver core note creation, titling, body editing, and the browsable note list with free, English-only access.

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Create a new note | 3 | frontend-agent | US-009 |
| US-002 | Story | Give a note a title | 2 | frontend-agent | US-001 |
| US-003 | Story | Write and edit a plain-text note body | 3 | frontend-agent | US-001 |
| US-005 | Story | Browse a list of all notes | 3 | frontend-agent | US-001 |
| US-009 | Story | Keep notes in the browser between visits | 5 | frontend-agent | — |
| US-011 | Story | Use the app free with no login or accounts | 1 | frontend-agent | — |
| US-013 | Story | English-only interface | 1 | frontend-agent | — |

## Sprint 2: Sprint 2

Complete auto-save, note opening/search/delete, privacy/no-sync behavior, and responsive desktop/mobile layout.

Capacity: 20 points · Committed: 16

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-004 | Story | Auto-save notes while typing | 3 | frontend-agent | US-001, US-002, US-003 |
| US-006 | Story | Open a note to view and edit | 2 | frontend-agent | US-005 |
| US-007 | Story | Search across notes | 3 | frontend-agent | US-005 |
| US-008 | Story | Delete a note | 2 | frontend-agent | US-005, US-006 |
| US-010 | Story | Notes stay private to this browser with no cross-device sync | 1 | qa-agent | US-009 |
| US-012 | Story | Use the app on desktop and mobile browsers responsively | 5 | frontend-agent | US-001, US-005, US-006 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
