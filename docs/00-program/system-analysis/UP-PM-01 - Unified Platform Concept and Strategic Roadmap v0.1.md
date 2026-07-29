# Barangay iSERVE Unified Platform

## UP-PM-01 — Unified Platform Concept and Strategic Roadmap

| Document Control Item | Value |
|---|---|
| Version | v0.1 |
| Status | Draft for review and approval |
| Prepared | 29 July 2026 |
| Program authority | UP-PM-00 Unified Platform Program Memory Register and Decision Log v0.1 |
| Repository | dandomser-hub/iserve-unified-platform |
| Target branch | main through a reviewed feature-branch pull request |

> **Control note:** This artifact defines the initial strategic roadmap for the broader Barangay iSERVE Unified Platform. It preserves the approved legacy MVP as a controlled reference, but establishes a new program and artifact series for the multi-system roadmap.

## 1. Strategic Vision

Barangay iSERVE Unified Platform is a federated barangay digital-governance platform composed of distinct systems that can support their own operational workflows while integrating through a common Dashboard, shared identity and access controls, shared master data, common audit and reporting services, and controlled APIs or event contracts.

The platform is intended to support one pilot barangay first while preserving municipality/city consolidation readiness and future authorized interoperability.

## 2. Product Structure

```text
Barangay iSERVE Unified Platform
├── Unified Dashboard and System Portal
├── Identity and Access Platform
├── Shared Master Data and Platform Services
├── iSERVE DRRM
├── iSERVE GAD
├── iSERVE Barangay Governance
└── iSERVE Citizens
```

### Unified Dashboard

The new landing page becomes the role-scoped Dashboard and system portal. It provides public information before authentication and, after authentication, displays authorized systems, tasks, alerts, approvals, compliance status and cross-system metrics.

### Identity and Access Platform

The previous landing/authentication page is preserved and repurposed as the dedicated Barangay iSERVE Identity and Access Portal. Laravel Auth provides centralized MVP identity and SSO-like behavior across the modular platform. Keycloak remains the later mature SSO direction.

### Shared Platform Services

Shared capabilities include resident and household master data, barangay profile and geographic references, authentication, roles and permissions, workflow, notifications, files, audit, reporting, search, queues/scheduler, public verification, backup and monitoring.

## 3. System Priorities

| Priority | System | Strategic Outcome |
|---|---|---|
| Platform foundation | Unified Dashboard and Identity | One controlled entry point, single sign-in experience and role-scoped system access. |
| 1 | iSERVE DRRM | Flagship barangay disaster preparedness, emergency operations and controlled reporting system. |
| 2 | iSERVE GAD | Complete barangay GAD planning, budgeting, implementation monitoring and accomplishment reporting. |
| 3 | iSERVE Barangay Governance | Core operations, assets and inventory, and phased governance subsystems. |
| 4 | iSERVE Citizens | Citizen-facing access to approved services, information, alerts, participation and verification. |

## 4. iSERVE DRRM Scope Direction

The initial DRRM system shall cover:

- canonical disaster events and operational periods;
- command and EOC context;
- early warning and preparedness;
- SitRep preparation, validation, approval and versioning;
- Damage Assessment and Needs Analysis;
- evacuation and displacement, including inside/outside evacuation centers, current/cumulative totals and sex- and age-disaggregated summaries;
- evacuation-center operations;
- resources, equipment and logistics;
- relief distribution and reconciliation;
- DRRM plans, drills, training and compliance evidence;
- approved public advisories and later narrow offline field capture.

The system must describe outputs as DROMIC-ready and must not claim direct DROMIC, OCD or national integration without verified implementation and authority.

## 5. iSERVE GAD Scope Direction

The initial GAD system shall cover:

- GAD Focal Point System organization and records;
- gender analysis and evidence;
- GAD Plan and Budget, including Annex D-1;
- budget attribution and utilization monitoring;
- PPA implementation and participant records;
- sex-disaggregated participation and indicators;
- MOV repository;
- GAD Accomplishment Report, including Annex E-1;
- approval, versioning, submission and dashboard integration;
- public GAD information and referral directories.

Restricted VAWC, BCPC, child-protection and similar case records remain outside the general GAD system until separately approved privacy, authorization and operational controls exist.

## 6. iSERVE Barangay Governance Scope Direction

Barangay Governance is an umbrella system composed of controlled subsystems:

1. Barangay Core Operations
2. Resident and Household Registry
3. Document Services
4. Collection Reference and Financial Transparency
5. Blotter and Katarungang Pambarangay
6. Legislative and Barangay Assembly Records
7. Planning, Compliance and Performance
8. Personnel and Organizational Records
9. Assets and Inventory
10. Later controlled Health, Nutrition and Community Welfare capabilities

The implemented legacy resident/household and document-service capabilities are to be preserved and mapped into the Governance system rather than rebuilt or discarded.

## 7. iSERVE Citizens Scope Direction

The Citizens system shall begin as a responsive web application or installable PWA and provide:

- citizen accounts and resident-account linking;
- service catalog and requirements;
- document requests and status tracking;
- allowed uploads and notifications;
- public DRRM alerts and evacuation information;
- public GAD information and activity registration;
- announcements, assembly schedules and public records;
- feedback, consultation and survey participation;
- narrow document verification.

Citizen access must remain purpose-limited and must not expose internal resident search, other households, restricted cases, operational DRRM details, internal assets, draft reports or administrative screens.

## 8. Shared Data and Integration Principles

- Every authoritative record has one defined owner.
- Other systems consume data through controlled service interfaces, APIs, events or approved extracts.
- Cross-system use must be purpose-limited, least-privilege and audited.
- GAD normally consumes approved aggregate or purpose-limited resident information.
- DRRM person-level data is limited to justified operational requirements.
- The Citizens system receives only public or explicitly authorized personal information.
- No system may silently duplicate and independently redefine shared master data.

## 9. Delivery Roadmap

| Wave | Delivery Package | Exit Condition |
|---|---|---|
| 0 | Program realignment and preservation | New artifact framework approved; legacy capabilities mapped; repository and boundaries controlled. |
| 1 | Dashboard, shared identity and platform shell | Users authenticate once and access only authorized systems. |
| 2 | iSERVE DRRM MVP | One disaster event can be managed from activation through reporting and closure. |
| 3 | iSERVE GAD MVP | GAD Plan and Budget and GAD Accomplishment Report can be prepared, approved and monitored. |
| 4 | Barangay Governance Core | Core administrative and citizen-service workflows are pilot-ready. |
| 5 | Assets and Inventory | Barangay property, supplies and deployable resources are controlled and auditable. |
| 6 | iSERVE Citizens MVP | Citizens can access approved services without internal-system privileges. |
| 7 | Integrated Command Dashboard | Authorized leadership receives reliable cross-system decision-support views. |
| 8 | Operational expansion | Narrow DRRM offline capture, advanced shelter/relief, expanded compliance and federation readiness. |
| 9 | Controlled future capabilities | National integrations, advanced analytics, AI, trusted records and broader federation subject to separate approval. |

## 10. Technology and Delivery Baseline

- Laravel modular monolith
- PostgreSQL
- Responsive web frontend
- Laravel Auth for MVP and early implementation
- Laravel Policies/Gates and record-level authorization
- S3-compatible object storage
- queues and scheduler
- append-oriented audit evidence
- REST/API readiness
- GitHub source control
- Codex-assisted implementation
- Render as the practical MVP deployment target
- Keycloak later
- Bolt only for optional demo and UI exploration

Distinct systems are logical bounded systems inside the modular monolith during the MVP. Separate deployments or microservices require a later controlled architecture revision supported by scale, ownership, security isolation or integration needs.

## 11. Quality and Governance Rules

The roadmap preserves privacy-by-design, least privilege, auditability, traceability, accessibility, responsive design, Philippine barangay relevance, testing, backup and recovery, controlled exports and explicit approval gates.

No implemented functionality shall be removed or changed solely for aesthetic reasons. Legacy implementation claims must remain traceable to verified repository evidence.

## 12. Version History

| Version | Date | Change | Status |
|---|---|---|---|
| v0.1 | 29 July 2026 | Initial strategic roadmap for the accepted multi-system Barangay iSERVE Unified Platform. | Draft for review and approval |
