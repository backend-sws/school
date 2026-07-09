<?php

namespace App\Http\Controllers\Api\V1\Grievance;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Grievance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Schema(
 * schema="Grievance",
 * @OA\Property(property="id", type="integer"),
 * @OA\Property(property="ticket_no", type="string"),
 * @OA\Property(property="institution_id", type="integer"),
 * @OA\Property(property="user_id", type="integer", nullable=true),
 * @OA\Property(property="name", type="string"),
 * @OA\Property(property="email", type="string"),
 * @OA\Property(property="mobile", type="string"),
 * @OA\Property(property="category", type="string"),
 * @OA\Property(property="subject", type="string"),
 * @OA\Property(property="description", type="string"),
 * @OA\Property(property="status", type="string", enum={"open", "in-progress", "resolved", "closed"}),
 * @OA\Property(property="priority", type="string", enum={"low", "medium", "high"}),
 * @OA\Property(property="resolution", type="string", nullable=true),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="resolved_at", type="string", format="date-time", nullable=true)
 * )
 */
class GrievanceController extends BaseController
{
   /**
     * @OA\Get(
     * path="/grievances",
     * summary="List grievances with unified search and filters",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="status", 
     * in="query", 
     * @OA\Schema(type="string"), 
     * description="Filter by status (e.g., pending, open, closed)"
     * ),
     * @OA\Parameter(
     * name="search", 
     * in="query", 
     * @OA\Schema(type="string"), 
     * description="Unified search by Ticket ID, Subject, or Student Name"
     * ),
     * @OA\Parameter(
     * name="per_page", 
     * in="query", 
     * @OA\Schema(type="integer", default=15)
     * ),
     * @OA\Response(
     * response=200, 
     * description="Paginated list of grievances retrieved successfully"
     * )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        
        $query = Grievance::with(['user:id,name', 'assignedUser:id,name']);

        // 1. Filter by Status (Exact match)
        $query->when($request->filled('status'), function ($q) use ($request) {
            return $q->where('status', $request->status);
        });

        // 2. Unified Search Block (Ticket No, Subject, aur User Name)
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = strtolower($request->search);

            return $q->where(function ($subQuery) use ($search) {
                // Ticket No search
                $subQuery->where('ticket_no', 'ILIKE', "%{$search}%")
                    // Subject search
                    ->orWhere('subject', 'ILIKE', "%{$search}%")
                    // Student (User) Name search through relationship
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'ILIKE', "%{$search}%");
                    });
            });
        });

        $query->latest();

        return $this->paginatedWithMap(
            $query->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }
    /**
     * @OA\Post(
     * path="/grievances",
     * summary="Submit grievance",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * required={ "name", "subject", "description"},
     * @OA\Property(property="name", type="string", example="John Doe"),
     * @OA\Property(property="email", type="string" , example="6d4fW@example.com"),
     * @OA\Property(property="mobile", type="string" , example="1234567890"),
     * @OA\Property(property="category", type="string" , example="Academic"),
     * @OA\Property(property="subject", type="string" , example="Grievance Subject"),
     * @OA\Property(property="description", type="string" , example="Grievance Description"),
     * @OA\Property(property="priority", type="string", enum={"low", "medium", "high"}, example="medium")
     * )),
     * @OA\Response(response=201, description="Grievance submitted")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'nullable|email|max:150',
            'mobile' => 'nullable|string|max:15',
            'category' => 'nullable|string|max:100',
            'subject' => 'required|string|max:300',
            'description' => 'required|string',
            'priority' => 'nullable|string|in:low,medium,high',
        ]);

      
        $user = Auth::user();
        $validated['user_id'] = $user ? $user->id : null;
        
        // If name/email/mobile not provided but user is logged in, try to fill from user profile
        if (empty($validated['name']) && $user) $validated['name'] = $user->name;
        if (empty($validated['email']) && $user) $validated['email'] = $user->email;
         if (empty($validated['mobile']) && $user) $validated['mobile'] = $user->mobile;

        // Generate Ticket No: GRV-YYYYMMDD-XXXXX
        $validated['ticket_no'] = 'GRV' . date('Ymd') . str_pad(Grievance::count() + 1, 5, '0', STR_PAD_LEFT);
        
        // Default values
        $validated['status'] = 'open';
        $validated['priority'] = $validated['priority'] ?? 'medium';

        return $this->created(Grievance::create($validated));
    }

    /**
     * @OA\Get(
     * path="/grievances/{id}",
     * summary="Get grievance details",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Grievance details")
     * )
     */
    public function show(Grievance $grievance): JsonResponse
    {
        return $this->successWithMap($grievance->load(['user', 'assignedUser']), 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/grievances/{id}",
     * summary="Update grievance (Admin/Staff)",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Grievance")),
     * @OA\Response(response=200, description="Grievance updated")
     * )
     */
    public function update(Request $request, Grievance $grievance): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'sometimes|string|max:100',
            'priority' => 'sometimes|string|in:low,medium,high',
            'status' => 'sometimes|string|in:open,in-progress,resolved,closed',
            'assigned_to' => 'nullable|integer|exists:users,id',
        ]);

        $grievance->update($validated);
        return $this->successWithMap($grievance, 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/grievances/{id}/resolve",
     * summary="Resolve grievance",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(@OA\JsonContent(
     * required={"resolution"},
     * @OA\Property(property="resolution", type="string"),
     * @OA\Property(property="status", type="string", enum={"resolved", "closed"})
     * )),
     * @OA\Response(response=200, description="Grievance resolved")
     * )
     */
    public function resolve(Request $request, Grievance $grievance): JsonResponse
    {
        $validated = $request->validate([
            'resolution' => 'required|string',
            'status' => 'nullable|string|in:resolved,closed'
        ]);

        $grievance->update([
            'status' => $validated['status'] ?? 'resolved',
            'resolution' => $validated['resolution'],
            'resolved_at' => now(),
        ]);

        return $this->successWithMap($grievance, 'passthrough', 'Grievance resolved successfully');
    }

    /**
     * @OA\Delete(
     * path="/grievances/{id}",
     * summary="Delete grievance",
     * tags={"Grievances"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Grievance deleted")
     * )
     */
    public function destroy(Grievance $grievance): JsonResponse
    {
        $grievance->delete();
        return $this->success(null, 'Grievance deleted');
    }
}