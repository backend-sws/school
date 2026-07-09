<header class="institution-header" style="margin-bottom: 15px;">
    @yield('document_title_top')
    <table class="no-border-table" style="width: 100%; margin-bottom: 10px;">
        <tr>
            {{-- Logo Section --}}
            <td style="width: 15%; text-align: left; vertical-align: middle;">
                @if(!empty($branding['logo']))
                    <img src="{{ $branding['logo'] }}" style="max-height: 60px; max-width: 80px; border: 0;">
                @else
                    <img src="{{ public_path('logo.png') }}" style="max-height: 60px; max-width: 80px; border: 0;">
                @endif
            </td>
            
            {{-- Center Text --}}
            <td style="width: 70%; text-align: center; vertical-align: middle;">
                <h1 style="font-size: 24px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; font-family: 'Arial Black', Impact, sans-serif; letter-spacing: 1px;">
                    {{ $branding['name'] }}
                </h1>
                
                <div style="font-size: 11px; margin-bottom: 3px;">
                    @if(!empty($branding['address']))
                        <strong>Address:</strong> {{ $branding['address'] }}
                    @endif
                </div>
                
                <div style="font-size: 11px;">
                    @if(!empty($branding['phone'])) <strong>Contact No:</strong> {{ $branding['phone'] }} @endif
                    @if(!empty($branding['phone']) && !empty($branding['email'])) &nbsp;|&nbsp; @endif
                    @if(!empty($branding['email'])) <strong>Email ID:</strong> {{ $branding['email'] }} @endif
                </div>
            </td>
            
            {{-- Empty Right Spacer for perfect centering --}}
            <td style="width: 15%;"></td>
        </tr>
    </table>

    <table class="no-border-table" style="margin-top: 10px;">
        <tr>
            <td style="text-align: left; width: 33%;">
                <strong>No.</strong> <span class="dotted-value" style="min-width: 100px;">{{ $metadata['id'] ?? '' }}</span>
            </td>
            <td style="text-align: center; width: 34%; font-weight: bold; text-transform: uppercase; text-decoration: underline;">
                @yield('document_title', 'RECEIPT')
            </td>
            <td style="text-align: right; width: 33%;">
                <strong>Date:</strong> <span class="dotted-value" style="min-width: 100px;">{{ now()->format('d M Y') }}</span>
            </td>
        </tr>
    </table>
</header>
