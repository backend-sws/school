@php
    $theme = \App\Models\Setting::getBranding('brand_theme') ?? config('ems.default_brand_theme', 'royal');
    $font = \App\Models\Setting::getBranding('brand_font') ?? 'sans';
    $primaryColor = \App\Models\Setting::getBranding('brand_color');
    $appearance = $page['props']['appearance'] ?? 'light';
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" 
    @class(['dark' => $appearance == 'dark'])
    data-theme="{{ $theme }}"
    data-font="{{ $font }}"
    @if($primaryColor) style="--primary: {{ $primaryColor }}; --color-primary: {{ $primaryColor }};" @endif>

<head>
    {{-- Google Analytics (GA4) — only when measurement ID is configured --}}
    @if(config('services.google.analytics_id'))
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('services.google.analytics_id') }}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '{{ config('services.google.analytics_id') }}');
        </script>
    @endif
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="theme-color" content="#4338ca" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="{{ config('ems.app_short_name', config('ems_branding.brand_name')) }}">
    <meta name="application-name" content="{{ config('ems_branding.brand_name') }}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    @php
        $brandName = $seo['brand_name'] ?? config('ems_branding.brand_name');
        $siteUrl = $seo['site_url'] ?? config('ems_branding.site_url');
        $poweredBy = $seo['powered_by'] ?? config('ems_branding.powered_by');
        $defaultTitle = $seo['meta_title'] ?? $brandName;
        $metaDescription = $seo['meta_description'] ?? ($brandName . ' — Modern Education Management System');

        // Favicon resolution: DB → env → local asset
        $faviconRaw = $seo['favicon_url'] ?? null;
        $faviconUrl = null;
        if ($faviconRaw) {
            $faviconUrl = str_starts_with($faviconRaw, 'http') ? $faviconRaw : asset($faviconRaw);
        }
        $faviconFallback = asset('favicon.png');

        // OG Image: DB → local logo
        $ogImageRaw = $seo['og_image'] ?? null;
        $ogImage = $ogImageRaw
            ? (str_starts_with($ogImageRaw, 'http') ? $ogImageRaw : asset($ogImageRaw))
            : asset('logo.png');

        $canonicalUrl = url()->current();
    @endphp

    <title inertia>{{ $defaultTitle }}</title>

    {{-- Canonical URL --}}
    <link rel="canonical" href="{{ $canonicalUrl }}">

    {{-- Favicon --}}
    @if($faviconUrl)
        <link rel="icon" href="{{ $faviconUrl }}" type="image/png" sizes="any">
        @if(str_ends_with(strtolower($faviconUrl), '.svg'))
            <link rel="icon" href="{{ $faviconUrl }}" type="image/svg+xml">
        @endif
    @else
        <link rel="icon" href="{{ $faviconFallback }}" type="image/png" sizes="any">
    @endif
    <link rel="apple-touch-icon" href="{{ $faviconUrl ?? $faviconFallback }}">

    {{-- Primary SEO Meta --}}
    <meta name="description" content="{{ e((string) str($metaDescription)->limit(160)) }}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    @if($poweredBy)
        <meta name="author" content="{{ e($poweredBy) }}">
    @endif
    <meta name="generator" content="{{ $brandName }}">
    <meta name="keywords"
        content="education management, school ERP, college management, attendance, LMS, fee management, {{ $brandName }}">

    {{-- Open Graph (Facebook, LinkedIn, WhatsApp) --}}
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $canonicalUrl }}">
    <meta property="og:title" content="{{ e($defaultTitle) }}">
    <meta property="og:site_name" content="{{ e($brandName) }}">
    <meta property="og:description" content="{{ e((string) str($metaDescription)->limit(200)) }}">
    <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}">
    @if($ogImage)
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ e($brandName) }} Logo">
    @endif

    {{-- Twitter Card --}}
    <meta name="twitter:card" content="{{ $ogImage ? 'summary_large_image' : 'summary' }}">
    <meta name="twitter:title" content="{{ e($defaultTitle) }}">
    <meta name="twitter:description" content="{{ e((string) str($metaDescription)->limit(200)) }}">
    @if($ogImage)
        <meta name="twitter:image" content="{{ $ogImage }}">
        <meta name="twitter:image:alt" content="{{ e($brandName) }} Logo">
    @endif

    {{-- Structured Data (JSON-LD) --}}
    @php
        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'WebApplication',
            'name' => $brandName,
            'url' => $siteUrl,
            'description' => (string) str($metaDescription)->limit(200),
            'applicationCategory' => 'EducationalApplication',
            'operatingSystem' => 'Web',
            'offers' => [
                '@type' => 'Offer',
                'price' => '0',
                'priceCurrency' => 'INR',
            ],
            'creator' => [
                '@type' => 'Organization',
                'name' => $poweredBy ?: $brandName,
            ],
        ];
        if ($ogImage) {
            $jsonLd['image'] = $ogImage;
        }
    @endphp
    <script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}</script>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>