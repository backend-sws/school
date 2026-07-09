@extends('pdf.layouts.print-base')

@section('document_title', $document->documentTitle)

@section('content')
@php $kind = $document->kind; @endphp
@if($kind === 'inventory_receipt')
    @include('pdf.financial.kinds.inventory_receipt', ['document' => $document, 'branding' => $branding])
@elseif($kind === 'student_admission_summary')
    @include('pdf.financial.kinds.student_admission_summary', ['document' => $document])
@else
    @foreach($document->sections as $section)
        @include('pdf.financial.partials.' . $section['type'], ['section' => $section, 'branding' => $branding ?? []])
    @endforeach
    @if($document->showSignatory)
        @include('pdf.financial.partials.signatory', ['branding' => $branding ?? []])
    @endif
@endif
@endsection
