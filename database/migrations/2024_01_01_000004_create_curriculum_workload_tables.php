<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. classrooms
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->tinyInteger('grade_level'); // 10, 11, 12
            $table->enum('phase', ['Fase E', 'Fase F'])->default('Fase E');
            $table->string('name', 50); // e.g. X-A, XI-MIPA 1, XII-IPS 2
            $table->string('specialization', 50)->default('Umum'); // Umum, MIPA, IPS, Bahasa
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->integer('student_capacity')->default(36);
            $table->timestamps();

            $table->unique(['school_id', 'academic_year_id', 'name']);
        });

        // 2. classroom_students
        Schema::create('classroom_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_id')->constrained('classrooms')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->date('assigned_at')->nullable();
            $table->timestamps();

            // Prevent duplicate assignment in same academic year
            $table->unique(['student_id', 'academic_year_id']);
        });

        // 3. workload_assignments (JTM Reguler)
        Schema::create('workload_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('classroom_id')->constrained('classrooms')->onDelete('cascade');
            $table->integer('weekly_jtm')->default(2);
            $table->boolean('is_linear')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 4. additional_duties (Ekuivalensi JTM)
        Schema::create('additional_duties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            $table->string('duty_type', 100); // e.g. Kepala Perpustakaan, Kepala Lab, Pembina OSIS, Wali Kelas
            $table->integer('equivalency_jtm')->default(12);
            $table->string('sk_reference', 100)->nullable();
            $table->date('effective_from')->nullable();
            $table->date('effective_until')->nullable();
            $table->timestamps();
        });

        // 5. regulatory_rules (Peraturan Beban JTM, Rombel, Kapasitas)
        Schema::create('regulatory_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->string('rule_category', 50); // JTM, ROMBEL, SERTIFIKASI
            $table->string('rule_name', 100);
            $table->string('rule_value'); // e.g. 24, 36
            $table->date('effective_from')->nullable();
            $table->date('effective_until')->nullable();
            $table->string('reference_document')->nullable(); // e.g. Permendikbudristek No. XX
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regulatory_rules');
        Schema::dropIfExists('additional_duties');
        Schema::dropIfExists('workload_assignments');
        Schema::dropIfExists('classroom_students');
        Schema::dropIfExists('classrooms');
    }
};

