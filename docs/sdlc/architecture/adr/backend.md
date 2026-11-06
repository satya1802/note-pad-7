<!-- sdlc:auto:start adr -->
# ADR-0002: Use Spring Boot 4.1 for Backend

Status: Accepted  
Date: 2026-11-06

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- Spring Boot 4.1
- Node/Express
- FastAPI

## Decision Outcome

Chosen option: Spring Boot 4.1, because Approved stack and restated to honor it exactly. In this version the product owner deliberately chose a backend-less, browser-only design, so Spring Boot carries no note data and exposes no note APIs.

## Consequences

No server component is deployed this version; if future cross-device sync (currently out of scope) is approved, Spring Boot 4.1 is already the chosen home for those APIs.
<!-- sdlc:auto:end adr -->