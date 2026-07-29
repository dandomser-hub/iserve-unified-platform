# Barangay iSERVE

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-mzdvcnrc)

This repository contains two deliberately separated delivery layers:

- The root React/Vite application is the functional prototype and acceptance-reference model. It uses fictional demonstration data and browser-session state.
- `apps/mvp` is the formal Laravel 13/PostgreSQL modular-monolith foundation. Production capabilities will be implemented there in controlled P1 vertical slices.

The prototype does not provide production authentication, persistent storage, official government submission, accounting, or fund processing.

## Repository layout

```text
.
├── apps/mvp/          Laravel/PostgreSQL formal MVP
├── src/               React/Vite prototype
├── scripts/           Prototype and foundation contract checks
└── .github/workflows/ CI quality gates
```

## Local quality gate

Use Node.js 20 and install from the lockfile:

```bash
npm ci
npm run quality
```

The gate runs regression tests, validates prototype and MVP-foundation contracts, type-checks, creates the production build, and checks the generated JavaScript bundle.

## Formal MVP foundation

Laravel 13 requires PHP 8.3 or newer. PostgreSQL is the default application database.

```bash
cd apps/mvp
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan test
```

The foundation exposes Laravel's boot health route at `/up` and a versioned JSON health endpoint at `/api/v1/health`. Domain implementation must remain inside the registered module boundaries in `apps/mvp/config/modules.php`.

## Prototype quality targets

- Every route screen is loaded on demand; AppShell and route authorization remain in the initial entry path.
- A visible disclosure identifies fictional data, browser-session changes, and capabilities that are simulated or unavailable.
- No generated JavaScript chunk may exceed 350 KiB.
- Total generated JavaScript may not exceed 1,024 KiB.
- Pull requests and pushes to `mod-02` run the same checks in GitHub Actions.

These are prototype delivery gates, not production service-level objectives. The Laravel/PostgreSQL implementation will define production performance, security, persistence, observability, backup, and recovery targets in later P1 packages.
