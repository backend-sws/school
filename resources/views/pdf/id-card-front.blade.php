<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 0;
            size: 53.98mm 85.6mm portrait;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            background-color: #ffffff;
            width: 53.98mm;
            height: 85.6mm;
            -webkit-print-color-adjust: exact;
        }
        .card {
            width: 53.98mm;
            height: 85.6mm;
            position: relative;
            overflow: hidden;
            background-color: {{ $template->color_scheme['bg'] ?? '#f8fafc' }};
        }
        
        /* Front Design */
        .header {
            position: absolute;
            top: 0;
            left: 0;
            width: 53.98mm;
            height: 22.3mm;
            background-color: {{ $template->background_color ?? '#1a237e' }};
            color: {{ $template->color_scheme['text'] ?? '#ffffff' }};
            text-align: center;
            padding-top: 3mm;
        }
        .logo-container {
            width: 100%;
            text-align: center;
            margin-bottom: 1.5mm;
        }
        .logo {
            width: 8.5mm;
            height: 8.5mm;
            object-fit: contain;
            display: inline-block;
        }
        .institution-name {
            font-size: 5.5pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.6pt;
            line-height: 1.1;
            padding: 0 2mm;
            word-wrap: break-word;
        }
        .photo-container {
            position: absolute;
            top: 13.3mm;
            left: 17.99mm; /* (53.98 - 18) / 2 = 17.99 */
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
            top: 32.5mm;
            left: 0;
            width: 53.98mm;
            height: 53.1mm;
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

        /* Back Design */
        .back-card {
            background-color: #ffffff;
        }
        .back-header {
            position: absolute;
            top: 0;
            left: 0;
            width: 53.98mm;
            height: 11mm;
            background-color: {{ $template->background_color ?? '#1a237e' }};
            color: {{ $template->color_scheme['text'] ?? '#ffffff' }};
            text-align: center;
            line-height: 11mm;
            font-size: 7.5pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5pt;
        }
        .back-content {
            position: absolute;
            top: 13.5mm;
            left: 4mm;
            width: 45.98mm;
            height: 52mm;
        }
        .back-field {
            margin-bottom: 1.8mm;
            border-bottom: 0.25pt solid #f1f5f9;
            padding-bottom: 0.8mm;
        }
        .back-field-label {
            font-size: 4.5pt;
            text-transform: uppercase;
            font-weight: bold;
            color: #94a3b8;
            letter-spacing: 0.4pt;
            margin-bottom: 0.1mm;
        }
        .back-field-value {
            font-size: 6.5pt;
            font-weight: bold;
            color: #334155;
            line-height: 1.1;
        }
        .back-footer {
            position: absolute;
            bottom: 4mm;
            left: 4mm;
            width: 45.98mm;
            text-align: center;
        }
        .back-qr-container {
            width: 14mm;
            height: 14mm;
            margin: 0 auto;
            padding: 1.2mm;
            border: 0.25pt solid #e2e8f0;
            border-radius: 1.5mm;
            background-color: #ffffff;
        }
        .back-qr {
            width: 100%;
            height: 100%;
            display: block;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    {{-- FRONT SIDE --}}
    <div class="card">
        {{-- Header --}}
        <div class="header">
            @if(!empty($showInstitutionLogo) && !empty($institutionLogo))
                <div class="logo-container">
                    <img src="{{ $institutionLogo }}" class="logo" alt="Logo">
                </div>
            @elseif(!empty($snapshot['institution_logo']))
                <div class="logo-container">
                    <img src="{{ $snapshot['institution_logo'] }}" class="logo" alt="Logo">
                </div>
            @endif
            @if(!empty($showInstitutionName))
                <div class="institution-name">{{ $snapshot['institution_name'] ?? $institutionName ?? '' }}</div>
            @endif
        </div>

        {{-- Photo --}}
        <div class="photo-container" style="background-color: #f1f5f9; text-align: center;">
            @if(!empty($photoDataUri))
                <img src="{{ $photoDataUri }}" class="photo" alt="Photo">
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
                    <td align="center" style="font-size: 8.5pt; font-weight: bold; color: #0f172a; line-height: 1.2; padding: 0;">
                        {{ $snapshot['name'] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-size: 5pt; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5pt; line-height: 1.1; padding: 0.5mm 0 0 0;">
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
                    @if(!empty($snapshot['dob']))
                        <tr>
                            <td>
                                <span class="field-label">Date of Birth</span>
                                <span class="field-value">{{ $snapshot['dob'] }}</span>
                            </td>
                        </tr>
                    @endif
                    @if(!empty($snapshot['valid_until']))
                        <tr>
                            <td>
                                <span class="field-label">Valid Until</span>
                                <span class="field-value">{{ \Carbon\Carbon::parse($snapshot['valid_until'])->format('d M Y') }}</span>
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
                    @if(!empty($snapshot['employee_id']))
                        <tr>
                            <td>
                                <span class="field-label">Employee ID</span>
                                <span class="field-value">{{ $snapshot['employee_id'] }}</span>
                            </td>
                        </tr>
                    @endif
                    @if(!empty($snapshot['dob']))
                        <tr>
                            <td>
                                <span class="field-label">Date of Birth</span>
                                <span class="field-value">{{ $snapshot['dob'] }}</span>
                            </td>
                        </tr>
                    @endif
                @endif
            </table>
        </div>
    </div>

    {{-- PAGE BREAK --}}
    <div class="page-break"></div>

    {{-- BACK SIDE --}}
    <div class="card back-card">
        <div class="back-header">
            {{ $card->card_type === 'staff' ? 'STAFF DETAILS' : 'STUDENT DETAILS' }}
        </div>

        <div class="back-content">
            @if(!empty($snapshot['father_name']))
                <div class="back-field">
                    <div class="back-field-label">Father's Name</div>
                    <div class="back-field-value">{{ $snapshot['father_name'] }}</div>
                </div>
            @endif

            @if(!empty($snapshot['mother_name']))
                <div class="back-field">
                    <div class="back-field-label">Mother's Name</div>
                    <div class="back-field-value">{{ $snapshot['mother_name'] }}</div>
                </div>
            @endif

            @if(!empty($snapshot['address']))
                <div class="back-field">
                    <div class="back-field-label">Address</div>
                    <div class="back-field-value" style="font-size: 5.5pt; line-height: 1.25;">{{ $snapshot['address'] }}</div>
                </div>
            @endif

            @if(!empty($snapshot['mobile']))
                <div class="back-field">
                    <div class="back-field-label">Contact</div>
                    <div class="back-field-value">{{ $snapshot['mobile'] }}</div>
                </div>
            @endif

            @if(!empty($snapshot['email']))
                <div class="back-field">
                    <div class="back-field-label">Email</div>
                    <div class="back-field-value" style="font-size: 5.5pt;">{{ $snapshot['email'] }}</div>
                </div>
            @endif
        </div>

        <div class="back-footer">
            @if($qrCodeBase64)
                <div class="back-qr-container">
                    <img src="data:image/svg+xml;base64,{{ $qrCodeBase64 }}" class="back-qr" alt="QR">
                </div>
            @endif
        </div>
    </div>
</body>
</html>
