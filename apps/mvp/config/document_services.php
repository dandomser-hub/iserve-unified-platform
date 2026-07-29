<?php

return [
    'request_statuses' => [
        'draft',
        'submitted',
        'requirements_checked',
        'fee_referenced',
        'approved',
        'generated',
        'released',
        'returned',
        'voided',
    ],
    'requirement_statuses' => ['verified', 'not_applicable'],
    'template_statuses' => ['draft', 'published', 'retired'],
    'exemption_codes' => [
        'indigent',
        'senior_citizen',
        'pwd',
        'official_barangay_use',
        'other_approved',
    ],
    'pdf_disk' => env('DOCUMENT_PDF_DISK', 'local'),
    'verification_path' => '/api/v1/document-services/verify',
];
