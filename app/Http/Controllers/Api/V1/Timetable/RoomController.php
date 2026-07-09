<?php

namespace App\Http\Controllers\Api\V1\Timetable;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends BaseController
{
    public function index(): JsonResponse
    {
        return $this->success(Room::all());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer',
            'type' => 'string|in:classroom,lab,auditorium,other',
        ]);

        $room = Room::create($request->all());

        return $this->success($room, "Room created successfully.", 201);
    }

    public function show(Room $room): JsonResponse
    {
        return $this->success($room);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $request->validate([
            'name' => 'string|max:255',
            'code' => 'nullable|string|max:50',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer',
            'type' => 'string|in:classroom,lab,auditorium,other',
        ]);

        $room->update($request->all());

        return $this->success($room, "Room updated successfully.");
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();
        return $this->success(null, "Room deleted successfully.");
    }
}
