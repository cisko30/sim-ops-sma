<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. document_types
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('category', 50); // GTK, Siswa, Sekolah, PIP, Kurikulum
            $table->string('allowed_extensions', 100)->default('pdf,jpg,png,docx');
            $table->integer('max_file_size_kb')->default(5120); // 5 MB default
            $table->boolean('is_mandatory')->default(false);
            $table->timestamps();
        });

        // 2. documents
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('document_type_id')->constrained('document_types')->onDelete('cascade');
            $table->string('owner_type', 100); // App\Models\Student, App\Models\Teacher, App\Models\School
            $table->unsignedBigInteger('owner_id')->index();
            $table->string('original_name');
            $table->string('stored_name');
            $table->string('file_path');
            $table->string('mime_type', 100);
            $table->bigInteger('file_size');
            $table->string('checksum', 64)->nullable(); // SHA-256
            $table->enum('verification_status', ['Belum Diverifikasi', 'Valid', 'Ditolak', 'Perlu Perbaikan'])->default('Belum Diverifikasi');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            $table->timestamps();
        });

        // 3. document_versions
        Schema::create('document_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->string('file_path');
            $table->integer('version_number')->default(1);
            $table->string('checksum', 64)->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_versions');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('document_types');
    }
};

