<?php

return [
    'domains' => [
        'resident-household' => [
            'namespace' => 'App\\Modules\\ResidentHousehold',
            'path' => 'app/Modules/ResidentHousehold',
        ],
        'document-services' => [
            'namespace' => 'App\\Modules\\DocumentServices',
            'path' => 'app/Modules/DocumentServices',
        ],
        'case-incident-protection' => [
            'namespace' => 'App\\Modules\\CaseIncidentProtection',
            'path' => 'app/Modules/CaseIncidentProtection',
        ],
        'drrm' => [
            'namespace' => 'App\\Modules\\Drrm',
            'path' => 'app/Modules/Drrm',
        ],
        'gad' => [
            'namespace' => 'App\\Modules\\Gad',
            'path' => 'app/Modules/Gad',
        ],
        'governance-reporting' => [
            'namespace' => 'App\\Modules\\GovernanceReporting',
            'path' => 'app/Modules/GovernanceReporting',
        ],
        'administration-security' => [
            'namespace' => 'App\\Modules\\AdministrationSecurity',
            'path' => 'app/Modules/AdministrationSecurity',
        ],
        'reference-data' => [
            'namespace' => 'App\\Modules\\ReferenceData',
            'path' => 'app/Modules/ReferenceData',
        ],
    ],
    'shared_services' => [
        'authentication-and-authorization',
        'workflow-and-approvals',
        'audit-privacy-and-export-control',
        'reporting-notifications-and-queues',
        'integration-and-verification-adapters',
    ],
];
