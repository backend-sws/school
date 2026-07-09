@extends('pdf.layouts.print-base')

@section('document_title', $metadata['title'] ?? 'Report')

@section('content')
    @if(isset($metadata['description']) && $metadata['description'])
        <div style="margin-bottom: 20px; color: var(--text-muted); font-size: 11px; font-style: italic;">
            {{ $metadata['description'] }}
        </div>
    @endif

    @if(isset($data['summary']) && is_array($data['summary']))
        <div style="margin-bottom: 25px; padding: 15px; background: var(--bg-muted); border-radius: 6px; border: 1px solid var(--border-color);">
            <div style="font-weight: bold; text-transform: uppercase; font-size: 10px; margin-bottom: 10px; color: var(--brand-primary);">Executive Summary</div>
            <table border="0" cellpadding="0" cellspacing="0" class="w-full" style="margin:0;">
                @foreach(array_chunk($data['summary'], 2, true) as $chunk)
                    <tr>
                        @foreach($chunk as $key => $value)
                            <td style="border:none; padding:4px 0;">
                                <span style="font-size: 9px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;">{{ ucfirst(str_replace('_', ' ', $key)) }}:</span>
                                <span style="font-size: 11px; font-weight: bold; color: var(--text-main); margin-left: 5px;">{{ $value }}</span>
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </table>
        </div>
    @endif

    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        <thead>
            <tr>
                @foreach($headers as $header)
                    <th @if(isset($header['width'])) width="{{ $header['width'] }}" @endif>
                        {{ $header['label'] }}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @if(isset($data['items']) && count($data['items']) > 0)
                @foreach($data['items'] as $row)
                    <tr>
                        @foreach($headers as $header)
                            <td>
                                @php
                                    $value = $row[$header['key']] ?? '';
                                    if(is_numeric($value) && ($header['type'] ?? '') === 'currency') {
                                        $value = '₹' . number_format($value, 2);
                                    }
                                @endphp
                                {{ $value }}
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="{{ count($headers) }}" class="text-center" style="padding: 30px; color: var(--text-muted);">
                        No data available for this report criteria.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
@endsection