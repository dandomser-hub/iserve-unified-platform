# Barangay Document Services

Owns common-document intake, versioned templates, requirement checks, reference-only
fees/exemptions, official approval, private PDF generation, release, reprint/void
controls, and privacy-minimized public verification.

P1-04 controls:

- A request is permanently linked to the published template version used at intake.
- Workflow transitions are explicit, transaction-locked, role-scoped, and audited.
- Fees are reference-only; this module does not receive, hold, settle, or release funds.
- PDFs are private objects and require `document.export` plus record scope to download.
- Public verification stores only a token hash and returns authenticity/status metadata,
  never resident personal details or the private PDF.
- Reprints create a new revision and supersede the earlier public token.
- Voiding preserves the issued record, reason, actor, and verification history.
