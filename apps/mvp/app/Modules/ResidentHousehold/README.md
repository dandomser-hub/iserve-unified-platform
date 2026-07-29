# Resident and Household Registry

Owns resident, household, address, purok/sitio, demographic, lifecycle, and
purpose-limited lookup behavior.

P1-03 controls:

- stable non-PII public identifiers and barangay-scoped registry numbers;
- dated household membership and resident lifecycle histories;
- non-destructive duplicate-candidate detection and controlled review;
- versioned privacy-notice acknowledgement, including refusal-to-sign evidence;
- declared-purpose resident/household lookup with role and geographic scope;
- hashed lookup-query evidence instead of retained raw search terms;
- record-level authorization and auditable create/update/status/review events.

Resident and household data is classified as confidential by default. No merge
review physically deletes or combines records in this package.
