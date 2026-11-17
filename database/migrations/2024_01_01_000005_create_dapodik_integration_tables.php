<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. import_batches
        Schema::create('import_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('data_type', 50); // GTK, SISWA, ROMBEL, PIP
            $table->string('original_filename');
            $table->string('stored_filepath')->nullable();
            $table->integer('total_rows')->default(0);
            $table->integer('successful_rows')->default(0);
            $table->integer('failed_rows')->default(0);
            $table->enum('status', ['Pending', 'Preview', 'Processing', 'Completed', 'Failed', 'RolledBack'])->default('Pending');
            $table->string('error_report_path')->nullable();
            $table->json('rollback_metadata')->nullable();
            $table->timestamps();
        });

        // 2. import_logs
        Schema::create('import_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_batch_id')->constrained('import_batches')->onDelete('cascade');
            $table->integer('row_number');
            $table->string('reference_key')->nullable(); // e.g. NISN or NUPTK
            $table->enum('status', ['Success', 'Warning', 'Failed']);
            $table->text('error_message')->nullable();
            $table->json('row_data')->nullable();
            $table->timestamps();
        });

        // 3. sync_histories
        Schema::create('sync_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('sync_type', 50); // Dapodik Local, WebService, SiPintar
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->enum('status', ['In Progress', 'Success', 'Failed', 'Partial'])->default('In Progress');
            $table->json('response_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sync_histories');
        Schema::dropIfExists('import_logs');
        Schema::dropIfExists('import_batches');
    }
};

