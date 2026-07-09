<div style="margin-top: 15px;">
    <table class="grid-table" style="margin-top: 0;">
        @foreach($section['rows'] as $row)
            @php $v = $row['variant'] ?? 'pair'; @endphp
            @if($v === 'label_span')
                <tr>
                    <td colspan="2" style="font-weight: bold; background-color: #f0f0f0;">{{ $row['text'] }}</td>
                </tr>
            @elseif($v === 'balance')
                <tr>
                    <td style="font-weight: bold; font-size: 12px; text-transform: uppercase;">{{ $row['left'] }}</td>
                    <td style="text-align: right; font-weight: bold; font-size: 13px;">{{ $row['right'] }}</td>
                </tr>
            @else
                <tr>
                    <td class="@if(!empty($row['left_bold'])) font-bold @endif">{{ $row['left'] }}</td>
                    <td class="text-right @if(!empty($row['right_bold'])) font-bold @endif {{ $row['right_class'] ?? '' }}">{{ $row['right'] }}</td>
                </tr>
            @endif
        @endforeach
    </table>
</div>
