<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background-color: #f8fafc;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #cbd5e0;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #718096;
            border-top: 1px solid #cbd5e0;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>{{ $payslip->payroll->institution->name ?? 'Salary Slip' }}</h2>
        </div>
        <div class="content">
            <p>Dear {{ $payslip->user->name }},</p>
            <p>Please find attached your salary slip for the month of <strong>{{ Carbon\Carbon::createFromDate($payslip->payroll->year, $payslip->payroll->month, 1)->format('F Y') }}</strong>.</p>
            
            <p><strong>Net Payable Salary:</strong> ₹{{ number_format($payslip->net_pay, 2) }}</p>
            
            <p>If you have any questions or discrepancies regarding this payslip, please contact the HR department.</p>
            
            <p>Best regards,<br>
            HR Department<br>
            {{ $payslip->payroll->institution->name ?? '' }}</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>
