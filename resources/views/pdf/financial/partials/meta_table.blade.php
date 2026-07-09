<div style="margin-bottom: 10px;">
<table class="no-border-table">
    @foreach($section['rows'] as $row)
        @php
            $c0 = $row[0] ?? '';
            $c1 = $row[1] ?? '';
            $c2 = $row[2] ?? '';
            $c3 = $row[3] ?? '';
            $spanSecond = ($c2 === '' && $c3 === '' && $c0 !== '');
        @endphp
        <tr>
            <td width="20%" class="font-bold">{{ $c0 }}</td>
            @if($spanSecond)
                <td colspan="3"><span class="dotted-value" style="width: 100%;">{{ $c1 }}</span></td>
            @else
                <td width="30%"><span class="dotted-value" style="width: 100%;">{{ $c1 }}</span></td>
                <td width="20%" class="font-bold">{{ $c2 }}</td>
                <td width="30%"><span class="dotted-value" style="width: 100%;">{{ $c3 }}</span></td>
            @endif
        </tr>
    @endforeach
</table>
</div>
