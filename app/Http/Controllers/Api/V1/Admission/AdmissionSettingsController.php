<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Models\Setting;
use App\Models\MainStream;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Exports\AdmissionDataExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\AdmissionVerificationData;
use App\Imports\AdmissionVerificationImport;
use App\Http\Controllers\Api\V1\BaseController;


/**
 * @OA\Tag(name="Admission Verification", description="APIs for Managing Admission ID Verification & Excel Database")
 */
class AdmissionSettingsController extends BaseController
{
    /**
     * Get List for Table
     */

    /**
     * @OA\Get(
     * path="/admission/verification",
     * summary="Get verification settings and stream list",
     * tags={"Admission Verification"},
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
                'is_enabled' => Setting::where('setting_key', "verification_status_stream_{$stream->id}")
                    ->value('setting_value') === '1',
                'last_uploaded_at' => Setting::where('setting_key', "last_upload_stream_{$stream->id}")
                    ->value('setting_value') ?? 'N/A',
                'is_database_attached' => AdmissionVerificationData::where('main_stream_id', $stream->id)->exists()
            ];
        });

        $globalStatus = Setting::where('setting_key', 'global_admission_id_verification')->value('setting_value') === '1';

        return $this->success([
            'global_enabled' => $globalStatus,
            'streams' => $data
        ]);
    }

    /**
     * Global Toggle
     */

    /**
     * @OA\Post(
     * path="/admission/verification/toggle-global",
     * summary="Enable or Disable global verification system",
     * tags={"Admission Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"status"},
     * @OA\Property(property="status", type="boolean", example=true)
     * )
     * ),
     * @OA\Response(response=200, description="Global status updated")
     * )
     */
    public function toggleGlobal(Request $request)
    {
        $request->validate(['status' => 'required|boolean']);

        // Update data
        Setting::updateOrCreate(
            ['setting_key' => 'global_admission_id_verification'],
            ['setting_value' => $request->status ? '1' : '0', 'setting_group' => 'admission']
        );
        return $this->success(null, 'Global verification status updated');
    }

    /**
     * Stream Toggle
     */

    /**
     * @OA\Post(
     * path="/admission/verification/toggle-stream/{streamId}",
     * summary="Enable or Disable verification for a specific stream",
     * tags={"Admission Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="streamId", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"status"},
     * @OA\Property(property="status", type="boolean", example=true)
     * )
     * ),
     * @OA\Response(response=200, description="Stream status updated")
     * )
     */
    public function toggleStream(Request $request, $streamId)
    {
        $request->validate(['status' => 'required|boolean']);
        Setting::updateOrCreate(
            ['setting_key' => "verification_status_stream_{$streamId}"],
            ['setting_value' => $request->status ? '1' : '0', 'setting_group' => 'admission_streams']
        );
        return $this->success(null, 'Stream verification status updated');
    }

    /**
     * Excel Upload (Chunks of 15)
     */

    /**
     * @OA\Post(
     * path="/admission/verification/upload/{streamId}",
     * summary="Upload student database Excel for verification (Chunks of 15)",
     * tags={"Admission Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="streamId", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\MediaType(
     * mediaType="multipart/form-data",
     * @OA\Schema(
     * @OA\Property(property="file", type="string", format="binary", description="Excel file (xlsx, csv)")
     * )
     * )
     * ),
     * @OA\Response(response=200, description="Excel imported successfully")
     * )
     */
    public function uploadExcel(Request $request, $streamId)
    {
        $request->validate(['file' => 'required|mimes:xlsx,csv,xls']);

        DB::transaction(function () use ($request, $streamId) {
            // Delete old data
            AdmissionVerificationData::where('main_stream_id', $streamId)->delete();

            $institutionId = MainStream::where('id', $streamId)->value('institution_id');

            // Insert new data
            Excel::import(new AdmissionVerificationImport($streamId, $institutionId), $request->file('file'));

            // Update Last Uploaded Info
            Setting::updateOrCreate(
                ['setting_key' => "last_upload_stream_{$streamId}"],
                ['setting_value' => now()->format('M d, Y H:i A'), 'setting_group' => 'admission_streams']
            );
        });

        return $this->success(null, 'Admission database uploaded successfully');
    }


    /**
     * Export by Stream
     */
/**
     * @OA\Get(
     * path="/admission/verification/export-stream",
     * summary="Export admission data for a specific stream",
     * tags={"Admission Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="main_stream_id",
     * in="query",
     * required=true,
     * description="ID of the Main Stream (BA, BSc, etc.)",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200, 
     * description="Excel file download",
     * @OA\Header(header="Content-Disposition", @OA\Schema(type="string", example="attachment; filename=export.xlsx"))
     * ),
     * @OA\Response(response=422, description="Validation Error")
     * )
     */


    public function exportByStream(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'main_stream_id' => 'required'
        ]);

        $fileName = 'admission_export_stream_' . $request->main_stream_id . '.xlsx';

        return Excel::download(
            new AdmissionDataExport($request->main_stream_id),
            $fileName
        );
    }

    /**
     * Sample Download
     */

    /**
     * @OA\Get(
     * path="/admission/verification/download-sample",
     * summary="Download sample Excel file with admission_id and student_name headers",
     * tags={"Admission Verification"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="File download",
     * @OA\Header(header="Content-Type", @OA\Schema(type="string", example="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
     * )
     * )
     */
    public function downloadSample()
    {
        $headers = [
            [
                'AppNo',
                'CandidateName',
                'Vert',
                'Gender',
                'DOB',
                'FatherName',
                'MobileNo',
                'EmailID'
            ]
        ];
        return Excel::download(
            new class ($headers) implements \Maatwebsite\Excel\Concerns\FromArray {
            protected $data;
            public function __construct($data)
            {
                $this->data = $data;
            }
            public function array(): array
            {
                return $this->data;
            }
            },
            'sample_admission_id_verification.xlsx'
        );
    }
}
