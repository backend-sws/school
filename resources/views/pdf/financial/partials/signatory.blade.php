<div style="margin-top: 35px; text-align: right;">
    <div style="display: inline-block; width: 200px; text-align: center;">
        @if(!empty($branding['authorized_signature']))
            <div style="margin-bottom: 2px; height: 50px; text-align: center;">
                <img src="{{ $branding['authorized_signature'] }}" alt="Signature" style="max-height: 48px; max-width: 170px; display: inline-block; vertical-align: bottom;" />
            </div>
        @else
            <div style="height: 45px;"></div>
        @endif
        <div style="border-top: 1px solid var(--text-main); padding-top: 5px;" class="font-bold">
            Authorized Signatory
        </div>
        <div style="font-size: 8px; color: var(--text-muted);">{{ $branding['name'] ?? config('app.name') }}</div>
    </div>
</div>
