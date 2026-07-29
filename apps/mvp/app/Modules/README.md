# Domain module boundaries

Each directory represents a logical business domain in the approved Laravel modular monolith. Domain code owns its models, application services, policies, routes, migrations, and tests. Cross-domain work must use explicit contracts or shared services; modules must not query another domain's tables as an informal integration shortcut.

The registered domains are:

- `ResidentHousehold`
- `DocumentServices`
- `CaseIncidentProtection`
- `Drrm`
- `Gad`
- `GovernanceReporting`
- `AdministrationSecurity`
- `ReferenceData`

Shared authentication/authorization, workflow, audit/privacy/export, reporting/notification/queue, and integration/verification concerns remain cross-cutting services. System administration never implies unrestricted access to sensitive case or protection records.
