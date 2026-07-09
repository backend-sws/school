<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            background-color: #ffffff;
        }
        .page {
            width: 190mm;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: avoid;
        }
        .grid-table {
            width: 100%;
            border-collapse: collapse;
        }
        .cell {
            padding: 2.5mm;
            vertical-align: top;
            width: 33.33%;
        }
        
        /* Portrait ID Card */
        .card {
            width: 53.98mm;
            height: 85.6mm;
            position: relative;
            overflow: hidden;
            border: 0.2mm solid #cbd5e1;
            border-radius: 4mm;
            margin: 0 auto;
        }
        .header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 18mm;
            text-align: center;
            padding-top: 3mm;
        }
        .institution-name {
            font-size: 5.5pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
            line-height: 1.1;
            padding: 0 1.5mm;
            word-wrap: break-word;
        }
        .photo-container {
            position: absolute;
            top: 11mm;
            left: 17.99mm;
            width: 18mm;
            height: 18mm;
            border-radius: 3mm;
            border: 1.5mm solid #ffffff;
            background-color: #ffffff;
            overflow: hidden;
            z-index: 10;
        }
        .photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1mm;
        }
        .no-photo {
            width: 100%;
            height: 100%;
            background-color: #e2e8f0;
            color: #94a3b8;
            font-size: 5pt;
            text-align: center;
            line-height: 15mm;
            font-weight: bold;
        }
        .content-area {
            position: absolute;
            top: 30.5mm;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 0 3mm;
        }
        .name {
            font-size: 8.5pt;
            font-weight: bold;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 0.3mm;
        }
        .reg-no {
            font-size: 5pt;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
            margin-bottom: 1.5mm;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 0.6mm 0;
            line-height: 1.1;
        }
        .field-label {
            font-size: 4pt;
            text-transform: uppercase;
            font-weight: bold;
            color: #94a3b8;
            letter-spacing: 0.5pt;
            display: block;
            margin-bottom: 0.1mm;
        }
        .field-value {
            font-size: 6pt;
            font-weight: bold;
            color: #334155;
            display: block;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
@php $cardsPerPage = 9; $cols = 3; @endphp
@foreach($cards->chunk($cardsPerPage) as $pageIndex => $pageCards)
    <div class="page">
        <table class="grid-table">
            @foreach($pageCards->chunk($cols) as $row)
                <tr>
                    @foreach($row as $card)
                        @php 
                            $snapshot = $card->snapshot_data; 
                            $template = $card->template;
                            $primaryColor = $template->background_color ?? '#1a237e';
                            $textColor = $template->color_scheme['text'] ?? '#ffffff';
                            $bgColor = $template->color_scheme['bg'] ?? '#f8fafc';
                        @endphp
                        <td class="cell">
                            <div class="card" style="background-color: {{ $bgColor }};">
                                {{-- Header --}}
                                <div class="header" style="background-color: {{ $primaryColor }}; color: {{ $textColor }};">
                                    <div class="institution-name">{{ $snapshot['institution_name'] ?? '' }}</div>
                                </div>

                                {{-- Photo --}}
                                <div class="photo-container" style="background-color: #f1f5f9; text-align: center;">
                                    @if(!empty($photosDataUris[$card->id]))
                                        <img src="{{ $photosDataUris[$card->id] }}" class="photo" alt="">
                                    @else
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" style="width: 70%; height: 70%; margin-top: 15%; display: inline-block;">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    @endif
                                </div>

                                {{-- Details --}}
                                <div class="content-area">
                                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2mm;">
                                        <tr>
                                            <td align="center" style="font-size: 7.5pt; font-weight: bold; color: #0f172a; line-height: 1.1; padding: 0;">
                                                {{ $snapshot['name'] ?? '' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="font-size: 4.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5pt; line-height: 1.0; padding: 0.3mm 0 0 0;">
                                                {{ $snapshot['reg_no'] ?? '' }}
                                            </td>
                                        </tr>
                                    </table>

                                    <table class="details-table">
                                        @if($card->card_type === 'student')
                                            @if(!empty($snapshot['stream']))
                                                <tr>
                                                    <td>
                                                        <span class="field-label">Class / Stream</span>
                                                        <span class="field-value">{{ $snapshot['stream'] }}</span>
                                                    </td>
                                                </tr>
                                            @endif
                                            @if(!empty($snapshot['blood_group']))
                                                <tr>
                                                    <td>
                                                        <span class="field-label">Blood Group</span>
                                                        <span class="field-value">{{ $snapshot['blood_group'] }}</span>
                                                    </td>
                                                </tr>
                                            @endif
                                        @elseif($card->card_type === 'staff')
                                            @if(!empty($snapshot['designation']))
                                                <tr>
                                                    <td>
                                                        <span class="field-label">Designation</span>
                                                        <span class="field-value">{{ $snapshot['designation'] }}</span>
                                                    </td>
                                                </tr>
                                            @endif
                                        @endif
                                        @if(!empty($card->valid_until))
                                            <tr>
                                                <td>
                                                    <span class="field-label">Valid Until</span>
                                                    <span class="field-value">{{ $card->valid_until->format('d M Y') }}</span>
                                                </td>
                                            </tr>
                                        @endif
                                    </table>
                                </div>
                            </div>
                        </td>
                    @endforeach
                    {{-- Empty cells --}}
                    @if($row->count() < $cols)
                        @for($i = $row->count(); $i < $cols; $i++)
                            <td class="cell"></td>
                        @endfor
                    @endif
                </tr>
            @endforeach
        </table>
    </div>
@endforeach
</body>
</html>
