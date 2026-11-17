<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. ops_events
        Schema::create('ops_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('title');
            $table->string('category', 50); // Dapodik, PIP, Kurikulum, Ujian, dll
            $table->text('description')->nullable();
            $table->date('deadline_date');
            $table->enum('priority', ['Low', 'Medium', 'High', 'Urgent'])->default('Medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['Upcoming', 'In Progress', 'Completed', 'Overdue'])->default('Upcoming');
            $table->json('reminder_settings')->nullable();
            $table->timestamps();
        });

        // 2. notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->string('type', 50)->default('info'); // info, warning, success, error
            $table->string('action_url')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        // 3. notification_delivery_logs
        Schema::create('notification_delivery_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained('notifications')->onDelete('cascade');
            $table->string('channel', 30); // in-app, email, whatsapp
            $table->enum('status', ['Sent', 'Delivered', 'Failed'])->default('Sent');
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at');
        });

        // 4. activity_logs (Audit Trail)
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action', 50); // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, IMPORT, EXPORT, APPROVE, REJECT, FINALIZE
            $table->string('module', 50); // AUTH, GTK, SISWA, KURIKULUM, DAPODIK, PIP, ARSIP, SK, JURNAL
            $table->string('record_type', 100)->nullable();
            $table->unsignedBigInteger('record_id')->nullable();
            $table->json('old_values')->nullable(); // Excludes password, token, or secrets
            $table->json('new_values')->nullable(); // Excludes password, token, or secrets
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notification_delivery_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('ops_events');
    }
};

