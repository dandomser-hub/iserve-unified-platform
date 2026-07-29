# Barangay iSERVE Unified Platform

## UP-PM-02 — Unified Platform System Portfolio and Capability Map

| Document Control Item | Value |
|---|---|
| Version | v0.1 |
| Status | Draft for review and approval |
| Prepared | 29 July 2026 |
| Diagram | `docs/00-program/diagrams/UP-PM-02 - Unified Platform System Portfolio and Capability Map v0.1.drawio` |
| Program authority | UP-PM-00 and UP-PM-01 v0.1 |

> **Control note:** This portfolio map defines system boundaries and shared-platform relationships. It is a program-level capability view, not a claim that every capability is already implemented.

## 1. Portfolio Model

The Barangay iSERVE Unified Platform consists of a common entry and control layer, four independently operable business systems, shared platform services, and controlled data, integration and operations foundations.

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

## 2. Unified Dashboard and System Portal

The new landing page provides:

- public barangay information and approved advisories;
- system discovery and citizen-service entry points;
- authentication entry;
- role-scoped system launcher after sign-in;
- pending tasks, approvals, compliance and alerts;
- cross-system executive indicators based on authorized source records.

The Dashboard is not a replacement for system-owned transactional workflows. It consumes controlled metrics and task summaries.

## 3. Shared Identity and Access Portal

The former landing/authentication page is reused as the dedicated identity portal. It provides:

- Laravel Auth for MVP and early implementation;
- centralized session and SSO-like behavior across the modular platform;
- role, permission, barangay and module scope;
- Policies/Gates and record-level controls;
- access and denied-action audit;
- later Keycloak migration or federation readiness.

Authentication alone is not authorization. Every route, API, workflow action, record, attachment, report and export remains subject to applicable access controls.

## 4. Business Systems

### 4.1 iSERVE DRRM

Primary capabilities:

- preparedness and early warning;
- canonical disaster events and operational periods;
- command and EOC context;
- SitRep and DANA;
- evacuation and displacement;
- DROMIC-ready summaries;
- evacuation centers;
- resources and equipment;
- relief operations;
- recovery, planning and compliance;
- approved public advisories and later narrow offline field capture.

### 4.2 iSERVE GAD

Primary capabilities:

- GFPS governance;
- gender analysis and evidence;
- GAD Plan and Budget / Annex D-1;
- PPA and participant monitoring;
- budget attribution and utilization;
- indicators and sex-disaggregated reporting;
- MOV repository;
- GAD Accomplishment Report / Annex E-1;
- approval, submission and public information.

Restricted VAWC and BCPC records remain outside the general module.

### 4.3 iSERVE Barangay Governance

Primary subsystem groups:

- Barangay Core Operations;
- Resident and Household Registry;
- Document Services;
- Collection Reference and Transparency;
- Blotter and Katarungang Pambarangay;
- Legislative and Assembly Records;
- Planning and Compliance;
- Personnel and Organizational Records;
- Assets and Inventory;
- later controlled Health, Nutrition and Welfare capabilities.

### 4.4 iSERVE Citizens

Primary capabilities:

- citizen account and resident linkage;
- service catalog and document requests;
- request tracking and notifications;
- public DRRM and GAD information;
- announcements and participation;
- feedback and consultations;
- public document verification.

Citizen access is purpose-limited and does not grant internal-system privileges.

## 5. Shared Platform Services

| Shared Capability | Program Role |
|---|---|
| Resident and household master data | Authoritative shared identity and demographic foundation with purpose-limited use. |
| Barangay profile and reference data | Consistent barangay, purok/sitio, role, category and configuration values. |
| Workflow and approvals | Common state, task, reason, approval and notification patterns. |
| Notifications | Queued in-app and approved external notifications with delivery evidence. |
| Files and templates | Object storage, versions, signed access, classification and retention metadata. |
| Audit | Append-oriented security, operational, approval, report and export evidence. |
| Reporting and exports | Controlled extracts, versioned outputs, lineage and submission packages. |
| Search | Authorization-aware search within system and record scope. |
| Public verification | Minimal token or QR verification without exposing source records. |
| Configuration | Controlled settings, feature flags and history. |

## 6. Data, Integration and Operations Foundation

- PostgreSQL for structured transactional data;
- S3-compatible object storage for templates, attachments, generated documents, evidence and reports;
- backup and archive storage;
- REST `/api/v1` readiness;
- internal service contracts and domain events;
- controlled exports and adapters;
- queues and scheduler;
- GitHub source control and CI/CD;
- Render MVP deployment;
- monitoring, backup, restore and rollback readiness.

The systems are logical bounded modules inside the approved Laravel modular monolith for the MVP. They are not prematurely split into unrelated microservices.

## 7. Data Ownership Principle

Each transactional record has one authoritative system owner. Other systems may consume only the data required for an approved purpose through controlled service interfaces, APIs, events or aggregates. Cross-system use must preserve least privilege, privacy classification, provenance and auditability.

## 8. External Context

Controlled external actors and organizations include:

- residents and requestors;
- barangay officials and staff;
- MDRRMO/CDRRMO;
- GAD and planning reviewers;
- municipal/city offices;
- notification channels;
- storage and hosting providers;
- future authorized government or ecosystem integrations.

External organizations are integration boundaries, not internal modules. No direct national integration is claimed unless separately authorized and verified.

## 9. Visual Identity

| Portfolio Element | Controlled Accent |
|---|---|
| Unified Platform | Institutional green |
| DRRM | Hazard amber |
| GAD | Purple |
| Barangay Governance | Teal |
| Citizens | Accessible blue |
| Identity and Security | Dark navy |

Accents distinguish systems while the institutional green remains the master Barangay iSERVE identity.

## 10. Version History

| Version | Date | Change | Status |
|---|---|---|---|
| v0.1 | 29 July 2026 | Initial program system portfolio and capability map aligned with the accepted broader roadmap. | Draft for review and approval |
