<?php

return [
    'resident_statuses' => [
        'active',
        'inactive',
        'transferred_in',
        'transferred_out',
        'deceased',
    ],
    'resident_status_transitions' => [
        'active' => ['inactive', 'transferred_out', 'deceased'],
        'inactive' => ['active', 'transferred_out', 'deceased'],
        'transferred_in' => ['active', 'inactive', 'transferred_out', 'deceased'],
        'transferred_out' => ['transferred_in', 'deceased'],
        'deceased' => [],
    ],
    'household_statuses' => [
        'active',
        'inactive',
        'relocated',
        'dissolved',
    ],
    'lookup_purposes' => [
        'resident_service' => [
            'barangay_secretary',
            'punong_barangay',
        ],
        'drrm_preparedness' => [
            'drrm_focal',
            'punong_barangay',
        ],
        'gad_planning' => [
            'gad_focal',
            'punong_barangay',
        ],
        'case_management' => [
            'lupon_kp_user',
            'punong_barangay',
        ],
        'governance_oversight' => [
            'sangguniang_barangay',
            'punong_barangay',
        ],
        'data_quality' => [
            'barangay_secretary',
            'system_administrator',
        ],
    ],
    'privacy_acknowledgement_methods' => [
        'signed',
        'verbal',
        'digital',
        'notice_provided_refused_to_sign',
    ],
];
