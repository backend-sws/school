<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AdmissionApplication;
use App\Models\Setting;
use App\Services\FinancialDocuments\AssembleStudentAdmissionSummary;
use App\Services\FinancialDocuments\FinancialPdfRenderer;
use App\Services\R2Service;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

use Illuminate\Support\Facades\Log;

class AdmissionApplicationController extends BaseController
{
    protected \App\Services\InstitutionBrandingService $brandingService;

    public function __construct(
        \App\Services\InstitutionBrandingService $brandingService,
        private AssembleStudentAdmissionSummary $assembleStudentAdmissionSummary,
        private FinancialPdfRenderer $financialPdfRenderer,
    ) {
        $this->brandingService = $brandingService;
    }

    /**
     * @OA\Get(
     * path="/student/admission/{id}/download-receipt",
     * summary="Generate and Stream Student Admission Receipt PDF",
     * description="Fetches application details including profile, addresses, and academic info to generate a professional PDF receipt with a QR code and college header.",
     * tags={"Student Admission"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Admission Application",
     * required=true,
     * @OA\Schema(type="integer", example=11)
     * ),
     * @OA\Response(
     * response=200,
     * description="PDF File Stream",
     * @OA\Header(
     * header="Content-Type",
     * @OA\Schema(type="string", example="application/pdf")
     * ),
     * @OA\Header(
     * header="Content-Disposition",
     * @OA\Schema(type="string", example="inline; filename=Admission_Receipt_#00000001.pdf")
     * ),
     * @OA\MediaType(
     * mediaType="application/pdf",
     * @OA\Schema(type="string", format="binary")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * ),
     * @OA\Response(
     * response=404,
     * description="Application not found or unauthorized access"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error (PDF generation failed or missing assets)"
     * )
     * )
     */
    public function downloadReceipt($id)
    {
        try {
            $r2Service = app(R2Service::class);

            // 1. Fetch Data with Eager Loading
            $application = AdmissionApplication::with([
                'admissionHead.majorSubject',
                'user.studentProfile',
                'user.studentProfile.addresses',
                'user.academicInfo',
                'subjects',
                'user.documents',
            ])->where('user_id', auth()->id())->findOrFail($id);

            // 2. QR Code Generation
            $qrcode = null;
            try {
                $renderer = new ImageRenderer(new RendererStyle(80), new SvgImageBackEnd());
                $writer = new Writer($renderer);
                $qrcode = base64_encode($writer->writeString(url("/verify/" . $application->application_id)));
            } catch (\Exception $e) {
                Log::error("QR Generation Failed: " . $e->getMessage());
            }

            // 3. Header Image from R2
            $headerPath = Setting::where('setting_key', 'admission-head-certificate')->value('setting_value');
            $headerBase64 = $this->fetchR2ImageBase64($headerPath, $r2Service);

            // 4. Student Photo & Signature from R2
            // Photo user table se, Signature studentProfile table se
            $studentPhoto = $this->fetchR2ImageBase64($application->user->photo_url, $r2Service);
            $studentSign = $this->fetchR2ImageBase64(optional($application->user->studentProfile)->signature_url, $r2Service);
            $userDocs = $application->user->documents;
            $docs = [
                // 'caste' => $userDocs->where('doc_type', 'caste_certificate')->first(),
                'clc' => $userDocs->where('doc_type', 'clc')->first(),
                'migration' => $userDocs->where('doc_type', 'migration')->first(),
            ];

            // 3. R2 URLs generate karein
            $docUrls = [
                // 'caste' => $docs['caste'] ? $r2Service->viewUrl($docs['caste']->doc_path) : null,
                'clc' => $docs['clc'] ? $r2Service->viewUrl($docs['clc']->doc_path) : null,
                'migration' => $docs['migration'] ? $r2Service->viewUrl($docs['migration']->doc_path) : null,
            ];

            // dd($application->user->studentProfile->addresses);
          
            // 5. Data Preparation
            $branding = $this->brandingService->resolve($application->institution_id);

            $payload = [
                'profile' => $application->user->studentProfile,
                'permAddr' => optional($application->user->studentProfile->addresses)->where('address_type', 'permanent')->first(),
                'corrAddr' => optional($application->user->studentProfile->addresses)->where('address_type', 'correspondence')->first(),
                'academic' => $application->user->academicInfo ?? collect([]),
                'selectedSubjects' => $application->subjects ?? collect([]),
                'otherCertificates' => $application->user->otherCertificates ?? collect([]),
                'photo' => $studentPhoto,
                'sign' => $studentSign,
                'qrcode' => $qrcode,
                'docUrls' => $docUrls,
            ];

            $document = $this->assembleStudentAdmissionSummary->assemble($application, $payload);

            $fileName = "Admission_Receipt_" . str_replace('#', '', $application->application_id) . ".pdf";

            return $this->financialPdfRenderer->renderDownload($document, $branding, $fileName)
                ->header('Access-Control-Expose-Headers', 'Content-Disposition');

        } catch (\Exception $e) {
            Log::error("PDF Generation Crash: " . $e->getMessage());
            return $this->error("Unable to generate receipt. Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * R2 Image Fetcher and Base64 Converter
     */
    private function fetchR2ImageBase64($path, $r2Service)
    {
        if (!$path)
            return null;

        try {
            // Agar pehle se full URL hai
            $url = filter_var($path, FILTER_VALIDATE_URL) ? $path : $r2Service->viewUrl($path);

            // Bypass SSL verification for internal Docker network if needed
            $context = stream_context_create([
                "ssl" => ["verify_peer" => false, "verify_peer_name" => false]
            ]);

            $data = file_get_contents($url, false, $context);
            if (!$data)
                return null;

            $type = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'png';
            return 'data:image/' . $type . ';base64,' . base64_encode($data);

        } catch (\Exception $e) {
            Log::error("Failed to fetch R2 Image [" . $path . "]: " . $e->getMessage());
            return null;
        }
    }
}