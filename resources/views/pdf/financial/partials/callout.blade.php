<div style="margin-bottom: 12px; padding: 10px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; font-size: 9px;">
    <div style="font-weight: bold; text-transform: uppercase; color: #374151; margin-bottom: 6px;">{{ $section['title'] }}</div>
    <table border="0" cellpadding="2" cellspacing="0" class="w-full">
        @foreach($section['rows'] as $r)
            <tr>
                <td>{{ $r[0] }}</td>
                <td class="text-right font-bold">{{ $r[1] }}</td>
            </tr>
        @endforeach
    </table>
</div>
