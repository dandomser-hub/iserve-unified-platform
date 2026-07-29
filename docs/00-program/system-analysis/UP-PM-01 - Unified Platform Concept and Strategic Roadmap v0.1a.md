# Barangay iSERVE Unified Platform

## UP-PM-01 — Unified Platform Concept and Strategic Roadmap

| Document Control Item | Value |
|---|---|
| Version | v0.1a |
| Status | Approved Baseline |
| Approval date | 29 July 2026 |
| Program authority | UP-PM-00 v0.1a |
| Repository | `dandomser-hub/iserve-unified-platform` |

> **Control note:** This controlled minor revision records formal approval of the initial strategic roadmap. It introduces no substantive change to the reviewed v0.1 scope.

## 1. Strategic Vision

Barangay iSERVE Unified Platform is a federated barangay digital-governance platform composed of distinct systems that can support their own operational workflows while integrating through a common Dashboard, shared identity and access controls, shared master data, common audit and reporting services, and controlled APIs or event contracts.

The platform begins with one pilot barangay while preserving municipality/city consolidation readiness and future authorized interoperability.

## 2. Approved Product Structure

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

The new landing page is the role-scoped Dashboard and system portal. The previous landing/authentication page is preserved and repurposed as the dedicated Identity and Access Portal. Laravel Auth provides centralized MVP identity and SSO-like behavior across the modular platform; Keycloak remains the later mature SSO direction.

## 3. Approved Priorities

| Priority | System | Strategic outcome |
|---|---|---|
| Platform foundation | Unified Dashboard and Identity | One controlled entry point, single sign-in experience and role-scoped system access. |
| 1 | iSERVE DRRM | Flagship barangay disaster preparedness, emergency operations and controlled reporting system. |
| 2 | iSERVE GAD | Complete barangay GAD planning, budgeting, implementation monitoring and accomplishment reporting. |
| 3 | iSERVE Barangay Governance | Core operations, assets and inventory, and phased governance subsystems. |
| 4 | iSERVE Citizens | Citizen-facing access to approved services, information, alerts, participation and verification. |

## 4. System Scope Direction

### iSERVE DRRM

Canonical disaster events and operational periods; command/EOC context; early warning and preparedness; SitRep; DANA; evacuation and displacement; evacuation-center operations; resources, equipment and logistics; relief distribution and reconciliation; plans, drills, training and compliance evidence; approved public advisories; later narrow offline field capture.

Outputs are DROMIC-ready. No direct DROMIC, OCD or national integration is claimed without verified implementation and authority.

### iSERVE GAD

GFPS governance; gender analysis and evidence; GAD Plan and Budget including Annex D-1; budget attribution and utilization; PPA and participant monitoring; indicators and sex-disaggregated reporting; MOV repository; GAD Accomplishment Report including Annex E-1; approval, versioning, submission and dashboard integration; public GAD information and referral directories.

Restricted VAWC, BCPC, child-protection and similar case records remain outside the general GAD system until separately approved controls exist.

### iSERVE Barangay Governance

Barangay Core Operations; Resident and Household Registry; Document Services; Collection Reference and Financial Transparency; Blotter and Katarungang Pambarangay; Legislative and Barangay Assembly Records; Planning, Compliance and Performance; Personnel and Organizational Records; Assets and Inventory; later controlled Health, Nutrition and Community Welfare capabilities.

Implemented legacy resident/household and document-service capabilities are preserved and mapped into Governance rather than rebuilt or discarded.

### iSERVE Citizens

Responsive web/PWA direction covering citizen accounts and resident linking, service catalog, document requests and status tracking, permitted uploads, notifications, public DRRM alerts, public GAD information, announcements, public records, participation, feedback and narrow document verification.

Citizen access remains purpose-limited and does not expose internal resident search, other households, restricted cases, operational DRRM details, internal assets, draft reports or administrative screens.

## 5. Shared Data and Integration Principles

- Every authoritative record has one defined owner.
- Other systems consume data through controlled service interfaces, APIs, events or approved extracts.
- Cross-system use is purpose-limited, least-privilege and audited.
- GAD normally consumes approved aggregate or purpose-limited resident information.
- DRRM person-level data is limited to justified operational requirements.
- Citizens receives only public or explicitly authorized personal information.
- No system silently duplicates and independently redefines shared master data.

## 6. Approved Delivery Roadmap

| Wave | Delivery package | Exit condition |
|---|---|---|
| 0 | Program realignment and preservation | New artifact framework approved; legacy capabilities mapped; repository and boundaries controlled. |
| 1 | Dashboard, shared identity and platform shell | Users authenticate once and access only authorized systems. |
| 2 | iSERVE DRRM MVP | One disaster event can be managed from activation through reporting and closure. |
| 3 | iSERVE GAD MVP | GAD Plan and Budget and GAD Accomplishment Report can be prepared, approved and monitored. |
| 4 | Barangay Governance Core | Core administrative and citizen-service workflows are pilot-ready. |
| 5 | Assets and Inventory | Barangay property, supplies and deployable resources are controlled and auditable. |
| 6 | iSERVE Citizens MVP | Citizens can access approved services without internal-system privileges. |
| 7 | Integrated Command Dashboard | Authorized leadership receives reliable cross-system decision-support views. |
| 8+ | Controlled operational expansion | Narrow DRRM offline capture, federation, advanced analytics and later separately approved capabilities. |

## 7. Technology and Governance Baseline

Laravel modular monolith; PostgreSQL; responsive web; Laravel Auth; Policies/Gates and record-level authorization; S3-compatible storage; queues/scheduler; append-oriented audit; REST/API readiness; GitHub; Codex; Render; Keycloak later; Bolt only for optional demo/UI exploration.

Distinct systems remain logical bounded systems inside the modular monolith during the MVP. Separate deployments or microservices require a controlled architecture revision.

## 8. Version History

| Version | Date | Change | Status |
|---|---|---|---|
| v0.1 | 29 July 2026 | Initial strategic roadmap draft. | Superseded by v0.1a |
| v0.1a | 29 July 2026 | Approval/status revision; no substantive design change. | Approved Baseline |
