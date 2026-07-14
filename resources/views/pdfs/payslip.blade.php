<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Salary Slip</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            color: #1e293b;
            font-size: 11px;
            margin: 0;
            padding: 10px;
            line-height: 1.4;
        }
        
        /* Header styling */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: none;
        }
        .header-table td {
            border: none;
            padding: 0;
            vertical-align: middle;
        }
        .logo-container {
            width: 65px;
            padding-right: 15px !important;
        }
        .logo-img {
            max-height: 60px;
            max-width: 60px;
            object-fit: contain;
        }
        .school-info h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .school-info p {
            margin: 3px 0 0;
            font-size: 10px;
            color: #64748b;
            line-height: 1.3;
        }
        .document-title {
            text-align: right;
            width: 30%;
        }
        .document-title h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .document-title p {
            margin: 4px 0 0;
            font-size: 11px;
            font-weight: bold;
            color: #2563eb;
        }
        
        .divider {
            border-bottom: 2.5px solid #1e293b;
            margin-bottom: 18px;
            margin-top: -5px;
        }

        /* Employee Info Table */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
        }
        .info-table th {
            text-align: left;
            background-color: #f1f5f9;
            color: #475569;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
            width: 20%;
            border: 1px solid #e2e8f0;
            padding: 7px 10px;
        }
        .info-table td {
            width: 30%;
            color: #0f172a;
            font-size: 11px;
            border: 1px solid #e2e8f0;
            padding: 7px 10px;
        }

        /* Salary details tables */
        .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            border: 1px solid #e2e8f0;
        }
        .salary-table th {
            background-color: #f1f5f9;
            color: #475569;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            text-transform: uppercase;
        }
        .salary-table th.amount-header {
            text-align: right;
        }
        .salary-table td {
            padding: 7px 12px;
            font-size: 11px;
            border: 1px solid #e2e8f0;
            vertical-align: middle;
        }
        .salary-table td.col-name {
            width: 35%;
            color: #334155;
        }
        .salary-table td.amount {
            width: 15%;
            text-align: right;
            font-weight: bold;
            color: #0f172a;
        }
        .total-row td {
            font-weight: bold;
            background-color: #f1f5f9;
            border-top: 2px solid #cbd5e1;
            color: #0f172a;
        }

        /* Net Pay Box */
        .net-pay-box {
            background-color: #f8fafc;
            border: 2px solid #2563eb;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 22px;
            text-align: center;
        }
        .net-pay-box p {
            margin: 0;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            font-weight: bold;
        }
        .net-pay-box h2 {
            margin: 5px 0;
            color: #2563eb;
            font-size: 24px;
            font-weight: bold;
        }
        .net-pay-box .words {
            font-size: 11px;
            color: #64748b;
            font-style: italic;
            margin-top: 3px;
            text-transform: capitalize;
        }

        /* Signature section */
        .signature-table {
            width: 100%;
            margin-top: 40px;
            border-collapse: collapse;
            border: none;
        }
        .signature-table td {
            border: none;
            padding: 0;
            width: 50%;
            text-align: center;
        }
        .signature-line {
            width: 180px;
            margin: 0 auto;
            border-top: 1.5px solid #475569;
            padding-top: 5px;
            font-weight: bold;
            color: #1e293b;
            font-size: 11px;
        }

        /* Footer */
        .footer {
            margin-top: 35px;
            text-align: center;
            color: #94a3b8;
            font-size: 9px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            @if(!empty($logoDataUri))
                <td class="logo-container">
                    <img src="{{ $logoDataUri }}" class="logo-img" alt="Logo">
                </td>
            @endif
            <td class="school-info">
                <h1>{{ $payslip->payroll->institution?->name ?? 'Institution Name' }}</h1>
                <p>
                    {{ $payslip->payroll->institution?->address }}@if($payslip->payroll->institution?->city), {{ $payslip->payroll->institution?->city }}@endif @if($payslip->payroll->institution?->pincode) - {{ $payslip->payroll->institution?->pincode }}@endif<br>
                    @if($payslip->payroll->institution?->phone)Phone: {{ $payslip->payroll->institution?->phone }}@endif
                    @if($payslip->payroll->institution?->email) | Email: {{ $payslip->payroll->institution?->email }}@endif
                    @if($payslip->payroll->institution?->website) | Website: {{ $payslip->payroll->institution?->website }}@endif
                </p>
            </td>
            <td class="document-title">
                <h2>PAYSLIP</h2>
                <p>{{ Carbon\Carbon::createFromDate($payslip->payroll->year, $payslip->payroll->month, 1)->format('F Y') }}</p>
            </td>
        </tr>
    </table>
    
    <div class="divider"></div>

    <table class="info-table">
        <tr>
            <th>Employee Name</th>
            <td>{{ $payslip->user->name }}</td>
            <th>Employee ID</th>
            <td>{{ $payslip->user->staffProfile->employee_id ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Designation</th>
            <td>{{ $payslip->user->staffProfile->designation ?? 'N/A' }}</td>
            <th>Department</th>
            <td>{{ $payslip->user->staffProfile->department ?? 'N/A' }}</td>
        </tr>
        @php
            $totalDays = Carbon\Carbon::createFromDate($payslip->payroll->year, $payslip->payroll->month, 1)->daysInMonth;
            $workedDays = $payslip->worked_days ?? $totalDays;
            $lwpDays = $totalDays - $workedDays;
        @endphp
        <tr>
            <th>Total Month Days</th>
            <td>{{ $totalDays }}</td>
            <th>LWP (Unpaid Leave)</th>
            <td style="{{ $lwpDays > 0 ? 'color: #ef4444; font-weight: bold;' : '' }}">{{ $lwpDays }}</td>
        </tr>
        <tr>
            <th>Paid Days</th>
            <td style="font-weight: bold;">{{ $workedDays }}</td>
            <th>Pay Date</th>
            <td>{{ now()->format('d M, Y') }}</td>
        </tr>
    </table>

    <table class="salary-table">
        <thead>
            <tr>
                <th style="width: 35%;">Earnings</th>
                <th class="amount-header" style="width: 15%;">Amount</th>
                <th style="width: 35%; border-left: 1px solid #cbd5e1;">Deductions</th>
                <th class="amount-header" style="width: 15%; border-left: 1px solid #cbd5e1;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @php
                $earnings = [];
                $deductions = [];
                
                // Add basic pay
                $earnings[] = ['name' => 'Basic Salary', 'amount' => $payslip->basic_pay];
                
                // Categorize components
                foreach($payslip->component_breakdown as $comp) {
                    if($comp['type'] === 'earning') {
                        $earnings[] = $comp;
                    } else {
                        $deductions[] = $comp;
                    }
                }
                
                $maxRows = max(count($earnings), count($deductions));
            @endphp
            
            @for($i = 0; $i < $maxRows; $i++)
            <tr>
                <td class="col-name">{{ isset($earnings[$i]) ? $earnings[$i]['name'] : '' }}</td>
                <td class="amount">{{ isset($earnings[$i]) ? '₹' . number_format($earnings[$i]['amount'], 2) : '' }}</td>
                
                <td class="col-name" style="border-left: 1px solid #e2e8f0;">{{ isset($deductions[$i]) ? $deductions[$i]['name'] : '' }}</td>
                <td class="amount" style="border-left: 1px solid #e2e8f0;">{{ isset($deductions[$i]) ? '₹' . number_format($deductions[$i]['amount'], 2) : '' }}</td>
            </tr>
            @endfor
            
            <tr class="total-row">
                    <td class="col-name">Total Earnings</td>
                    <td class="amount">₹{{ number_format($payslip->basic_pay + $payslip->total_earnings, 2) }}</td>
                    <td class="col-name" style="border-left: 1px solid #e2e8f0;">Total Deductions</td>
                    <td class="amount" style="border-left: 1px solid #e2e8f0;">₹{{ number_format($payslip->total_deductions, 2) }}</td>
                </tr>
        </tbody>
    </table>

    <div class="net-pay-box">
        <p>Net Payable Salary</p>
        <h2>₹{{ number_format($payslip->net_pay, 2) }}</h2>
        <div class="words">
            (Rupees {{ class_exists('NumberFormatter') ? NumberFormatter::create('en_IN', NumberFormatter::SPELLOUT)->format($payslip->net_pay) : $payslip->net_pay }} only)
        </div>
    </div>

    <table class="signature-table">
        <tr>
            <td>
                <div class="signature-line">Employee Signature</div>
            </td>
            <td>
                <div class="signature-line">Authorized Signatory</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
    </div>

</body>
</html>
