<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. daily_journals
        Schema::create('daily_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('journal_date');
            $table->string('unit_name', 100)->default('Unit Tata Usaha & Operasional Sekolah');
            $table->text('daily_summary')->nullable();
            $table->integer('total_duration_minutes')->default(0);
            $table->enum('status', [
                'Draft',
                'Submitted',
                'Under Review',
                'Approved',
                'Revision Requested'
            ])->default('Draft');
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();

            // Satu pengguna memiliki satu header jurnal per tanggal
            $table->unique(['user_id', 'journal_date']);
        });

        // 2. journal_activities
        Schema::create('journal_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_journal_id')->constrained('daily_journals')->onDelete('cascade');
            $table->string('category', 50); // Dapodik, GTK, Peserta Didik, Rombel, Kurikulum, dll
            $table->string('activity_title');
            $table->text('description');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->text('result')->nullable();
            $table->text('obstacle')->nullable();
            $table->text('follow_up')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->enum('priority', ['Low', 'Normal', 'High', 'Urgent'])->default('Normal');
            $table->enum('status', [
                'Planned',
                'In Progress',
                'Completed',
                'Pending',
                'Blocked'
            ])->default('Completed');
            $table->string('related_module', 50)->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 3. journal_attachments
        Schema::create('journal_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_activity_id')->constrained('journal_activities')->onDelete('cascade');
            $table->string('original_name');
            $table->string('stored_path');
            $table->string('mime_type', 100);
            $table->bigInteger('file_size');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 4. journal_reviews
        Schema::create('journal_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_journal_id')->constrained('daily_journals')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->enum('action', ['Approved', 'Revision Requested', 'Commented']);
            $table->text('comments')->nullable();
            $table->timestamp('reviewed_at');
        });

        // 5. journal_revisions
        Schema::create('journal_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_journal_id')->constrained('daily_journals')->onDelete('cascade');
            $table->foreignId('modified_by')->constrained('users')->onDelete('cascade');
            $table->json('previous_values');
            $table->json('new_values');
            $table->text('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_revisions');
        Schema::dropIfExists('journal_reviews');
        Schema::dropIfExists('journal_attachments');
        Schema::dropIfExists('journal_activities');
        Schema::dropIfExists('daily_journals');
    }
};

