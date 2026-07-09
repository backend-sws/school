<?php

namespace App\Http\Controllers\Timetable;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TimetablePageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('timetable/index');
    }

    public function templates(): Response
    {
        return Inertia::render('timetable/templates/index');
    }

    public function rooms(): Response
    {
        return Inertia::render('timetable/rooms/index');
    }

    public function builder($id): Response
    {
        return Inertia::render('timetable/builder', [
            'id' => $id
        ]);
    }

    public function substitutions(): Response
    {
        return Inertia::render('timetable/substitutions/index');
    }

    public function daily(): Response
    {
        return Inertia::render('timetable/daily');
    }
}
