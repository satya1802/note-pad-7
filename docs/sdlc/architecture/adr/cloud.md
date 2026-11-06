<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-06

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Netlify
- Cloudflare Pages

## Decision Outcome

Chosen option: AWS, because Approved stack. S3 hosts the static Vue build and CloudFront delivers it fast and reliably to desktop and mobile visitors globally over HTTPS at near-zero cost.

## Consequences

Static-only hosting with no compute keeps costs to cents per month; it cannot run server logic, which is fine because the app is entirely client-side.
<!-- sdlc:auto:end adr -->