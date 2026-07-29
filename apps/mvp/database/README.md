# Database strategy

PostgreSQL is the formal MVP database. Global framework migrations stay in `database/migrations`; domain-owned migrations belong under the corresponding `app/Modules/<Domain>/database/migrations` directory and are loaded by `DomainModuleServiceProvider`.

`DatabaseSeeder` calls only `FoundationSeeder`. Foundation seeds must be deterministic, non-sensitive reference data. Demo fixtures, default production accounts, shared passwords, and locality-specific operational records are prohibited.

Migration changes must be forward-safe, reviewed with their owning module, and tested through `php artisan migrate:fresh --seed` before merge. Destructive production transformations require an explicit migration and rollback/recovery plan.
