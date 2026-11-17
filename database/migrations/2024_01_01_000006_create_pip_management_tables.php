<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. pip_records
        Schema::create('pip_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->year('fiscal_year'); // e.g. 2025
            $table->string('assistance_stage', 50); // Tahap 1, Tahap 2, dst.
            $table->enum('sk_type', ['SK Nominasi', 'SK Pemberian'])->default('SK Nominasi');
            $table->string('sk_number', 100)->nullable();
            $table->decimal('nominal_amount', 12, 2)->default(1800000.00);
            $table->string('bank_name', 50)->default('Bank BNI');
            $table->text('account_number_encrypted')->nullable(); // Enkripsi rekening
            $table->enum('activation_status', [
                'Belum Aktivasi',
                'Proses Surat Keterangan',
                'Sudah Aktivasi'
            ])->default('Belum Aktivasi');
            $table->enum('disbursement_status', [
                'Belum Cair',
                'Proses Bank',
                'Dana Sudah Cair',
                'Bukti Diunggah'
            ])->default('Belum Cair');
            $table->unsignedBigInteger('proof_document_id')->nullable();
            $table->timestamps();
        });

        // 2. pip_status_histories
        Schema::create('pip_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pip_record_id')->constrained('pip_records')->onDelete('cascade');
            $table->string('status_field', 50); // activation_status, disbursement_status, sk_type
            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamp('changed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pip_status_histories');
        Schema::dropIfExists('pip_records');
    }
};

