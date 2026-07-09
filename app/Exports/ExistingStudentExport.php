<?php

namespace App\Exports;

use App\Models\StudentProfile;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

/**
 * Exports existing students in a format compatible with ExistingStudentBulkImport.
 */
class ExistingStudentExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected int $institutionId;
    protected array $filters;

    public function __construct(int $institutionId, array $filters = [])
    {
        $this->institutionId = $institutionId;
        $this->filters = $filters;
    }

    public function query()
    {
        $query = StudentProfile::withoutGlobalScopes()
            ->with([
                'user' => function ($q) {
                    $q->with([
                        'hostelAllocations' => fn($h) => $h->where('status', 'active')->with(['room.hostel', 'bed']),
                        'transportAssignments' => fn($t) => $t->with(['transportRoute', 'transportStop']),
                    ]);
                },
                'stream',
                'session',
                'currentClass'
            ])
            ->where('institution_id', $this->institutionId);

        // Academic Session
        if (!empty($this->filters['academic_session_id'])) {
            $query->where('session_id', $this->filters['academic_session_id']);
        }

        // Stream / Class
        if (!empty($this->filters['stream_id'])) {
            $query->where('stream_id', $this->filters['stream_id']);
        }

        // Search by Reg No
        if (!empty($this->filters['reg_no'])) {
            $query->where('reg_no', 'like', "%{$this->filters['reg_no']}%");
        }

        // Search by User Fields
        if (!empty($this->filters['name'])) {
            $name = strtolower($this->filters['name']);
            $query->whereHas('user', function ($q) use ($name) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$name}%"]);
            });
        }
        if (!empty($this->filters['email'])) {
            $email = strtolower($this->filters['email']);
            $query->whereHas('user', function ($q) use ($email) {
                $q->whereRaw('LOWER(email) LIKE ?', ["%{$email}%"]);
            });
        }
        if (!empty($this->filters['mobile'])) {
            $mobile = $this->filters['mobile'];
            $query->whereHas('user', function ($q) use ($mobile) {
                $q->where('mobile', 'like', "%{$mobile}%");
            });
        }

        // Email Verification Filter
        if (isset($this->filters['is_verified'])) {
            $query->whereHas('user', function ($q) {
                $this->filters['is_verified']
                    ? $q->whereNotNull('email_verified_at')
                    : $q->whereNull('email_verified_at');
            });
        }

        // Status Filter
        if (isset($this->filters['status'])) {
            $query->whereHas('user', function ($q) {
                $q->where('status', $this->filters['status']);
            });
        }

        // ABC ID Filter
        if (!empty($this->filters['abc_status'])) {
            if ($this->filters['abc_status'] === 'registered') {
                $query->whereNotNull('abc_id')->where('abc_id', '!=', '');
            } elseif ($this->filters['abc_status'] === 'not_registered') {
                $query->where(function ($q) {
                    $q->whereNull('abc_id')->orWhere('abc_id', '');
                });
            }
        }

        // Hostel Status Filter
        if (!empty($this->filters['hostel_status'])) {
            if ($this->filters['hostel_status'] === 'hostel_active') {
                $query->whereHas('user.hostelAllocations', function ($q) {
                    $q->where('status', 'active');
                });
            } elseif ($this->filters['hostel_status'] === 'no_hostel') {
                $query->whereDoesntHave('user.hostelAllocations', function ($q) {
                    $q->where('status', 'active');
                });
            }
        }

        // Transport Status Filter
        if (!empty($this->filters['transport_status'])) {
            $today = now()->toDateString();
            if ($this->filters['transport_status'] === 'transport_active') {
                $query->whereHas('user.transportAssignments', function ($q) use ($today) {
                    $q->where(fn($sub) => $sub->whereNull('effective_until')->orWhere('effective_until', '>=', $today));
                });
            } elseif ($this->filters['transport_status'] === 'no_transport') {
                $query->whereDoesntHave('user.transportAssignments', function ($q) use ($today) {
                    $q->where(fn($sub) => $sub->whereNull('effective_until')->orWhere('effective_until', '>=', $today));
                });
            }
        }

        return $query->orderBy('reg_no');
    }

    public function headings(): array
    {
        return [
            'students', 'email', 'mobile', 'gender', 'dob', 'class', 'section',
            'session_name', 'roll_no', 'father_name', 'father_mobile', 'mother_name',
            'category', 'religion', 'aadhar_no', 'address', 'city', 'state', 'pincode',
            'fee_paid_amount', 'fee_payment_mode', 'fee_for_month', 'fee_receipt_no',
            'abc_id', 'hostel_name', 'hostel_room', 'hostel_bed', 'transport_route', 
            'transport_stop', 'account_status'
        ];
    }

    public function map($student): array
    {
        // Extract active Hostel details
        $activeHostel = $student->user?->hostelAllocations->first();
        $hostelName = $activeHostel?->room?->hostel?->name ?? 'N/A';
        $hostelRoom = $activeHostel?->room?->room_number ?? 'N/A';
        $hostelBed = $activeHostel?->bed?->bed_number ?? 'N/A';

        // Extract active Transport details
        $today = now()->toDateString();
        $activeTransport = $student->user?->transportAssignments->first(function ($ta) use ($today) {
            return is_null($ta->effective_until) || $ta->effective_until->toDateString() >= $today;
        });
        $transportRoute = $activeTransport?->transportRoute?->name ?? 'N/A';
        $transportStop = $activeTransport?->transportStop?->name ?? 'N/A';

        return [
            $student->user?->name,
            $student->user?->email,
            $student->user?->mobile,
            $student->gender,
            $student->dob,
            $student->stream?->name,
            $student->currentClass?->section ?? 'A',
            $student->session?->name,
            $student->roll_no,
            $student->father_name,
            $student->father_mobile,
            $student->mother_name,
            $student->category,
            $student->religion,
            $student->aadhar_no,
            $student->address,
            $student->city,
            $student->state,
            $student->pincode,
            '', // fee_paid_amount
            '', // fee_payment_mode
            '', // fee_for_month
            '', // fee_receipt_no
            $student->abc_id ?? 'N/A',
            $hostelName,
            $hostelRoom,
            $hostelBed,
            $transportRoute,
            $transportStop,
            $student->user?->status ? 'Active' : 'Inactive',
        ];
    }
}
