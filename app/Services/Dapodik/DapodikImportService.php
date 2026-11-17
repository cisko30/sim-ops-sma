<?php

namespace App\Services\Dapodik;

use App\Models\ImportBatch;
use App\Models\ImportLog;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DapodikImportService
{
    /**
     * Preview dan validasi awal file Excel sebelum disimpan ke database
     */
    public function previewImport(array $rows, string $dataType, int $schoolId, int $userId, string $filename): array
    {
        $batch = ImportBatch::create([
            'school_id' => $schoolId,
            'user_id' => $userId,
            'data_type' => $dataType,
            'original_filename' => $filename,
            'total_rows' => count($rows),
            'status' => 'Preview',
        ]);

        $validRows = [];
        $invalidRows = [];
        $duplicates = [];

        foreach ($rows as $index => $row) {
            $rowNum = $index + 2; // Mengabaikan header Excel
            $errors = [];

            if ($dataType === 'SISWA') {
                $nisn = $row['nisn'] ?? null;
                $name = $row['nama'] ?? null;

                if (empty($name)) {
                    $errors[] = 'Kolom Nama Siswa wajib diisi.';
                }

                if ($nisn && Student::where('school_id', $schoolId)->where('nisn', $nisn)->exists()) {
                    $duplicates[] = [
                        'row' => $rowNum,
                        'key' => $nisn,
                        'name' => $name,
                        'reason' => 'NISN sudah terdaftar di database lokal.',
                    ];
                }
            } elseif ($dataType === 'GTK') {
                $nuptk = $row['nuptk'] ?? null;
                $name = $row['nama'] ?? null;

                if (empty($name)) {
                    $errors[] = 'Kolom Nama Guru wajib diisi.';
                }

                if ($nuptk && Teacher::where('school_id', $schoolId)->where('nuptk', $nuptk)->exists()) {
                    $duplicates[] = [
                        'row' => $rowNum,
                        'key' => $nuptk,
                        'name' => $name,
                        'reason' => 'NUPTK sudah terdaftar di database.',
                    ];
                }
            }

            if (!empty($errors)) {
                $invalidRows[] = [
                    'row' => $rowNum,
                    'data' => $row,
                    'errors' => $errors,
                ];
            } else {
                $validRows[] = [
                    'row' => $rowNum,
                    'data' => $row,
                ];
            }
        }

        return [
            'batch_id' => $batch->id,
            'total_rows' => count($rows),
            'valid_count' => count($validRows),
            'invalid_count' => count($invalidRows),
            'duplicate_count' => count($duplicates),
            'duplicates' => $duplicates,
            'invalid_rows' => $invalidRows,
            'preview_samples' => array_slice($validRows, 0, 5),
        ];
    }

    /**
     * Memproses import data secara batch menggunakan transaksi database
     */
    public function commitImport(int $batchId, array $validData): array
    {
        $batch = ImportBatch::findOrFail($batchId);
        $batch->update(['status' => 'Processing']);

        $insertedIds = [];
        $failedCount = 0;

        DB::beginTransaction();
        try {
            foreach ($validData as $item) {
                $row = $item['data'];
                $rowNum = $item['row'];

                try {
                    if ($batch->data_type === 'SISWA') {
                        $student = Student::updateOrCreate(
                            [
                                'school_id' => $batch->school_id,
                                'nisn' => $row['nisn'] ?? null,
                            ],
                            [
                                'nik' => $row['nik'] ?? null,
                                'no_kk' => $row['no_kk'] ?? null,
                                'name' => $row['nama'],
                                'gender' => strtoupper($row['jk'] ?? 'L') === 'P' ? 'P' : 'L',
                                'birth_place' => $row['tempat_lahir'] ?? null,
                                'birth_date' => !empty($row['tanggal_lahir']) ? date('Y-m-d', strtotime($row['tanggal_lahir'])) : null,
                                'parent_name' => $row['nama_ibu_kandung'] ?? ($row['nama_ayah'] ?? null),
                                'kip_status' => !empty($row['nomor_kip']),
                                'kip_number' => $row['nomor_kip'] ?? null,
                                'is_active' => true,
                            ]
                        );
                        $insertedIds[] = $student->id;
                    }

                    ImportLog::create([
                        'import_batch_id' => $batch->id,
                        'row_number' => $rowNum,
                        'reference_key' => $row['nisn'] ?? ($row['nuptk'] ?? null),
                        'status' => 'Success',
                    ]);
                } catch (\Exception $e) {
                    $failedCount++;
                    ImportLog::create([
                        'import_batch_id' => $batch->id,
                        'row_number' => $rowNum,
                        'reference_key' => $row['nisn'] ?? null,
                        'status' => 'Failed',
                        'error_message' => $e->getMessage(),
                    ]);
                }
            }

            $batch->update([
                'status' => 'Completed',
                'successful_rows' => count($insertedIds),
                'failed_rows' => $failedCount,
                'rollback_metadata' => ['inserted_ids' => $insertedIds],
            ]);

            DB::commit();

            ActivityLog::log('IMPORT', 'DAPODIK', ImportBatch::class, $batch->id, null, [
                'type' => $batch->data_type,
                'imported_count' => count($insertedIds),
            ]);

            return [
                'status' => 'Success',
                'batch_id' => $batch->id,
                'imported_count' => count($insertedIds),
                'failed_count' => $failedCount,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            $batch->update(['status' => 'Failed']);
            throw $e;
        }
    }

    /**
     * Rollback terkontrol untuk membatalkan import
     */
    public function rollbackImport(int $batchId): bool
    {
        $batch = ImportBatch::findOrFail($batchId);

        if ($batch->status !== 'Completed') {
            return false;
        }

        $insertedIds = $batch->rollback_metadata['inserted_ids'] ?? [];

        DB::beginTransaction();
        try {
            if ($batch->data_type === 'SISWA') {
                Student::whereIn('id', $insertedIds)->delete();
            } elseif ($batch->data_type === 'GTK') {
                Teacher::whereIn('id', $insertedIds)->delete();
            }

            $batch->update(['status' => 'RolledBack']);
            DB::commit();

            ActivityLog::log('ROLLBACK', 'DAPODIK', ImportBatch::class, $batch->id);
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
}

