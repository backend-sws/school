<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Models\Setting;
use App\Models\MainStream;
use Illuminate\Http\Request;
use App\Exports\StudentDataExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\StudentVerificationData;
use App\Exports\StudentVerificationExport;
use App\Imports\StudentVerificationImport;
use App\Http\Controllers\Api\V1\BaseController;

class StudentVerificationController extends BaseController
{
    /**
     * @OA\Get(
     * path="/student/verification",
     * summary="Get student verification settings and stream list",
     * tags={"Student Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index(Request $request)
    {
        $streams = MainStream::all();

        $data = $streams->map(function ($stream) {
            return [
                'main_stream_id' => $stream->id,
                'main_stream_name' => $stream->name,
                'is_enabled' => Setting::where('setting_key', "student_verification_status_stream_{$stream->id}")
                    ->value('setting_value') === '1',
                'last_uploaded_at' => Setting::where('setting_key', "last_student_upload_stream_{$stream->id}")
                    ->value('setting_value') ?? 'N/A',
                'is_database_attached' => StudentVerificationData::where('main_stream_id', $stream->id)->exists()
            ];
        });

        $globalStatus = Setting::where('setting_key', 'global_student_verification')->value('setting_value') === '1';

        return $this->success([
            'global_enabled' => $globalStatus,
            'streams' => $data
        ]);
    }

    /**
     * @OA\Post(
     * path="/student/verification/toggle-global",
     * summary="Enable or Disable global student verification",
     * tags={"Student Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="status", type="boolean"))),
     * @OA\Response(response=200, description="Global status updated")
     * )
     */
    public function toggleGlobal(Request $request)
    {
        $request->validate(['status' => 'required|boolean']);
        
        Setting::updateOrCreate(
            ['setting_key' => 'global_student_verification'],
            ['setting_value' => $request->status ? '1' : '0', 'setting_group' => 'student_admission']
        );
        return $this->success(null, 'Global student verification status updated');
    }

    /**
     * @OA\Post(
     * path="/student/verification/toggle-stream/{streamId}",
     * summary="Enable/Disable verification for a specific stream",
     * tags={"Student Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="streamId", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="status", type="boolean"))),
     * @OA\Response(response=200, description="Stream status updated")
     * )
     */
    public function toggleStream(Request $request, $streamId)
    {
        $request->validate(['status' => 'required|boolean']);
        Setting::updateOrCreate(
            ['setting_key' => "student_verification_status_stream_{$streamId}"],
            ['setting_value' => $request->status ? '1' : '0', 'setting_group' => 'student_admission_streams']
        );
        return $this->success(null, 'Stream verification status updated');
    }

    /**
     * @OA\Post(
     * path="/student/verification/upload/{streamId}",
     * summary="Upload student database Excel (Registration No & Name)",
     * tags={"Student Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="streamId", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(@OA\Property(property="file", type="string", format="binary")))),
     * @OA\Response(response=200, description="Excel imported successfully")
     * )
     */
    public function upload(Request $request, $streamId)
    {
        $request->validate(['file' => 'required|mimes:xlsx,csv,xls']);
        $collegeId = MainStream::where('id', $streamId)->value('institution_id');

        // dd($collegeId, $streamId);
        DB::transaction(function () use ($request, $streamId, $collegeId) {
          //  Delete old data
            StudentVerificationData::where('main_stream_id', $streamId)->delete();

            // Import logic (Batch size 15 handles within the Import class)
            Excel::import(new StudentVerificationImport($streamId, $collegeId), $request->file('file'));

            // Update Last Uploaded Info
            Setting::updateOrCreate(
                ['setting_key' => "last_student_upload_stream_{$streamId}"],
                ['setting_value' => now()->format('M d, Y H:i A'), 'setting_group' => 'student_admission_streams']
            );
        });

        return $this->success(null, 'Student verification database uploaded successfully');
    }

    /**
     * @OA\Get(
     * path="/student/verification/download-sample",
     * summary="Download sample Excel with registration_no header",
     * tags={"Student Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="File download")
     * )
     */
    public function downloadSample()
    {
        $headers = [['RegistrationNo', 'StudentName']];
        return Excel::download(new class($headers) implements \Maatwebsite\Excel\Concerns\FromArray {
            protected $data;
            public function __construct($data) { $this->data = $data; }
            public function array(): array { return $this->data; }
        }, 'sample_student_registration.xlsx');
    }


    /**
     * @OA\Get(
     * path="/student/verification/export-stream",
     * summary="Export student verification data for a specific stream",
     * tags={"Student Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="main_stream_id", in="query", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="File download")
     * )
     */
    public function exportByStream(Request $request)
    {
        $request->validate([
            'main_stream_id' => 'required'
        ]);

        $fileName = 'student_verification_export_stream_' . $request->main_stream_id . '.xlsx';

        return Excel::download(
            new StudentDataExport($request->main_stream_id),
            $fileName
        );
    }
}