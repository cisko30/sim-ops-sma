<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. document_templates
        Schema::create('document_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('name', 100);
            $table->string('document_type', 50); // SK_PEMBAGIAN_TUGAS, SK_WALI_KELAS, SPTJM_PIP, SURAT_TUGAS
            $table->string('template_file');
            $table->json('variable_schema')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. sk_documents
        Schema::create('sk_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('semester_id')->nullable()->constrained('semesters')->onDelete('set null');
            $table->string('sk_number', 100);
            $table->string('title');
            $table->date('document_date');
            $table->foreignId('template_id')->nullable()->constrained('document_templates')->onDelete('set null');
            $table->json('document_snapshot_json')->nullable(); // Snapshot of teacher/JTM data at generation time
            $table->string('generated_docx_path')->nullable();
            $table->string('generated_pdf_path')->nullable();
            $table->string('qr_verification_token', 64)->nullable()->unique();
            $table->enum('status', ['Draft', 'Review Kurikulum', 'Persetujuan Kepala Sekolah', 'Final', 'Ditolak', 'Arsip'])->default('Draft');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->unique(['school_id', 'sk_number']);
        });

        // 3. sk_approvals
        Schema::create('sk_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sk_document_id')->constrained('sk_documents')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->enum('action', ['Draft', 'Submit', 'Recommend', 'Approve', 'Reject', 'Request Revision']);
            $table->text('notes')->nullable();
            $table->timestamp('acted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sk_approvals');
        Schema::dropIfExists('sk_documents');
        Schema::dropIfExists('document_templates');
    }
};

