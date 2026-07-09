<?php

namespace App\Services;

use App\Models\CertificateHead;
use Illuminate\Support\Facades\DB;

class CertificateHeadService
{
    public function getAllCertificateHeads(array $filters)
    {
        return CertificateHead::query()
            ->when(isset($filters['main_stream_id']), fn($q) => $q->where('main_stream_id', $filters['main_stream_id']))
            ->when(isset($filters['stream_id']), fn($q) => $q->where('stream_id', $filters['stream_id']))
            ->when(isset($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['search']), function ($q) use ($filters) {
                $q->where('title', 'LIKE', "%{$filters['search']}%");
            })
            ->with(['mainStream:id,name', 'stream:id,name'])
            ->latest()
            ->get();
    }

    public function createCertificateHead(array $data)
    {
        return CertificateHead::create($data);
    }

    public function updateCertificateHead(int $id, array $data)
    {
        $certificateHead = CertificateHead::findOrFail($id);
        $certificateHead->update($data);
        return $certificateHead->load(['mainStream', 'stream']);
    }

    public function getCertificateHeadById(int $id)
    {
        return CertificateHead::with(['mainStream', 'stream'])->findOrFail($id);
    }

    public function toggleStatus(int $id)
    {
        $certificateHead = CertificateHead::findOrFail($id);
        $certificateHead->status = ($certificateHead->status == 1) ? 0 : 1;
        $certificateHead->save();
        return $certificateHead;
    }
}