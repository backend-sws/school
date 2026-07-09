<table class="grid-table" style="margin-bottom: 15px;">
    <thead>
        <tr>
            <th width="40%">{{ $section['headers'][0] ?? 'Particulars' }}</th>
            <th width="30%">{{ $section['headers'][1] ?? 'Status' }}</th>
            <th width="30%">{{ $section['headers'][2] ?? 'Amount' }}</th>
        </tr>
    </thead>
    <tbody>
        @foreach($section['rows'] as $row)
            <tr>
                <td>
                    {{ $row['cells'][0] }}
                    @if(!empty($row['subtext']))
                        <br><span style="font-size: 9px;">({{ $row['subtext'] }})</span>
                    @endif
                </td>
                <td class="text-center uppercase">{{ $row['cells'][1] }}</td>
                <td class="text-right font-bold">{{ $row['cells'][2] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
