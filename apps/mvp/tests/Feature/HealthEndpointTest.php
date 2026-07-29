<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    public function test_laravel_boot_health_route_is_available(): void
    {
        $this->get('/up')->assertOk();
    }

    public function test_versioned_api_health_route_is_available(): void
    {
        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertExactJson([
                'status' => 'ok',
                'service' => 'barangay-iserve-mvp',
                'api_version' => 'v1',
            ]);
    }
}
