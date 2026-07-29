**BARANGAY iSERVE**

**UNIFIED PLATFORM**

**UP-PM-00**

# Unified Platform Program Memory Register and Decision Log

| Document Control Item | Value |
|---|---|
| Version | v0.1a |
| Status | Approved Baseline |
| Approval date | 29 July 2026 |
| Repository | `dandomser-hub/iserve-unified-platform` |
| Default branch | `main` |
| Repository evidence | Initial foundation merged through PR #1 at merge commit `cca7b021529c008ecb8bfb9682c492e758410c95` |

> **CONTROL NOTE** — This controlled minor revision records formal Project Owner approval of UP-PM-00, UP-PM-01 and UP-PM-02 and the successful merge of the initial documentation foundation. It introduces no substantive scope or design change. The complete v0.1 content remains incorporated into this approved baseline.

## 1. Approved Program Baseline

The following decisions are approved and binding unless superseded through controlled revision:

- Barangay iSERVE shall operate as a Unified Platform composed of independently operable but interoperable systems.
- The Unified Dashboard is the new landing page and role-scoped system portal.
- The former landing/authentication page is reused as the common Identity and Access Portal.
- System priority is: iSERVE DRRM first, iSERVE GAD second, iSERVE Barangay Governance third and iSERVE Citizens fourth.
- Shared identity, authorization, resident/household data, workflow, audit, files, notifications, reporting, integration and deployment decisions are defined at platform level and referenced by subordinate systems.
- The formal MVP remains a Laravel modular monolith with PostgreSQL, responsive web, Laravel Auth and Policies/Gates, S3-compatible storage, queues/scheduler, audit logs, API readiness and Render deployment; Keycloak remains later.
- ChatGPT governs architecture/specifications/backlog/QA; Codex governs implementation; GitHub is source control; Bolt is limited to optional demo/UI exploration.
- The previous Barangay iSERVE repositories and approved artifacts are preserved as the Legacy MVP Baseline and are not overwritten.

## 2. Approved Artifact Framework

| Code | Workstream | Initial control artifact |
|---|---|---|
| UP-PM | Unified Platform Program | UP-PM-00 |
| UP-SA | Shared Platform Systems Analysis | UP-SA-00 |
| UP-ARCH | Shared Platform Architecture | UP-ARCH-00 |
| DRRM-SA / DRRM-ARCH | iSERVE DRRM | Separate analysis and architecture registers |
| GAD-SA / GAD-ARCH | iSERVE GAD | Separate analysis and architecture registers |
| GOV-SA / GOV-ARCH | iSERVE Barangay Governance | Separate analysis and architecture registers |
| CIT-SA / CIT-ARCH | iSERVE Citizens | Separate analysis and architecture registers |

## 3. Approved Repository Structure

The controlled documentation root is `docs/` with:

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

System workstreams use `system-analysis`, `system-architecture`, `diagrams`, `backlog`, `decisions` and `release-evidence` as applicable.

## 4. Closed Initial Decisions

| Decision ID | Decision | Status |
|---|---|---|
| UP-D-008 | Approve UP-PM-00, UP-PM-01 and UP-PM-02 as the initial Unified Platform program baseline. | Accepted — 29 July 2026 |
| UP-D-009 | Approve institutional green as master identity, with DRRM amber, GAD purple, Governance teal, Citizens blue and Identity/Security navy. | Accepted |
| UP-D-010 | Use useful README files to establish and explain documentation folders. | Accepted |
| UP-D-011 | Maintain only a controlled legacy index and links under `99-legacy-reference`; do not duplicate all archived source files. | Accepted |
| UP-D-012 | Merge the reviewed initial foundation through PR #1 into `main`. | Completed |

## 5. Next Controlled Gate

Proceed to the Shared Platform foundation artifacts: UP-SA-00, UP-ARCH-00, the Dashboard and Identity baseline, shared-data ownership matrix, and C4 landscape/context views. Implementation work remains subject to separate backlog approval and verified repository evidence.

## 6. Version History

| Version | Date | Change | Status |
|---|---|---|---|
| v0.1 | 29 July 2026 | Initial program foundation draft. | Superseded by v0.1a |
| v0.1a | 29 July 2026 | Approval/status revision and merge evidence; no substantive design change. | Approved Baseline |
