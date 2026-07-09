<footer style="position: absolute; bottom: 20px; left: 20px; right: 20px; border-top: 1px solid var(--border-color); padding-top: 15px; font-size: 8px; color: var(--text-muted);">
    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        <tr>
            <td width="60%">
                <p><strong>Disclaimer:</strong> This is a computer-generated document and does not require a physical signature.</p>
                <p>Generated on: {{ now()->format('d M Y, h:i A') }}</p>
            </td>
            <td width="40%" class="text-right" style="vertical-align: bottom;">
                <p style="color: var(--text-muted);">{{ $branding['name'] ?? config('app.name', 'Institution') }}</p>
            </td>
        </tr>
    </table>
</footer>
