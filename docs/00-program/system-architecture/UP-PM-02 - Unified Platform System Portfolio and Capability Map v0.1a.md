# Barangay iSERVE Unified Platform

## UP-PM-02 — Unified Platform System Portfolio and Capability Map

| Document Control Item | Value |
|---|---|
| Version | v0.1a |
| Status | Approved Baseline |
| Approval date | 29 July 2026 |
| Diagram | `docs/00-program/diagrams/UP-PM-02 - Unified Platform System Portfolio and Capability Map v0.1a.drawio` |
| Program authority | UP-PM-00 v0.1a and UP-PM-01 v0.1a |

> **Control note:** This controlled minor revision records formal approval of the portfolio map and system-boundary baseline. It does not claim that every capability is already implemented.

## 1. Approved Portfolio Model

```text
Unified Dashboard and System Portal
             │
Shared Identity and Access Portal
             │
 ┌───────────┼───────────┬────────────────────┐
 │           │           │                    │
iSERVE     iSERVE      iSERVE              iSERVE
DRRM        GAD         Barangay Governance   Citizens
 └───────────┴───────────┴────────────────────┘
             │
Shared Platform Services
             │
Data, Integration and Operations
             │
Controlled External Context
```

The Dashboard provides public information, system discovery, authentication entry, role-scoped system launch, tasks, approvals, alerts and authorized cross-system indicators. It does not replace system-owned transactional workflows.

The Identity and Access Portal provides centralized Laravel Auth sessions, role and module scope, Policies/Gates, record-level controls, denied-action audit and later Keycloak readiness.

## 2. Business-System Capability Boundaries

### iSERVE DRRM

Preparedness and early warning; canonical disaster events and periods; EOC context; SitRep; DANA; evacuation and displacement; DROMIC-ready summaries; evacuation centers; resources/equipment; relief; recovery, planning and compliance; approved advisories; later narrow offline capture.

### iSERVE GAD

GFPS governance; gender analysis; Annex D-1; PPA/participant monitoring; budget attribution/utilization; indicators and sex-disaggregated reporting; MOV; Annex E-1; approval, submission and public information. Restricted VAWC/BCPC records remain outside the general module.

### iSERVE Barangay Governance

Core operations; resident/household registry; document services; collection reference/transparency; blotter/KP; legislative and assembly records; planning/compliance; personnel; assets/inventory; later controlled health, nutrition and welfare capabilities.

### iSERVE Citizens

Citizen account and resident linkage; service catalog; document requests and tracking; notifications; public DRRM/GAD information; announcements; participation; feedback; narrow verification. Citizen access never grants internal-system privileges.

## 3. Shared Platform Services

| Shared capability | Program role |
|---|---|
| Resident and household master data | Authoritative identity and demographic foundation with purpose-limited use. |
| Barangay profile and reference data | Consistent barangay, purok/sitio, role, category and configuration values. |
| Workflow and approvals | Common state, task, reason, approval and notification patterns. |
| Notifications | Queued in-app and approved external notifications with delivery evidence. |
| Files and templates | Object storage, versions, signed access, classification and retention metadata. |
| Audit | Append-oriented security, operational, approval, report and export evidence. |
| Reporting and exports | Controlled extracts, versioned outputs, lineage and submission packages. |
| Search | Authorization-aware search within system and record scope. |
| Public verification | Minimal token or QR verification without source-record exposure. |
| Configuration | Controlled settings, feature flags and history. |

## 4. Data, Integration and Operations Foundation

- PostgreSQL for structured transactional data.
- S3-compatible object storage for templates, attachments, generated documents, evidence and reports.
- Backup/archive storage.
- REST `/api/v1` readiness.
- Internal service contracts and domain events.
- Controlled exports and adapters.
- Queues and scheduler.
- GitHub source control and CI/CD.
- Render MVP deployment.
- Monitoring, backup, restore and rollback readiness.

The systems are logical bounded modules inside the Laravel modular monolith for the MVP and are not prematurely split into microservices.

## 5. Data Ownership and External Context

Each transactional record has one authoritative system owner. Other systems consume only approved, purpose-limited data through controlled interfaces, APIs, events or aggregates. Cross-system use preserves privacy classification, provenance, least privilege and auditability.

External actors and organizations—including residents, barangay staff, MDRRMO/CDRRMO, GAD/planning reviewers, municipal/city offices, notification channels and hosting/storage providers—remain controlled integration boundaries, not internal modules. No direct national integration is claimed without separate authorization and verified implementation.

## 6. Approved Visual Identity

| Portfolio element | Controlled accent |
|---|---|
| Unified Platform | Institutional green |
| DRRM | Hazard amber |
| GAD | Purple |
| Barangay Governance | Teal |
| Citizens | Accessible blue |
| Identity and Security | Dark navy |

## 7. Version History

| Version | Date | Change | Status |
|---|---|---|---|
| v0.1 | 29 July 2026 | Initial portfolio and capability map draft. | Superseded by v0.1a |
| v0.1a | 29 July 2026 | Approval/status revision; no substantive design change. | Approved Baseline |
