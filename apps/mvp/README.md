# Barangay iSERVE formal MVP

This directory contains the Laravel 13/PostgreSQL implementation foundation for the formal Barangay iSERVE MVP. It was initialized from the official `laravel/laravel` 13.x skeleton at commit `7723d44910f0c6a2f065833e81156065a3be8bd1`.

## Requirements

- PHP 8.3 or newer
- Composer 2
- PostgreSQL 16 for the development and CI baseline

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan test
```

The application provides:

- Laravel boot health: `GET /up`
- versioned JSON health: `GET /api/v1/health`
- domain registry: `config/modules.php`
- migration and seed policy: `database/README.md`

The root React/Vite application remains the functional prototype and acceptance-reference model. Production domain behavior must be added here through reviewed P1 vertical slices; prototype browser state must not be presented as durable MVP data.
