<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_templates', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('code');
            $table->string('barangay_code')->index();
            $table->string('municipality_code')->index();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['barangay_code', 'code']);
        });

        Schema::create('document_template_versions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('document_template_id')->constrained('document_templates')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->string('status')->default('draft')->index();
            $table->string('title');
            $table->text('body_template');
            $table->json('required_fields');
            $table->json('requirement_codes');
            $table->decimal('fee_amount', 12, 2)->default(0);
            $table->json('exemption_codes');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->unique(['document_template_id', 'version_number']);
        });

        Schema::create('document_requests', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('request_number');
            $table->foreignId('document_template_version_id')
                ->constrained('document_template_versions')->restrictOnDelete();
            $table->foreignId('resident_id')->constrained('residents')->restrictOnDelete();
            $table->string('barangay_code')->index();
            $table->string('municipality_code')->index();
            $table->string('purpose');
            $table->json('request_data');
            $table->json('requirement_evidence')->nullable();
            $table->json('fee_reference')->nullable();
            $table->string('status')->default('draft')->index();
            $table->string('classification')->default('confidential');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['barangay_code', 'request_number']);
            $table->index(['barangay_code', 'status', 'created_at']);
        });

        Schema::create('document_workflow_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('document_request_id')->constrained('document_requests')->cascadeOnDelete();
            $table->string('action');
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['document_request_id', 'created_at']);
        });

        Schema::create('issued_documents', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('document_request_id')->constrained('document_requests')->restrictOnDelete();
            $table->string('serial_number')->unique();
            $table->unsignedInteger('revision')->default(1);
            $table->string('pdf_path');
            $table->string('pdf_checksum', 64);
            $table->string('verification_token_hash', 64)->unique();
            $table->string('status')->default('valid')->index();
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('generated_at');
            $table->foreignId('released_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('released_at')->nullable();
            $table->foreignId('voided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('voided_at')->nullable();
            $table->text('void_reason')->nullable();
            $table->timestamps();
            $table->unique(['document_request_id', 'revision']);
        });

        Schema::create('document_release_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('document_request_id')->constrained('document_requests')->cascadeOnDelete();
            $table->foreignId('issued_document_id')->nullable()->constrained('issued_documents')->nullOnDelete();
            $table->string('action');
            $table->text('reason')->nullable();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('occurred_at');
            $table->timestamps();
            $table->index(['document_request_id', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_release_logs');
        Schema::dropIfExists('issued_documents');
        Schema::dropIfExists('document_workflow_events');
        Schema::dropIfExists('document_requests');
        Schema::dropIfExists('document_template_versions');
        Schema::dropIfExists('document_templates');
    }
};
