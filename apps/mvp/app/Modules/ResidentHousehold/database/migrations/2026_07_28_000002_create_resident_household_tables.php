<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('puroks', function (Blueprint $table): void {
            $table->id();
            $table->string('barangay_code')->index();
            $table->string('municipality_code')->index();
            $table->string('code');
            $table->string('name');
            $table->string('sitio_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['barangay_code', 'code']);
        });

        Schema::create('households', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('household_number');
            $table->string('barangay_code')->index();
            $table->string('municipality_code')->index();
            $table->foreignId('purok_id')->nullable()->constrained('puroks')->nullOnDelete();
            $table->string('address_line');
            $table->string('landmark')->nullable();
            $table->string('status')->default('active')->index();
            $table->string('classification')->default('confidential');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['barangay_code', 'household_number']);
        });

        Schema::create('residents', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('resident_number');
            $table->string('barangay_code')->index();
            $table->string('municipality_code')->index();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('birth_date');
            $table->string('sex', 32);
            $table->string('civil_status', 32)->nullable();
            $table->string('mobile_number', 32)->nullable();
            $table->string('email')->nullable();
            $table->string('status')->default('active')->index();
            $table->string('classification')->default('confidential');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['barangay_code', 'resident_number']);
            $table->index(['barangay_code', 'last_name', 'first_name']);
            $table->index(['barangay_code', 'birth_date']);
        });

        Schema::create('household_memberships', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('relationship_to_head', 64);
            $table->boolean('is_household_head')->default(false);
            $table->date('started_on');
            $table->date('ended_on')->nullable();
            $table->string('change_reason')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['resident_id', 'ended_on']);
            $table->index(['household_id', 'ended_on']);
        });

        Schema::create('resident_status_histories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->date('effective_on');
            $table->string('reason');
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['resident_id', 'effective_on']);
        });

        Schema::create('resident_duplicate_candidates', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('resident_a_id')->constrained('residents')->cascadeOnDelete();
            $table->foreignId('resident_b_id')->constrained('residents')->cascadeOnDelete();
            $table->decimal('match_score', 5, 2);
            $table->json('match_signals');
            $table->string('status')->default('pending_review')->index();
            $table->foreignId('surviving_resident_id')->nullable()->constrained('residents')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();
            $table->unique(['resident_a_id', 'resident_b_id']);
        });

        Schema::create('privacy_notice_acknowledgements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->string('notice_version');
            $table->string('purpose_code');
            $table->string('acknowledgement_method', 64);
            $table->timestamp('acknowledged_at');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('withdrawn_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['resident_id', 'notice_version', 'purpose_code']);
        });

        Schema::create('resident_lookup_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('purpose_code')->index();
            $table->string('query_hash', 64);
            $table->unsignedInteger('result_count');
            $table->string('barangay_code')->nullable()->index();
            $table->string('municipality_code')->nullable()->index();
            $table->timestamps();
            $table->index(['actor_user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident_lookup_events');
        Schema::dropIfExists('privacy_notice_acknowledgements');
        Schema::dropIfExists('resident_duplicate_candidates');
        Schema::dropIfExists('resident_status_histories');
        Schema::dropIfExists('household_memberships');
        Schema::dropIfExists('residents');
        Schema::dropIfExists('households');
        Schema::dropIfExists('puroks');
    }
};
