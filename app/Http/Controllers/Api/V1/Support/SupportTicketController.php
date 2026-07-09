<?php

namespace App\Http\Controllers\Api\V1\Support;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\SupportMessage;
use App\Http\Controllers\Api\V1\BaseController;

/**
 * @OA\Tag(name="Support System", description="APIs for Student Support Tickets and Admin Management")
 */
class SupportTicketController extends BaseController
{
    /**
     * @OA\Get(
     * path="/support/tickets",
     * summary="List tickets with Mandatory Support-For filter and optional sub-filters",
     * tags={"Support System"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="support_for", in="query", required=true, description="Mandatory category (Admission, Certificate, Fee Payment)", @OA\Schema(type="string", enum={"Admission", "Certificate", "Fee Payment"})),
     * @OA\Parameter(name="search", in="query", description="Search by Ticket ID", @OA\Schema(type="string")),
     * @OA\Parameter(name="status", in="query", description="Filter by status (open, in-progress, closed)", @OA\Schema(type="string")),
     * @OA\Parameter(name="priority", in="query", description="Filter by priority (low, medium, high)", @OA\Schema(type="string")),
     * @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index(Request $request)
    {
        // 1. Validation for 'support_for'
        $request->validate([
            'support_for' => 'nullable|string|in:Admission,Certificate,Fee Payment,All'
        ]);

        $user = $request->user();
        $query = SupportTicket::with(['user:id,name']);

        // 2. Primary Filter
        if ($request->filled('support_for') && $request->support_for !== 'All') {
            $query->where('support_for', $request->support_for);
        }

        // 3. Role-based Access Control
        if (!$user->hasAbility('view_all_support_tickets')) {
            $query->where('user_id', $user->id);
        }


        // Search by Ticket ID
        if ($request->filled('search')) {
            $query->where('ticket_id', 'LIKE', '%' . $request->search . '%');
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by Priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // 5. Sorting: High Priority First, then Latest
        $tickets = $query->orderByRaw("CASE 
            WHEN priority = 'high' THEN 1 
            WHEN priority = 'medium' THEN 2 
            ELSE 3 END")
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->paginated($tickets);
    }

    /**
     * @OA\Post(
     * path="/support/tickets/create",
     * summary="Student: Raise a new support ticket",
     * tags={"Support System"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"support_for","issue_type","subject","description"},
     * @OA\Property(property="support_for", type="string", enum={"Certificate", "Fee Payment", "Admission"}),
     * @OA\Property(property="issue_type", type="string", enum={"General", "Fee Payment", "Application"}),
     * @OA\Property(property="subject", type="string", example="Payment Issue"),
     * @OA\Property(property="description", type="string", example="Money deducted but no receipt."),
     * @OA\Property(property="attachment", type="string", example="https://example.com/attachment.pdf")
     * )
     * ),
     * @OA\Response(response=200, description="Ticket Created")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'support_for' => 'required|string|in:Certificate,Fee Payment,Admission',
            'issue_type' => 'required|string|in:General,Fee Payment,Application',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'attachment' => 'nullable|string',
        ]);

        $ticket = SupportTicket::create([
            'ticket_id' => 'TKT-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
            'user_id' => $request->user()->id,
            'support_for' => $request->support_for,
            'issue_type' => $request->issue_type,
            'priority' => 'medium', // Default set by system
            'subject' => $request->subject,
            'description' => $request->description,
            'attachment' => $request->attachment,
            'status' => 'open',
            'opened_on' => now(),
        ]);

        // Notify staff (Redressal Cell)
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if ($institutionId) {
            $staff = \App\Models\User::withRedressalCellForInstitution($institutionId)->get();
            \Illuminate\Support\Facades\Notification::send($staff, new \App\Notifications\Support\NewSupportTicketNotification($ticket));
        }

        return $this->successWithMap($ticket, 'passthrough', 'Support ticket raised successfully');
    }

    /**
     * @OA\Get(
     * path="/support/tickets/{id}",
     * summary="Get ticket details with messages",
     * tags={"Support System"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Success")
     * )
     */
    public function show($id)
    {
        $ticket = SupportTicket::with(['messages.user:id,name', 'user:id,name', 'closedBy:id,name'])->findOrFail($id);

        if (!auth()->user()->hasAbility('view_all_support_tickets') && $ticket->user_id !== auth()->id()) {
            return $this->error('Unauthorized', 403);
        }

        return $this->successWithMap($ticket, 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/support/tickets/{id}/reply",
     * summary="Reply to a ticket thread",
     * tags={"Support System"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="message", type="string"),
     * @OA\Property(property="attachment", type="string"))),
     * @OA\Response(response=200, description="Reply Posted")
     * )
     */
    public function postReply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
            'attachment' => 'nullable|string', // 2MB limit
        ]);
        $ticket = SupportTicket::findOrFail($id);

        // Security check: only ticket owner or user with view_all_support_tickets can reply
        if (!$request->user()->hasAbility('view_all_support_tickets') && $ticket->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        if ($ticket->status === 'closed') {
            return $this->error('Ticket is closed', 422);
        }

        $message = SupportMessage::create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'attachment' => $request->attachment
        ]);

        if ($request->user()->hasAbility('update_support_tickets')) {
            $ticket->update(['status' => 'in-progress']);
        }

        return $this->success($message, 'Response posted successfully');
    }

    /**
     * @OA\Patch(
     * path="/support/tickets/{id}/priority",
     * summary="Admin: Update ticket priority",
     * tags={"Support System"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="priority", type="string", enum={"low","medium","high"}))),
     * @OA\Response(response=200, description="Priority Updated")
     * )
     */
    public function updatePriority(Request $request, $id)
    {
        if (!$request->user()->hasAbility('update_support_tickets')) {
            return $this->error('Unauthorized', 403);
        }

        $request->validate(['priority' => 'required|in:low,medium,high']);
        $ticket = SupportTicket::findOrFail($id);
        $ticket->update(['priority' => $request->priority]);

        return $this->successWithMap($ticket, 'passthrough', "Priority updated to {$request->priority}");
    }

    /**
     * @OA\Post(
     * path="/support/tickets/{id}/close",
     * summary="Admin: Close a ticket",
     * tags={"Support System"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Ticket Closed")
     * )
     */
    public function close(Request $request, $id)
    {
        if (!$request->user()->hasAbility('close_support_tickets')) {
            return $this->error('Unauthorized', 403);
        }

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'status' => 'closed',
            'closed_on' => now(),
            'closed_by' => $request->user()->id
        ]);

        return $this->successWithMap($ticket, 'passthrough', 'Ticket closed successfully');
    }
}