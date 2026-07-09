<div style="margin-top: 20px; padding: 15px; border: 1px dashed var(--border-color); border-radius: 4px;">
    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        @foreach($section['rows'] as $r)
            <tr>
                <td width="25%" style="border:none; padding: 4px 0;" class="font-bold">{{ $r[0] }}:</td>
                <td style="border:none; padding: 4px 0;">{{ $r[1] }}</td>
            </tr>
        @endforeach
    </table>
</div>
