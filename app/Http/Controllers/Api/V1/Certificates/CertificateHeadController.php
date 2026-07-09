<?php

namespace App\Http\Controllers\Api\V1\Certificates;

use Illuminate\Http\Request;
use App\Services\CertificateHeadService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(name="Certificates", description="APIs for configuring certificates and dynamic user fields")
 */
class CertificateHeadController extends BaseController
{
    protected $certificateService;

    public function __construct(CertificateHeadService $certificateService)
    {
        $this->certificateService = $certificateService;
    }

    /**
     * @OA\Get(
     * path="/certificate-heads",
     * summary="List all Certificate Heads with filters",
     * tags={"Certificates"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Search by title"),
     * @OA\Parameter(name="main_stream_id", in="query", @OA\Schema(type="integer")),
     * @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer")),
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="integer", enum={0,1})),
     * @OA\Response(response=200, description="List of certificate configurations")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'main_stream_id', 'stream_id', 'status']);
        $data = $this->certificateService->getAllCertificateHeads($filters);
        return $this->success($data);
    }

    /**
     * @OA\Post(
     * path="/certificate-heads",
     * summary="Create a new Certificate Head with Dynamic Fields",
     * tags={"Certificates"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title", "main_stream_id", "stream_id", "fee_amount", "status"},
     * @OA\Property(property="title", type="string", example="Migration Certificate"),
     * @OA\Property(property="description", type="string", example="Request for migration to another university"),
     * @OA\Property(property="main_stream_id", type="integer", example=1),
     * @OA\Property(property="stream_id", type="integer", example=2),
     * @OA\Property(property="fee_amount", type="number", format="float", example=500.00),
     * @OA\Property(property="processing_days", type="integer", example=10),
     * @OA\Property(property="payment_processor", type="string", example="razorpay"),
     * @OA\Property(property="header_image", type="string", example="certificates/headers/img_123.jpg", description="R2 path returned from upload-url"),
     * @OA\Property(property="web_certificate_required", type="boolean", example=true),
     *  @OA\Property(property="certificate_template", type="string", example="provisional_v1", description="Slug or name of the blade template"),
     * @OA\Property(property="status", type="integer", enum={0,1}, example=1),
     * @OA\Property(
     * property="custom_fields",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="field_title", type="string", example="University Roll No"),
     * @OA\Property(property="description", type="string", example="Enter your final year roll number"),
     * @OA\Property(property="is_required", type="boolean", example=true)
     * )
     * )
     * )
     * ),
     * @OA\Response(response=201, description="Certificate Head Created Successfully")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'main_stream_id' => 'required|exists:main_streams,id',
            'stream_id' => 'required|exists:streams,id',
            'fee_amount' => 'required|numeric|min:0',
            'processing_days' => 'nullable|integer|min:1',
            'payment_processor' => 'nullable|string',
            'header_image' => 'nullable|string',
            'web_certificate_required' => 'boolean',
            'certificate_template' => 'nullable|string',
            'status' => 'required|integer|in:0,1',

            // Nested Custom Fields Validation
            'custom_fields' => 'nullable|array',
            'custom_fields.*.field_title' => 'required|string|max:100',
            'custom_fields.*.description' => 'nullable|string|max:255',
            'custom_fields.*.is_required' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $certificateHead = $this->certificateService->createCertificateHead($request->all());
        return $this->successWithMap($certificateHead, 'passthrough', 'Certificate head created successfully', 201);
    }

    /**
     * @OA\Get(
     * path="/certificate-heads/{id}",
     * summary="Get detailed information of a specific Certificate Head",
     * tags={"Certificates"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Certificate Head",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Certificate Head details retrieved successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="title", type="string", example="Migration Certificate"),
     * @OA\Property(property="custom_fields", type="array", @OA\Items(
     * @OA\Property(property="field_title", type="string"),
     * @OA\Property(property="is_required", type="boolean")
     * )),
     * @OA\Property(property="main_stream", type="object"),
     * @OA\Property(property="stream", type="object")
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Certificate Head not found")
     * )
     */
    public function show($id): JsonResponse
    {
        $certificateHead = $this->certificateService->getCertificateHeadById((int) $id);
        return $this->successWithMap($certificateHead, 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/certificate-heads/{id}",
     * summary="Update an existing Certificate Head",
     * description="Updates specific fields of a Certificate Head configuration. Only provided fields will be updated.",
     * tags={"Certificates"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Certificate Head to update",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="title", type="string", example="Updated Migration Certificate"),
     * @OA\Property(property="description", type="string", example="New description for migration request"),
     * @OA\Property(property="main_stream_id", type="integer", example=1),
     * @OA\Property(property="stream_id", type="integer", example=2),
     * @OA\Property(property="fee_amount", type="number", format="float", example=550.00),
     * @OA\Property(property="processing_days", type="integer", example=15),
     * @OA\Property(property="payment_processor", type="string", example="sabpaisa"),
     * @OA\Property(property="header_image", type="string", example="certificates/headers/new_img.jpg"),
     * @OA\Property(property="web_certificate_required", type="boolean", example=false),
     * @OA\Property(property="status", type="integer", enum={0,1}, example=1),
     * @OA\Property(
     * property="custom_fields",
     * type="array",
     * description="Full array of custom fields. Sending this will replace all existing fields for this certificate.",
     * @OA\Items(
     * @OA\Property(property="field_title", type="string", example="College Registration No"),
     * @OA\Property(property="description", type="string", example="Enter your unique college ID"),
     * @OA\Property(property="is_required", type="boolean", example=true)
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Certificate Head updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Certificate head updated successfully"),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=404, description="Certificate Head not found"),
     * @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(Request $request, $id): JsonResponse
    {
        // Strict Validation for Update
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'main_stream_id' => 'sometimes|exists:main_streams,id',
            'stream_id' => 'sometimes|exists:streams,id',
            'fee_amount' => 'sometimes|numeric|min:0',
            'processing_days' => 'sometimes|integer|min:1',
            'payment_processor' => 'nullable|string',
            'header_image' => 'nullable|string',
            'web_certificate_required' => 'sometimes|boolean',
            'status' => 'sometimes|integer|in:0,1',

            // Nested Custom Fields Validation
            'custom_fields' => 'nullable|array',
            'custom_fields.*.field_title' => 'required_with:custom_fields|string|max:100',
            'custom_fields.*.description' => 'nullable|string|max:255',
            'custom_fields.*.is_required' => 'required_with:custom_fields|boolean',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $certificateHead = $this->certificateService->updateCertificateHead($id, $request->all());

        return $this->successWithMap($certificateHead, 'passthrough', 'Certificate head updated successfully');
    }

    /**
     * @OA\Patch(
     * path="/certificate-heads/{id}/toggle-status",
     * summary="Toggle the active status of a certificate",
     * tags={"Certificates"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Status Toggled")
     * )
     */
    public function toggleStatus($id): JsonResponse
    {
        $result = $this->certificateService->toggleStatus($id);
        return $this->success($result, 'Status updated successfully');
    }
}