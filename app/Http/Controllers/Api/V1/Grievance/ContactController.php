<?php

namespace App\Http\Controllers\Api\V1\Grievance;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;

/**
 * @OA\Schema(
 * schema="ContactSubmission",
 * @OA\Property(property="id", type="integer"),
 * @OA\Property(property="institution_id", type="integer", nullable=true),
 * @OA\Property(property="name", type="string"),
 * @OA\Property(property="email", type="string"),
 * @OA\Property(property="mobile", type="string"),
 * @OA\Property(property="subject", type="string"),
 * @OA\Property(property="message", type="string"),
 * @OA\Property(property="status", type="string", example="new")
 * )
 */
class ContactController extends BaseController
{
    /**
     * @OA\Get(
     * path="/contacts",
     * summary="List contact submissions (Admin)",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="string", enum={"new", "read"}), description="Filter by status"),
     * @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Search by name, email, or mobile"),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     * @OA\Response(response=200, description="List of contact submissions")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::query()
            // Status Filter
            ->when($request->filled('status'), function ($q) use ($request) {
                return $q->where('status', $request->status);
            })
            // Multi-column Case-Insensitive Search
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = strtolower($request->search);
                return $q->where(function ($subQuery) use ($search) {
                    $subQuery->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"])
                        ->orWhere('mobile', 'LIKE', "%{$search}%");
                });
            })
            ->latest();

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/public/contact",
     * summary="Submit contact form (Public)",
     * tags={"Grievances"},
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * required={"name", "message"},
     * @OA\Property(property="institution_id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="Ankit Kumar"),
     * @OA\Property(property="email", type="string", format="email", example="ankit@example.com"),
     * @OA\Property(property="mobile", type="string", example="9876543210"),
     * @OA\Property(property="subject", type="string", example="Admission Query"),
     * @OA\Property(property="message", type="string", example="I want to know about BA admission.")
     * )),
     * @OA\Response(response=201, description="Contact submitted successfully")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'name' => 'required|string|max:150',
            'email' => 'nullable|email|max:150',
            'mobile' => 'nullable|string|max:15',
            'subject' => 'nullable|string|max:300',
            'message' => 'required|string',
        ]);

        // Status default migration mein 'new' hai
        $submission = Contact::create($validated);

        return $this->successWithMap($submission, 'passthrough', 'Your message has been submitted successfully', 201);
    }

    /**
     * @OA\Get(
     * path="/contacts/{id}",
     * summary="View contact details and mark as read",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Submission details")
     * )
     */
    public function show($id): JsonResponse
    {
        $contact = Contact::findOrFail($id);

        // Mark as read if it's new
        if ($contact->status === 'new') {
            $contact->update(['status' => 'read']);
        }

        return $this->successWithMap($contact, 'passthrough');
    }

    /**
     * @OA\Delete(
     * path="/contacts/{id}",
     * summary="Delete contact submission",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Contact deleted")
     * )
     */
    public function destroy($id): JsonResponse
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return $this->success(null, 'Contact submission deleted successfully');
    }
}