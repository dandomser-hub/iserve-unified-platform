<?php

namespace Tests\Unit;

use Tests\TestCase;

class ModuleBoundaryTest extends TestCase
{
    public function test_every_configured_domain_has_a_real_module_directory(): void
    {
        $domains = config('modules.domains');

        $this->assertCount(8, $domains);

        foreach ($domains as $module) {
            $this->assertDirectoryExists(base_path($module['path']));
            $this->assertStringStartsWith('App\\Modules\\', $module['namespace']);
        }
    }

    public function test_shared_services_are_explicitly_registered(): void
    {
        $this->assertSame([
            'authentication-and-authorization',
            'workflow-and-approvals',
            'audit-privacy-and-export-control',
            'reporting-notifications-and-queues',
            'integration-and-verification-adapters',
        ], config('modules.shared_services'));
    }
}
