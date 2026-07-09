<div style="float: right; width: 50%;">
    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        @foreach($section['rows'] as $row)
            @php $style = $row['style'] ?? 'normal'; @endphp
            @if($style === 'total')
                <tr style="font-size: 14px;">
                    <td style="border:none;" class="text-right font-bold">{{ $row['label'] }}</td>
                    <td style="border:none; border-top: 1px solid var(--border-color); border-bottom: 2px solid var(--brand-primary);" width="110" class="text-right font-bold brand-accent-text">{{ $row['amount'] }}</td>
                </tr>
            @elseif($style === 'note')
                <tr>
                    <td style="border:none; padding-top: 6px;" class="text-right" colspan="2">{{ $row['amount'] }}</td>
                </tr>
            @else
                <tr>
                    <td style="border:none;" class="text-right @if($style === 'balance') font-bold @endif">{{ $row['label'] }}</td>
                    <td style="border:none;" width="110" class="text-right @if($style === 'discount') brand-accent-text @elseif($style === 'balance') font-bold @endif">{{ $row['amount'] }}</td>
                </tr>
            @endif
        @endforeach
    </table>
</div>
<div class="clearfix"></div>
