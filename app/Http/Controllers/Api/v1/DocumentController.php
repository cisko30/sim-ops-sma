<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $query = Document::with(['documentType', 'uploader'])
            ->where('school_id', $schoolId);

        if ($request->has('category')) {
            $cat = $request->category;
            $query->whereHas('documentType', function ($q) use ($cat) {
                $q->where('category', $cat);
            });
        }

        if ($request->has('verification_status')) {
            $query->where('verification_status', $request->verification_status);
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'owner_type' => 'required|string',
            'owner_id' => 'required|integer',
            'file' => 'required|file|max:5120|mimes:pdf,jpg,png,docx',
        ]);

        $docType = DocumentType::findOrFail($request->document_type_id);
        $file = $request->file('file');

        $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('private/documents', $storedName, 'local');
        $checksum = hash_file('sha256', $file->getRealPath());

        $document = Document::create([
            'school_id' => $request->user()->school_id ?? 1,
            'document_type_id' => $docType->id,
            'owner_type' => $request->owner_type,
            'owner_id' => $request->owner_id,
            'original_name' => $file->getClientOriginalName(),
            'stored_name' => $storedName,
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'checksum' => $checksum,
            'verification_status' => 'Belum Diverifikasi',
            'uploaded_by' => $request->user()->id,
        ]);

        ActivityLog::log('UPLOAD', 'ARSIP', Document::class, $document->id);

        return response()->json([
            'message' => 'Dokumen berhasil diunggah ke penyimpanan arsip privat.',
            'document' => $document,
        ], 201);
    }

    public function signedDownloadUrl(int $id)
    {
        $document = Document::findOrFail($id);

        // Signed URL with 15 minutes expiration
        $temporaryUrl = URL::temporarySignedRoute(
            'documents.download',
            now()->addMinutes(15),
            ['id' => $document->id]
        );

        ActivityLog::log('DOWNLOAD', 'ARSIP', Document::class, $document->id);

        return response()->json([
            'download_url' => $temporaryUrl,
            'expires_in_minutes' => 15,
            'filename' => $document->original_name,
        ]);
    }

    public function verify(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:Valid,Ditolak,Perlu Perbaikan',
            'notes' => 'nullable|string',
        ]);

        $document = Document::findOrFail($id);
        $document->update([
            'verification_status' => $request->status,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
            'verification_notes' => $request->notes,
        ]);

        ActivityLog::log('VERIFY', 'ARSIP', Document::class, $document->id, null, [
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Status verifikasi berkas berhasil diperbarui.',
            'document' => $document,
        ]);
    }
}

