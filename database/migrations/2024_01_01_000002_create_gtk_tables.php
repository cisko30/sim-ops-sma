<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. subjects
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('subject_code', 30);
            $table->string('name');
            $table->enum('phase', ['Semua', 'Fase E', 'Fase F'])->default('Semua');
            $table->integer('standard_jtm')->default(2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['school_id', 'subject_code']);
        });

        // 2. teachers (GTK)
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('nuptk', 25)->nullable()->index();
            $table->string('nip', 30)->nullable()->index();
            $table->string('nik', 20)->nullable()->index();
            $table->string('name');
            $table->string('title_front', 20)->nullable();
            $table->string('title_back', 20)->nullable();
            $table->enum('gender', ['L', 'P']);
            $table->enum('employment_status', ['PNS', 'PPPK', 'GTT', 'Honorer', 'GTY'])->default('Honorer');
            $table->string('education', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->boolean('is_certified')->default(false);
            $table->string('nrg', 30)->nullable();
            $table->string('certification_subject_code', 30)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. certification_records
        Schema::create('certification_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->string('certification_subject_code', 30);
            $table->string('certification_number', 50)->nullable();
            $table->year('certification_year')->nullable();
            $table->enum('certification_status', ['Lulus', 'Dalam Proses', 'Antrean PPG', 'Belum Sertifikasi'])->default('Belum Sertifikasi');
            $table->enum('verification_status', ['Valid', 'Residu Data', 'Menunggu Verifikasi'])->default('Menunggu Verifikasi');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certification_records');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('subjects');
    }
};

