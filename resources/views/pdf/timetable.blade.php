@extends('pdf.layouts.print-base')

@section('document_title', 'Weekly Timetable - ' . ($timetable->name ?? 'Schedule'))

@section('content')
    @php
        $days = [
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
            7 => 'Sunday'
        ];
        $slots = $timetable->template->periodSlots->sortBy('start_time');
        $entries = $timetable->entries->groupBy('day_of_week');
    @endphp

    <div style="margin-bottom: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" style="margin:0;">
            <tr>
                <td style="border:none; padding-right: 30px;">
                    <div style="font-size: 9px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">Session</div>
                    <div style="font-size: 11px; font-weight: bold; color: var(--text-main);">{{ $timetable->session->name ?? 'N/A' }}</div>
                </td>
                <td style="border:none; padding-right: 30px;">
                    <div style="font-size: 9px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">Class/Section</div>
                    <div style="font-size: 11px; font-weight: bold; color: var(--text-main);">{{ $timetable->scheduleable->name ?? 'General' }}</div>
                </td>
                <td style="border:none;">
                    <div style="font-size: 9px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">Status</div>
                    <div style="font-size: 11px; font-weight: bold; color: var(--brand-primary); text-transform: uppercase;">{{ $timetable->status }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="w-full" style="table-layout: fixed;">
        <thead>
            <tr>
                <th width="80" style="background: var(--bg-muted); color: var(--brand-primary); font-size: 9px;">Slot / Day</th>
                @foreach($days as $dayNum => $dayName)
                    @if($entries->has($dayNum) || $dayNum <= 6) {{-- Show Mon-Sat by default --}}
                        <th style="background: var(--bg-muted); color: var(--brand-primary); font-size: 9px;">{{ $dayName }}</th>
                    @endif
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($slots as $slot)
                <tr>
                    <td style="background: var(--bg-muted); font-weight: bold; font-size: 9px; vertical-align: middle; text-align: center;">
                        {{ \Carbon\Carbon::parse($slot->start_time)->format('h:i A') }}<br>
                        <span style="font-weight: normal; font-size: 8px; color: var(--text-muted);">to</span><br>
                        {{ \Carbon\Carbon::parse($slot->end_time)->format('h:i A') }}
                    </td>
                    @foreach($days as $dayNum => $dayName)
                        @if($entries->has($dayNum) || $dayNum <= 6)
                            <td style="height: 60px; font-size: 9px; padding: 5px; vertical-align: top;">
                                @php
                                    $dayEntries = $entries->get($dayNum, collect())->where('period_slot_id', $slot->id);
                                @endphp
                                @foreach($dayEntries as $entry)
                                    <div style="border-left: 2px solid var(--brand-primary); padding-left: 5px; margin-bottom: 5px;">
                                        <div style="font-weight: bold; color: var(--text-main);">{{ $entry->activity->name ?? 'Class' }}</div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-top: 2px;">
                                            @if($entry->teacher)
                                                <span style="font-style: italic;">{{ $entry->teacher->name }}</span><br>
                                            @endif
                                            @if($entry->room)
                                                <span>Room: {{ $entry->room->name }}</span>
                                            @endif
                                        </div>
                                    </div>
                                @endforeach
                            </td>
                        @endif
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    @if($timetable->notes)
        <div style="margin-top: 30px; padding: 15px; background: var(--bg-muted); border-radius: 6px; border: 1px solid var(--border-color);">
            <div style="font-weight: bold; text-transform: uppercase; font-size: 9px; margin-bottom: 5px; color: var(--brand-primary);">Additional Notes</div>
            <div style="font-size: 10px; color: var(--text-main); line-height: 1.4;">
                {!! nl2br(e($timetable->notes)) !!}
            </div>
        </div>
    @endif
@endsection
