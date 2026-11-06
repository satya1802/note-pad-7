<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-06

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- DynamoDB

## Decision Outcome

Chosen option: PostgreSQL 16, because Approved stack and restated to honor it exactly. Notes are stored only in each visitor's browser local storage, so PostgreSQL holds no data in this version.

## Consequences

No central persistence means no backup or recovery and no cross-device access -- an accepted trade-off (NFR-004); PostgreSQL 16 remains the chosen store should server-side persistence ever be approved.
<!-- sdlc:auto:end adr -->