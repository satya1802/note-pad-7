<!-- sdlc:auto:start adr -->
# ADR-0001: Use Vue 3 for Frontend

Status: Accepted  
Date: 2026-11-06

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- Vue 3
- React
- Svelte

## Decision Outcome

Chosen option: Vue 3, because Approved stack. Vue 3's reactivity cleanly drives the note list, editor, debounced auto-save, and reactive search filtering, and it builds to static files that ship from S3/CloudFront with no backend.

## Consequences

As a client-only SPA the entire logic and data layer live in the browser; there is no server-side rendering, but for a tiny local notepad that is appropriate and keeps hosting cost near zero.
<!-- sdlc:auto:end adr -->