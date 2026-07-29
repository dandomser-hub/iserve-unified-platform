import { access, readFile } from 'node:fs/promises';
import process from 'node:process';

const root = 'apps/mvp';
const requiredFiles = [
  'artisan',
  'composer.json',
  '.env.example',
  'bootstrap/app.php',
  'bootstrap/providers.php',
  'config/modules.php',
  'routes/api.php',
  'app/Providers/DomainModuleServiceProvider.php',
  'database/seeders/FoundationSeeder.php',
  'tests/Feature/HealthEndpointTest.php',
  'tests/Unit/ModuleBoundaryTest.php',
  'config/authorization.php',
  'app/Http/Middleware/RequirePermission.php',
  'app/Services/AuthorizationAudit.php',
  'app/Services/RecordScope.php',
  'app/Services/RoleAssignmentService.php',
  'app/Services/ScopedAuthorization.php',
  'database/seeders/AuthorizationSeeder.php',
  'tests/Feature/AuthenticationTest.php',
  'tests/Feature/BackendAuthorizationTest.php',
  'tests/Unit/RecordScopeTest.php',
  'tests/Unit/RoleAssignmentServiceTest.php',
  'config/resident_household.php',
  'app/Modules/ResidentHousehold/Models/Resident.php',
  'app/Modules/ResidentHousehold/Models/Household.php',
  'app/Modules/ResidentHousehold/Services/PurposeLimitedResidentLookup.php',
  'app/Modules/ResidentHousehold/Services/DuplicateCandidateDetector.php',
  'app/Modules/ResidentHousehold/routes/api.php',
  'tests/Feature/ResidentHouseholdMasterDataTest.php',
  'config/document_services.php',
  'app/Modules/DocumentServices/Models/DocumentRequest.php',
  'app/Modules/DocumentServices/Models/DocumentTemplateVersion.php',
  'app/Modules/DocumentServices/Services/DocumentWorkflow.php',
  'app/Modules/DocumentServices/Services/PrivatePdfGenerator.php',
  'app/Modules/DocumentServices/routes/api.php',
  'app/Modules/DocumentServices/routes/public.php',
  'tests/Feature/DocumentServiceWorkflowTest.php',
];

const moduleDirectories = [
  'ResidentHousehold',
  'DocumentServices',
  'CaseIncidentProtection',
  'Drrm',
  'Gad',
  'GovernanceReporting',
  'AdministrationSecurity',
  'ReferenceData',
];

const failures = [];

for (const path of requiredFiles) {
  try {
    await access(`${root}/${path}`);
  } catch {
    failures.push(`Missing Laravel foundation file: ${path}`);
  }
}

for (const directory of moduleDirectories) {
  try {
    await access(`${root}/app/Modules/${directory}`);
  } catch {
    failures.push(`Missing domain module directory: ${directory}`);
  }
}

const composer = JSON.parse(await readFile(`${root}/composer.json`, 'utf8'));
if (composer.require?.php !== '^8.3') {
  failures.push('Laravel foundation must require PHP ^8.3.');
}
if (!composer.require?.['laravel/framework']?.startsWith('^13.')) {
  failures.push('Laravel foundation must use Laravel 13.');
}

const env = await readFile(`${root}/.env.example`, 'utf8');
for (const setting of [
  'APP_NAME="Barangay iSERVE"',
  'APP_TIMEZONE=Asia/Manila',
  'DB_CONNECTION=pgsql',
  'DB_PORT=5432',
]) {
  if (!env.includes(setting)) failures.push(`Missing environment baseline: ${setting}`);
}

const bootstrap = await readFile(`${root}/bootstrap/app.php`, 'utf8');
if (!bootstrap.includes("apiPrefix: 'api/v1'")) {
  failures.push('Versioned API prefix is not configured.');
}
if (!bootstrap.includes("health: '/up'")) {
  failures.push('Laravel boot health route is not configured.');
}

const api = await readFile(`${root}/routes/api.php`, 'utf8');
if (!api.includes("Route::get('/health'")) {
  failures.push('Versioned JSON health endpoint is missing.');
}

const seed = await readFile(`${root}/database/seeders/DatabaseSeeder.php`, 'utf8');
if (!seed.includes('FoundationSeeder::class')) {
  failures.push('DatabaseSeeder does not use the controlled foundation seed strategy.');
}
if (!seed.includes('AuthorizationSeeder::class')) {
  failures.push('DatabaseSeeder does not seed the approved authorization matrix.');
}
if (seed.includes('test@example.com')) {
  failures.push('Default demo credentials must not be seeded.');
}

const authorization = await readFile(`${root}/config/authorization.php`, 'utf8');
for (const requiredControl of [
  "'system_administrator'",
  "'punong_barangay'",
  "'municipal_reviewer'",
  "'administration.audit.view'",
  "'document.approve'",
  "'drrm.approve'",
  "'report.export'",
  "'resident.lookup'",
  "'resident.reference.view'",
  "'resident.reference.manage'",
  "'resident.status.manage'",
  "'resident.duplicate.review'",
  "'resident.privacy.record'",
  "'document.template.manage'",
  "'document.requirements.check'",
  "'document.fee.reference'",
  "'document.release'",
  "'document.reprint'",
  "'document.void'",
]) {
  if (!authorization.includes(requiredControl)) {
    failures.push(`Authorization matrix is missing: ${requiredControl}`);
  }
}

const residentRoutes = await readFile(
  `${root}/app/Modules/ResidentHousehold/routes/api.php`,
  'utf8',
);
for (const requiredRouteControl of [
  "middleware('permission:resident.lookup')",
  "middleware('permission:resident.reference.view')",
  "middleware('permission:resident.reference.manage')",
  "middleware('permission:resident.create')",
  "middleware('permission:resident.update')",
  "middleware('permission:resident.status.manage')",
  "middleware('permission:resident.duplicate.review')",
  "middleware('permission:resident.privacy.record')",
]) {
  if (!residentRoutes.includes(requiredRouteControl)) {
    failures.push(`Resident/household routes are missing control: ${requiredRouteControl}`);
  }
}

const residentMigration = await readFile(
  `${root}/app/Modules/ResidentHousehold/database/migrations/2026_07_28_000002_create_resident_household_tables.php`,
  'utf8',
);
for (const requiredTable of [
  "'residents'",
  "'households'",
  "'household_memberships'",
  "'resident_status_histories'",
  "'resident_duplicate_candidates'",
  "'privacy_notice_acknowledgements'",
  "'resident_lookup_events'",
]) {
  if (!residentMigration.includes(`Schema::create(${requiredTable}`)) {
    failures.push(`Resident/household migration is missing table: ${requiredTable}`);
  }
}

if (env.includes('SESSION_ENCRYPT=false')) {
  failures.push('Session encryption must not be disabled by the environment baseline.');
}

const documentRoutes = await readFile(
  `${root}/app/Modules/DocumentServices/routes/api.php`,
  'utf8',
);
for (const requiredRouteControl of [
  "middleware('permission:document.template.manage')",
  "middleware('permission:document.create')",
  "middleware('permission:document.requirements.check')",
  "middleware('permission:document.fee.reference')",
  "middleware('permission:document.approve')",
  "middleware('permission:document.export')",
  "middleware('permission:document.release')",
  "middleware('permission:document.reprint')",
  "middleware('permission:document.void')",
]) {
  if (!documentRoutes.includes(requiredRouteControl)) {
    failures.push(`Document-service routes are missing control: ${requiredRouteControl}`);
  }
}

const documentMigration = await readFile(
  `${root}/app/Modules/DocumentServices/database/migrations/2026_07_28_000003_create_document_service_tables.php`,
  'utf8',
);
for (const requiredTable of [
  "'document_templates'",
  "'document_template_versions'",
  "'document_requests'",
  "'document_workflow_events'",
  "'issued_documents'",
  "'document_release_logs'",
]) {
  if (!documentMigration.includes(`Schema::create(${requiredTable}`)) {
    failures.push(`Document-service migration is missing table: ${requiredTable}`);
  }
}

const systemAdministrator = authorization.match(
  /'system_administrator'\s*=>\s*\[(.*?)\n\s*\],/s,
)?.[1] ?? '';
for (const forbiddenApproval of [
  "'document.approve'",
  "'document.export'",
  "'document.release'",
  "'document.reprint'",
  "'document.void'",
  "'collection.certify'",
  "'case.approve'",
  "'drrm.approve'",
  "'gad.approve'",
]) {
  if (systemAdministrator.includes(forbiddenApproval)) {
    failures.push(`System Administrator must not inherit ${forbiddenApproval}.`);
  }
}

if (failures.length > 0) {
  failures.forEach(failure => console.error(`MVP foundation contract failed: ${failure}`));
  process.exit(1);
}

console.log(
  `MVP foundation contract passed: Laravel 13, PostgreSQL, API v1, health endpoints, `
  + `${moduleDirectories.length} domain boundaries, and controlled seeding are present.`,
);
