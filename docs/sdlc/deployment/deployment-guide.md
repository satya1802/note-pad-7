# Deployment Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start how-it-deploys -->
Pushes to `main` run `.github/workflows/deploy.yml`, which builds the API image (if there is a backend) and deploys the SPA to AWS Amplify. Commits touching only `docs/sdlc/**` don't deploy. Deployments can also be started from the platform's Deployment tab.
<!-- sdlc:auto:end how-it-deploys -->

<!-- sdlc:auto:start environments -->
| Name | Service | Runtime | Scaling | Environment |
|---|---|---|---|---|
| S3 Static Bucket | AWS S3 | Static object storage | Managed by AWS, effectively unlimited for static files | dev |
| CloudFront Distribution | AWS CloudFront | Global edge CDN | Auto-scaled at edge, pay-per-use | dev |
| Visitor Browser | Vue 3 SPA + local storage | Desktop and mobile web browsers | Per-device; no central load | dev |
<!-- sdlc:auto:end environments -->

<!-- sdlc:auto:start live -->
_Not deployed yet._
<!-- sdlc:auto:end live -->

<!-- sdlc:auto:start topology -->
```mermaid
graph LR
  n_S3_Static_Bucket["S3 Static Bucket<br/>AWS S3"]
  n_CloudFront_Distribution["CloudFront Distribution<br/>AWS CloudFront"]
  n_Visitor_Browser["Visitor Browser<br/>Vue 3 SPA + local storage"]
  n_CloudFront_Distribution -->|"HTTPS"| n_S3_Static_Bucket
  n_Visitor_Browser -->|"HTTPS"| n_CloudFront_Distribution
```
<!-- sdlc:auto:end topology -->
