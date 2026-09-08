<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AttendanceRecord;
use App\Models\LmsClass;
use App\Models\StudentLeaveApplication;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentLeaveApplicationController extends BaseController
{
    public function index(Request $request, LmsClass $lms_class, User $student_user): JsonResponse
    {
        $user = $request->user();
        $isOwn = $user->id === $student_user->id;
        $canStaffView = $user->hasAbility('view_lms_classes')
            || $user->hasAbility('manage_lms_enrollments')
            || LmsClass::userCanGradeInClass($user, $lms_class->id);

        if (!$isOwn && !$canStaffView) {
            return $this->forbidden('You do not have permission to view leave applications.');
        }

        $leaves = StudentLeaveApplication::query()
            ->where('lms_class_id', $lms_class->id)
            ->where('user_id', $student_user->id)
            ->with(['approvedBy:id,name', 'appliedBy:id,name'])
            ->orderBy('from_date', 'desc')
            ->get();

        return $this->success($leaves);
    }

    /**
     * Store / upload a physical leave application copy with date range and auto-mark attendance.
     */
    public function store(Request $request, LmsClass $lms_class, User $student_user): JsonResponse
    {
        $currentUser = $request->user();

        // Check permission (admin, teacher of class, or update_lms_classes)
        $canManage = $currentUser->hasAbility('update_lms_classes')
            || $currentUser->hasAbility('create_lms_classes')
            || $currentUser->hasAbility('mark_attendance')
            || LmsClass::userCanGradeInClass($currentUser, $lms_class->id)
            || $currentUser->id === $student_user->id;

        if (!$canManage) {
            return $this->forbidden('You do not have permission to upload student leave applications.');
        }

        $validated = $request->validate([
            'document_category' => ['nullable', 'string', 'max:50'],
            'document_title' => ['nullable', 'string', 'max:255'],
            'leave_type' => ['required', 'string', 'max:100'],
            'from_date' => 'required|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'reason' => 'required|string|max:1000',
            'document_path' => 'nullable|string|max:500',
            'document_original_name' => 'nullable|string|max:255',
            'document_mime_type' => 'nullable|string|max:100',
            'document_size' => 'nullable|integer',
            'document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf,doc,docx|max:10240', // 10MB
            'status' => ['nullable', Rule::in(['pending', 'approved', 'rejected'])],
            'auto_marked_attendance' => 'nullable|boolean',
            'admin_remarks' => 'nullable|string|max:500',
        ]);

        $fromDate = Carbon::parse($validated['from_date']);
        $toDate = !empty($validated['to_date']) ? Carbon::parse($validated['to_date']) : $fromDate;
        $totalDays = $fromDate->diffInDays($toDate) + 1;

        $documentCategory = $validated['document_category'] ?? 'leave';
        $documentTitle = $validated['document_title'] ?? null;
        $documentPath = $validated['document_path'] ?? null;
        $originalName = $validated['document_original_name'] ?? null;
        $mimeType = $validated['document_mime_type'] ?? null;
        $fileSize = $validated['document_size'] ?? null;
        $disk = 'r2';

        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();

            try {
                $r2Service = app(\App\Services\R2Service::class);
                $sanitizedFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($originalName));
                $r2Path = 'uploads/' . $currentUser->id . '/' . uniqid() . '_' . $sanitizedFileName;
                $r2Service->put($r2Path, fopen($file->getRealPath(), 'r'), $mimeType);
                $documentPath = $r2Path;
            } catch (\Throwable $e) {
                // Fallback to local storage if R2 service not initialized
                $folder = "student_documents/{$lms_class->id}/{$student_user->id}";
                $disk = 'public';
                $documentPath = $file->store($folder, 'public');
            }
        }

        $institutionId = (int) ($lms_class->institution_id ?? config('ems.default_institution_id', 1));
        $sessionId = (int) ($lms_class->session_id ?? $student_user->studentProfile?->session_id);
        $isStaff = $currentUser->hasAbility('update_lms_classes')
            || $currentUser->hasAbility('create_lms_classes')
            || $currentUser->hasAbility('mark_attendance')
            || LmsClass::userCanGradeInClass($currentUser, $lms_class->id);

        $status = $isStaff ? ($validated['status'] ?? 'approved') : 'pending';
        $autoMark = $isStaff ? filter_var($validated['auto_marked_attendance'] ?? ($documentCategory === 'leave'), FILTER_VALIDATE_BOOLEAN) : false;

        $leave = DB::transaction(function () use (
            $institutionId,
            $student_user,
            $lms_class,
            $sessionId,
            $validated,
            $documentCategory,
            $documentTitle,
            $fromDate,
            $toDate,
            $totalDays,
            $documentPath,
            $originalName,
            $mimeType,
            $fileSize,
            $disk,
            $status,
            $autoMark,
            $currentUser
        ) {
            $leaveApp = StudentLeaveApplication::create([
                'institution_id' => $institutionId,
                'user_id' => $student_user->id,
                'student_profile_id' => $student_user->studentProfile?->id,
                'lms_class_id' => $lms_class->id,
                'session_id' => $sessionId,
                'document_category' => $documentCategory,
                'document_title' => $documentTitle,
                'leave_type' => $validated['leave_type'],
                'from_date' => $fromDate->format('Y-m-d'),
                'to_date' => $toDate->format('Y-m-d'),
                'total_days' => $totalDays,
                'reason' => $validated['reason'],
                'document_path' => $documentPath,
                'document_original_name' => $originalName,
                'document_mime_type' => $mimeType,
                'document_size' => $fileSize,
                'document_disk' => $disk,
                'status' => $status,
                'auto_marked_attendance' => $autoMark,
                'applied_by' => $currentUser->id,
                'approved_by' => $status === 'approved' ? $currentUser->id : null,
                'approved_at' => $status === 'approved' ? now() : null,
                'admin_remarks' => $validated['admin_remarks'] ?? null,
            ]);

            // Auto-mark attendance records as 'leave' if requested and approved
            if ($autoMark && $status === 'approved') {
                $period = CarbonPeriod::create($fromDate, $toDate);
                foreach ($period as $date) {
                    AttendanceRecord::updateOrCreate(
                        [
                            'institution_id' => $institutionId,
                            'lms_class_id' => $lms_class->id,
                            'class_subject_allocation_id' => null,
                            'user_id' => $student_user->id,
                            'date' => $date->format('Y-m-d'),
                        ],
                        [
                            'status' => 'leave',
                            'marked_by' => $currentUser->id,
                            'remarks' => "Approved {$validated['leave_type']}: {$validated['reason']}",
                        ]
                    );
                }
            }

            return $leaveApp;
        });

        $leave->loadMissing(['approvedBy:id,name', 'appliedBy:id,name']);

        return $this->created($leave, 'Physical document uploaded and recorded successfully.');
    }

    /**
     * Update leave application status (Approve / Reject).
     */
    public function updateStatus(Request $request, StudentLeaveApplication $leave): JsonResponse
    {
        $currentUser = $request->user();
        if (!$currentUser->hasAbility('mark_attendance') && !$currentUser->hasAbility('update_lms_classes')) {
            return $this->forbidden('You do not have permission to approve/reject student leaves.');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'admin_remarks' => 'nullable|string|max:500',
            'sync_attendance' => 'nullable|boolean',
        ]);

        $newStatus = $validated['status'];
        $syncAttendance = filter_var($validated['sync_attendance'] ?? true, FILTER_VALIDATE_BOOLEAN);

        DB::transaction(function () use ($leave, $newStatus, $validated, $syncAttendance, $currentUser) {
            $leave->update([
                'status' => $newStatus,
                'admin_remarks' => $validated['admin_remarks'] ?? $leave->admin_remarks,
                'approved_by' => $newStatus === 'approved' ? $currentUser->id : $leave->approved_by,
                'approved_at' => $newStatus === 'approved' ? now() : $leave->approved_at,
            ]);

            if ($syncAttendance && $newStatus === 'approved') {
                $period = CarbonPeriod::create($leave->from_date, $leave->to_date);
                foreach ($period as $date) {
                    AttendanceRecord::updateOrCreate(
                        [
                            'institution_id' => $leave->institution_id,
                            'lms_class_id' => $leave->lms_class_id,
                            'class_subject_allocation_id' => null,
                            'user_id' => $leave->user_id,
                            'date' => $date->format('Y-m-d'),
                        ],
                        [
                            'status' => 'leave',
                            'marked_by' => $currentUser->id,
                            'remarks' => "Approved {$leave->leave_type} leave: {$leave->reason}",
                        ]
                    );
                }
            }
        });

        $leave->loadMissing(['approvedBy:id,name', 'appliedBy:id,name']);

        return $this->success($leave, "Leave request marked as {$newStatus}.");
    }

    /**
     * Delete a student leave application and associated uploaded physical document.
     */
    public function destroy(Request $request, StudentLeaveApplication $leave): JsonResponse
    {
        $currentUser = $request->user();
        if (!$currentUser->hasAbility('delete_lms_classes') && !$currentUser->hasAbility('update_lms_classes')) {
            return $this->forbidden('You do not have permission to delete leave applications.');
        }

        if (!empty($leave->document_path)) {
            $disk = $leave->document_disk ?? (!empty(config('filesystems.disks.r2.key')) ? 'r2' : (config('filesystems.default') === 'r2' ? 'r2' : 'public'));
            try {
                Storage::disk($disk)->delete($leave->document_path);
            } catch (\Throwable $e) {
                try {
                    Storage::disk('public')->delete($leave->document_path);
                } catch (\Throwable $e) {
                    // Ignore missing file errors
                }
            }
        }

        $leave->delete();

        return $this->success(null, 'Leave application deleted successfully.');
    }
}
