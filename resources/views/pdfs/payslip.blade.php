<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Salary Slip</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            color: #000;
            font-size: 13px;
            margin: 0;
            padding: 10px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            margin: 0;
            color: #000;
            font-size: 22px;
            text-transform: uppercase;
        }
        .header p {
            margin: 5px 0 0;
            color: #333;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        table th, table td {
            border: 1px solid #000;
            padding: 8px 10px;
        }
        .details-table th {
            text-align: left;
            background-color: #f0f0f0;
            color: #000;
            width: 20%;
        }
        .details-table td {
            width: 30%;
            color: #000;
        }
        .salary-table th {
            background-color: #333;
            color: #fff;
            text-align: center;
            font-weight: bold;
        }
        .salary-table td {
            vertical-align: middle;
            color: #000;
        }
        .salary-table td.col-name {
            width: 30%;
        }
        .salary-table td.amount {
            width: 20%;
            text-align: right;
            font-weight: bold;
        }
        .total-row td {
            font-weight: bold;
            background-color: #f0f0f0;
            border-top: 2px solid #000;
            color: #000;
        }
        .net-pay {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff;
            border: 2px dashed #000;
            border-radius: 4px;
            text-align: center;
        }
        .net-pay h2 {
            margin: 5px 0;
            color: #000;
            font-size: 24px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #555;
            font-size: 11px;
            border-top: 1px solid #000;
            padding-top: 10px;
        }
        .signature-section {
            margin-top: 70px;
            width: 100%;
        }
        .signature-box {
            width: 40%;
            display: inline-block;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #000;
            padding-top: 5px;
            font-weight: bold;
            color: #000;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>{{ $payslip->payroll->institution->name ?? 'Institution Name' }}</h1>
        <p>Salary Slip for the month of {{ Carbon\Carbon::createFromDate($payslip->payroll->year, $payslip->payroll->month, 1)->format('F Y') }}</p>
    </div>

    <table class="details-table">
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
            <td style="{{ $lwpDays > 0 ? 'color: #e53e3e; font-weight: bold;' : '' }}">{{ $lwpDays }}</td>
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
                <th colspan="2">Earnings</th>
                <th colspan="2">Deductions</th>
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
                
                <td class="col-name" style="border-left: 1px solid #cbd5e0;">{{ isset($deductions[$i]) ? $deductions[$i]['name'] : '' }}</td>
                <td class="amount">{{ isset($deductions[$i]) ? '₹' . number_format($deductions[$i]['amount'], 2) : '' }}</td>
            </tr>
            @endfor
            
            <tr class="total-row">
                <td class="col-name">Total Earnings</td>
                <td class="amount">₹{{ number_format($payslip->basic_pay + $payslip->total_earnings, 2) }}</td>
                <td class="col-name" style="border-left: 1px solid #cbd5e0;">Total Deductions</td>
                <td class="amount">₹{{ number_format($payslip->total_deductions, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="net-pay">
        <p style="margin: 0 0 5px 0;">Net Payable Salary</p>
        <h2>₹{{ number_format($payslip->net_pay, 2) }}</h2>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #4a5568;">
            (Rupees {{ class_exists('NumberFormatter') ? NumberFormatter::create('en_IN', NumberFormatter::SPELLOUT)->format($payslip->net_pay) : $payslip->net_pay }} only)
        </p>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">Employee Signature</div>
        </div>
        <div class="signature-box" style="float: right;">
            <div class="signature-line">Authorized Signatory</div>
        </div>
    </div>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
    </div>

</body>
</html>
