@push('styles')
<style>
    .admission-form-container { position: relative; padding-right: 130px; min-height: 180px; margin-bottom: 20px; }
    .photo-area { position: absolute; right: 0; top: 0; width: 110px; text-align: center; border: 1px solid var(--border-color); padding: 8px; background: #fff; }
    .student-photo-frame { width: 90px; height: 110px; border: 1px solid var(--text-main); margin: 0 auto 8px auto; background: var(--bg-muted); line-height: 110px; color: var(--text-muted); font-size: 8px; }

    .section-title-box { background: var(--bg-muted); border-left: 4px solid var(--brand-primary); padding: 5px 10px; font-weight: bold; text-transform: uppercase; font-size: 9px; margin-bottom: 10px; margin-top: 15px; }

    .field-group { margin-bottom: 8px; }
    .field-label { font-size: 8px; color: var(--text-muted); text-transform: uppercase; font-weight: bold; margin-bottom: 2px; }
    .field-value { border: 1px solid var(--border-color); padding: 5px; background: #fff; font-weight: bold; min-height: 14px; font-size: 10px; }

    .col-row { display: table; width: 100%; table-layout: fixed; border-spacing: 5px; margin: 0 -5px; }
    .col-item { display: table-cell; vertical-align: top; }
</style>
@endpush

@php
    $app = $document->extra['app'];
    $profile = $document->extra['profile'];
    $permAddr = $document->extra['permAddr'] ?? null;
    $corrAddr = $document->extra['corrAddr'] ?? null;
    $academic = $document->extra['academic'] ?? collect([]);
    $selectedSubjects = $document->extra['selectedSubjects'] ?? collect([]);
    $photo = $document->extra['photo'] ?? null;
    $sign = $document->extra['sign'] ?? null;
    $qrcode = $document->extra['qrcode'] ?? null;
    $feeRows = $document->extra['fee_rows'] ?? [];
@endphp

<div class="admission-form-container">
    <div class="col-row" style="margin-bottom: 15px;">
        <div class="col-item" style="width: 100%;">
            <div style="background: var(--bg-muted); padding: 10px; border: 1px dashed var(--brand-primary);">
                <div style="font-size: 9px; line-height: 1.6;">
                    <span class="font-bold">Main Stream:</span> Under Graduate (UG) |
                    <span class="font-bold">Stream / Course:</span> {{ $app->admissionHead->title }} |
                    <span class="font-bold">Session:</span> {{ $app->session_name }} <br>
                    <span class="font-bold">Semester:</span> SEM {{ $app->semester }} |
                    <span class="font-bold">Department:</span> {{ $app->admissionHead->majorSubject->name ?? '---' }}
                </div>
                <div style="margin-top: 8px;">
                    @foreach($selectedSubjects as $sub)
                        <span style="background: #fff; border: 1px solid var(--border-color); padding: 2px 6px; font-size: 8px; border-radius: 2px; margin-right: 5px;">
                            <span class="font-bold brand-accent-text">{{ $sub->subject_category_id == 1 ? 'MAJOR' : 'COURSE' }}:</span> {{ $sub->subject_name }}
                        </span>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <div class="section-title-box">Fee &amp; payment summary</div>
    <table border="0" cellpadding="4" cellspacing="0" class="w-full" style="font-size: 9px; margin-bottom: 15px;">
        @foreach($feeRows as $fr)
            <tr>
                <td @if(($fr['variant'] ?? '') === 'bold') class="font-bold" @endif>{{ $fr['left'] }}</td>
                <td class="text-right @if(($fr['variant'] ?? '') === 'bold') font-bold @elseif(($fr['variant'] ?? '') === 'balance') font-bold @endif">{{ $fr['right'] }}</td>
            </tr>
        @endforeach
    </table>

    <div class="col-row">
        <div class="col-item"><div class="field-label">Application ID</div><div class="field-value">#{{ $app->application_id }}</div></div>
        <div class="col-item"><div class="field-label">Univ. Confidential No</div><div class="field-value">{{ $profile->university_confidential_no ?? '---' }}</div></div>
        <div class="col-item"><div class="field-label">ABC Number</div><div class="field-value">{{ $profile->abc_no ?? '---' }}</div></div>
    </div>
    <div class="col-row" style="margin-top: 10px;">
        <div class="col-item" style="width: 66%;"><div class="field-label">Applicant Name</div><div class="field-value uppercase">{{ $app->applicant_name }}</div></div>
        <div class="col-item"><div class="field-label">Date of Birth</div><div class="field-value">{{ date('d M Y', strtotime($app->dob)) }}</div></div>
    </div>

    <div class="photo-area">
        <div class="student-photo-frame">
            @if($photo)
                <img src="{{ $photo }}" style="width:100%; height:100%; object-fit: cover;">
            @else
                NO PHOTO
            @endif
        </div>
        @if($qrcode)
            <img src="data:image/svg+xml;base64,{{ $qrcode }}" width="50" style="margin-bottom: 5px;">
        @endif
        <div style="font-size: 7px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">Verify App</div>
    </div>
</div>

<div class="section-title-box">Personal & Demographic Details</div>
<div class="col-row">
    <div class="col-item"><div class="field-label">Gender</div><div class="field-value uppercase">{{ $app->gender }}</div></div>
    <div class="col-item"><div class="field-label">Category (Caste)</div><div class="field-value uppercase">{{ $app->category }} ({{ $profile->caste ?? '---' }})</div></div>
    <div class="col-item"><div class="field-label">Blood Group</div><div class="field-value uppercase">{{ $profile->blood_group ?? '---' }}</div></div>
    <div class="col-item"><div class="field-label">Aadhar No</div><div class="field-value">{{ $profile->aadhar_no ?? '---' }}</div></div>
</div>

<div class="section-title-box">Parental Information</div>
<div class="col-row">
    <div class="col-item" style="width: 40%;"><div class="field-label">Father's Name</div><div class="field-value uppercase">{{ $profile->father_name }}</div></div>
    <div class="col-item"><div class="field-label">Qualification</div><div class="field-value">{{ $profile->father_qualification }}</div></div>
    <div class="col-item"><div class="field-label">Mobile</div><div class="field-value">{{ $profile->father_mobile }}</div></div>
</div>
<div class="col-row" style="margin-top: 5px;">
    <div class="col-item" style="width: 40%;"><div class="field-label">Mother's Name</div><div class="field-value uppercase">{{ $profile->mother_name }}</div></div>
    <div class="col-item"><div class="field-label">Occupation</div><div class="field-value">{{ $profile->father_occupation }}</div></div>
    <div class="col-item"><div class="field-label">Family Contact</div><div class="field-value">{{ $app->mobile }}</div></div>
</div>

<div class="section-title-box">Address Details</div>
<div class="col-row">
    <div class="col-item">
        <div class="field-label">Permanent Address</div>
        <div class="field-value" style="font-weight: normal; font-size: 8px;">
            @if($permAddr) {{ $permAddr->village }}, {{ $permAddr->po }}, {{ $permAddr->ps }}, {{ $permAddr->district }}, {{ $permAddr->state }} - {{ $permAddr->pincode }} @else --- @endif
        </div>
    </div>
    <div class="col-item">
        <div class="field-label">Correspondence Address</div>
        <div class="field-value" style="font-weight: normal; font-size: 8px;">
            @if($corrAddr) {{ $corrAddr->village }}, {{ $corrAddr->po }}, {{ $corrAddr->ps }}, {{ $corrAddr->district }}, {{ $corrAddr->state }} - {{ $corrAddr->pincode }} @else --- @endif
        </div>
    </div>
</div>

<div class="section-title-box">Academic History</div>
<table border="0" cellpadding="0" cellspacing="0" class="w-full">
    <thead>
        <tr>
            <th>Exam</th>
            <th>Institution</th>
            <th width="15%">Board</th>
            <th width="12%">Year</th>
            <th width="10%">% / CGPA</th>
        </tr>
    </thead>
    <tbody>
        @if($academic->isNotEmpty())
            @foreach($academic as $info)
                <tr>
                    <td>{{ $info->class ?? 'N/A' }}</td>
                    <td>{{ $info->institute_name ?? '---' }}</td>
                    <td>{{ $info->board ?? '---' }}</td>
                    <td class="text-center">{{ $info->passing_year ?? $info->session }}</td>
                    <td class="text-right">{{ $info->percentage ?? $info->marks ?? '---' }}</td>
                </tr>
            @endforeach
        @else
            <tr><td colspan="5" class="text-center">No academic data attached</td></tr>
        @endif
    </tbody>
</table>

<div style="margin-top: 25px;">
    <div style="font-size: 8px; color: var(--text-muted); padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-muted);">
        <div class="font-bold brand-accent-text" style="text-transform: uppercase; margin-bottom: 5px;">Declaration by Applicant</div>
        I certify that the facts stated above are true to the best of my knowledge. I promise to adhere to the rules and regulations of the College/University.
    </div>

    <div class="col-row" style="margin-top: 20px;">
        <div class="col-item" style="vertical-align: bottom;">
            <div style="font-size: 9px;">
                <strong>Place:</strong> {{ $app->place ?? '---' }}<br>
                <strong>Date:</strong> {{ date('d M Y') }}
            </div>
        </div>
        <div class="col-item text-right">
            <div style="display: inline-block; width: 150px; text-align: center;">
                @if($sign)
                    <img src="{{ $sign }}" height="35" style="display: block; margin: 0 auto 5px auto;">
                @endif
                <div style="border-top: 1px solid var(--text-main); padding-top: 5px; font-weight: bold;">Signature</div>
                <div style="font-size: 7px; color: var(--text-muted);">{{ strtoupper($app->applicant_name) }}</div>
            </div>
        </div>
    </div>
</div>
