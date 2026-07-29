**BARANGAY iSERVE**

**UNIFIED PLATFORM**

**UP-PM-00**

# Unified Platform Program Memory Register and Decision Log

*Control baseline for the broader multi-system Barangay iSERVE roadmap*

| Document Control Item | Value |
|---|---|
| Version | v0.1 |
| Status | Draft for review and approval |
| Prepared | 29 July 2026 |
| Repository target | dandomser-hub/iserve-unified-platform |
| Target branch | main |
| Commit authorization | Approved by Project Owner on 29 July 2026; committed through a documentation feature branch and draft PR |

> **CONTROL NOTE** — This document establishes a new unified-platform program baseline. It inherits approved standards and reusable decisions from the preserved Barangay iSERVE legacy MVP baseline, but it does not overwrite or supersede the archived legacy artifacts. Formal approval of this draft will be recorded through a controlled revision.

## 1. Purpose and Control Function

This register is the authoritative running memory and decision log for the Barangay iSERVE Unified Platform program. It governs program identity, system portfolio, shared-platform boundaries, artifact governance, repository strategy, roadmap sequencing, approvals, supersessions, implementation evidence, and open decisions.

| Control Area | Accepted / Proposed Baseline |
|---|---|
| Program name | Barangay iSERVE Unified Platform |
| Program class | Federated barangay digital-governance platform composed of independently operable but interoperable systems. |
| Repository | dandomser-hub/iserve-unified-platform |
| Default branch | main — verified before preparation. |
| Legacy treatment | Previous Barangay iSERVE repositories and artifacts are preserved as the Legacy MVP Baseline and remain controlled reference sources. |
| Architecture direction | Laravel modular monolith, PostgreSQL, responsive web, Laravel Auth and Policies/Gates, object storage, queues/scheduler, audit logs, API readiness, Render MVP deployment, Keycloak later. |
| Delivery standard | ChatGPT for architecture/specifications/backlog/QA; Codex for implementation; GitHub source control; Bolt only for demo/UI exploration. |

## 2. Program System Portfolio

| Portfolio Element | Purpose | Priority |
|---|---|---|
| Unified Dashboard | Program landing page, system launcher, role-scoped command view and cross-system status. | Platform foundation |
| Identity and Access Platform | Shared authentication, MVP SSO behavior, authorization, scope, session and access audit. | Platform foundation |
| iSERVE DRRM | Disaster preparedness, emergency operations, event-centered reporting, evacuation/displacement, resources and recovery. | 1 — Primary focus |
| iSERVE GAD | GAD planning, budgeting, implementation monitoring, Annex D-1/E-1 and evidence. | 2 — Second focus |
| iSERVE Barangay Governance | Core operations, assets/inventory and deferred/future governance subsystems. | 3 — Third focus |
| iSERVE Citizens | Citizen-facing access to approved services and information from all systems. | 4 — Fourth focus |

## 3. Accepted Program Decisions

| Decision ID | Decision | Effect | Status |
|---|---|---|---|
| UP-D-001 | Establish a new artifact framework rather than renumbering the legacy MVP series. | New program, shared-platform and system-specific workstreams begin at v0.1. | Accepted |
| UP-D-002 | Use a multi-system structure with one Unified Dashboard and shared Identity/SSO portal. | Systems may operate independently but integrate through shared services and contracts. | Accepted |
| UP-D-003 | Reuse the old landing/auth page as the new dedicated authentication portal. | The new landing page becomes the Dashboard and system portal. | Accepted |
| UP-D-004 | Treat the preserved previous repositories and artifacts as the Legacy MVP Baseline. | Existing progress remains auditable and reusable; the new program does not restart or overwrite it. | Accepted |
| UP-D-005 | Use dandomser-hub/iserve-unified-platform with main as the designated repository baseline. | All new program artifacts and future implementation are organized under the unified-platform repository. | Verified / commit authorized |
| UP-D-006 | Adopt program, shared-platform and separate DRRM/GAD/Governance/Citizens analysis and architecture workstreams. | Shared decisions are defined once and referenced by subordinate systems. | Accepted |
| UP-D-007 | Retain previous Word, Draw.io, versioning and institutional styling standards. | A4 documents, A3 diagrams where appropriate, green master identity and controlled accent colors. | Accepted |
| UP-D-008 | Use a documentation feature branch and draft PR to main for the initial foundation package. | Main remains unchanged until review and merge. | Accepted |
| UP-D-009 | Adopt system accents: DRRM amber, GAD purple, Governance teal, Citizens blue and Identity/Security navy under the institutional green master identity. | Distinguishes systems without fragmenting the Barangay iSERVE brand. | Accepted |
| UP-D-010 | Use useful README files to establish and explain repository documentation folders. | Avoids unexplained empty-directory placeholders. | Accepted |

## 4. Artifact Framework

| Workstream Code | Workstream | Initial Control Artifact |
|---|---|---|
| UP-PM | Unified Platform Program | UP-PM-00 Program Memory Register and Decision Log |
| UP-SA | Shared Platform Systems Analysis | UP-SA-00 Systems Analysis Memory Register and Decision Log |
| UP-ARCH | Shared Platform Architecture | UP-ARCH-00 System Design and Architecture Memory Register and Decision Log |
| DRRM-SA / DRRM-ARCH | iSERVE DRRM | Separate analysis and architecture registers |
| GAD-SA / GAD-ARCH | iSERVE GAD | Separate analysis and architecture registers |
| GOV-SA / GOV-ARCH | iSERVE Barangay Governance | Separate analysis and architecture registers |
| CIT-SA / CIT-ARCH | iSERVE Citizens | Separate analysis and architecture registers |

## 5. Repository Documentation Structure

- `00-program`
- `01-shared-platform`
- `02-drrm`
- `03-gad`
- `04-governance`
- `05-citizens`
- `06-integration`
- `07-security-privacy`
- `08-deployment`
- `99-legacy-reference`

System workstream folders use the standard subfolders: `system-analysis`, `system-architecture`, `diagrams`, `backlog`, `decisions`, and `release-evidence`. Program-wide special-purpose folders may use focused documents and cross-references instead of duplicating subordinate artifacts.

## 6. Program Roadmap Baseline

| Wave | Scope | Primary Exit |
|---|---|---|
| 0 | Controlled realignment and preservation | Approved system boundaries, mapping of legacy capability and new artifact baseline. |
| 1 | Unified Dashboard, shared identity and platform shell | Single sign-in experience, system launcher and role-scoped access. |
| 2 | iSERVE DRRM MVP | Event-centered barangay DRRM operations and controlled reporting. |
| 3 | iSERVE GAD MVP | Planning, budgeting, implementation monitoring and Annex D-1/E-1. |
| 4 | Barangay Governance Core | Registry, documents, collections, blotter/KP, legislative and compliance services. |
| 5 | Assets and Inventory | Auditable property, supply, equipment, maintenance and DRRM resource linkage. |
| 6 | iSERVE Citizens MVP | Citizen accounts, services, requests, alerts, participation and verification. |
| 7 | Integrated command dashboard | Cross-system, role-scoped leadership and compliance views. |
| 8+ | Operational expansion and controlled future capabilities | Offline DRRM subset, federation, advanced analytics and later approved capabilities. |

## 7. Commit and Review Position

The Project Owner approved all recommended initial commit decisions on 29 July 2026. The initial package is to be committed to `docs/unified-platform-program-foundation` and submitted as a draft pull request to `main`. The artifacts remain **Draft for Review and Approval** until a controlled approval revision is issued.

## 8. Version History

| Version | Date | Change | Status |
|---|---|---|---|
| v0.1 | 29 July 2026 | Initial program control baseline reflecting the accepted multi-system roadmap, verified unified repository target and approved documentation-branch commit path. | Draft for review and approval |
