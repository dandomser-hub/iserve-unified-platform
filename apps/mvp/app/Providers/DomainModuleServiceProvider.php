<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use RuntimeException;

class DomainModuleServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        foreach (config('modules.domains', []) as $key => $module) {
            $modulePath = base_path($module['path']);

            if (! is_dir($modulePath)) {
                throw new RuntimeException("Configured domain module [{$key}] is missing.");
            }

            $migrationPath = $modulePath.'/database/migrations';

            if (is_dir($migrationPath)) {
                $this->loadMigrationsFrom($migrationPath);
            }
        }
    }
}
