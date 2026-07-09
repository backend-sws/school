<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; }
        .card {
            width: 85.6mm;
            height: 53.98mm;
            position: relative;
            overflow: hidden;
            background: #f8f9fa;
            color: #333;
            padding: 4mm;
        }
        .section-title {
            font-size: 7pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 1mm;
            border-bottom: 0.5pt solid #ddd;
            padding-bottom: 1mm;
        }
        .info { font-size: 6.5pt; line-height: 1.8; margin-bottom: 2mm; }
        .info .label { color: #888; }
        .terms {
            font-size: 5pt;
            color: #999;
            line-height: 1.4;
            margin-top: 2mm;
        }
        .institution-address {
            position: absolute;
            bottom: 3mm;
            left: 4mm;
            right: 4mm;
            font-size: 5.5pt;
            color: #999;
            text-align: center;
            border-top: 0.5pt solid #eee;
            padding-top: 1mm;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="section-title">Emergency Contact</div>
        <div class="info">
            @if(!empty($snapshot['father_name']))
                <div><span class="label">Father: </span>{{ $snapshot['father_name'] }}</div>
            @endif
            @if(!empty($snapshot['mother_name']))
                <div><span class="label">Mother: </span>{{ $snapshot['mother_name'] }}</div>
            @endif
            @if(!empty($snapshot['mobile']))
                <div><span class="label">Phone: </span>{{ $snapshot['mobile'] }}</div>
            @endif
            @if(!empty($snapshot['address']))
                <div><span class="label">Address: </span>{{ \Illuminate\Support\Str::limit($snapshot['address'], 80) }}</div>
            @endif
        </div>

        <div class="terms">
            <div class="section-title">Terms</div>
            1. This card is the property of the institution.<br>
            2. If found, please return to the address below.<br>
            3. This card is non-transferable.
        </div>

        <div class="institution-address">
            {{ $snapshot['institution_name'] ?? '' }}
            @if(!empty($snapshot['institution_address']))
                &bull; {{ $snapshot['institution_address'] }}
            @endif
        </div>
    </div>
</body>
</html>
