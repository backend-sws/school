<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /* PDF Page Setup */
        @page {
            margin: 15mm 15mm;
            size: A4 portrait;
        }

        /* Traditional Receipt Tokens */
        :root {
            --text-main: #000000;
            --border-color: #000000;
        }

        * , h1, h2, h3, h4, p {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: var(--text-main);
            line-height: 1.5;
            margin:5px;
           
        }

        /* Common Layout Shortcuts */
        .w-full { width: 100%; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }

        .document-wrapper {
            position: relative;
            padding: 15px;
            border: 2px solid #000000;
        }

        .clearfix {
            clear: both;
        }

        /* Traditional Tables */
        table.grid-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            border: 1px solid var(--border-color);
        }

        table.grid-table th, table.grid-table td {
            border: 1px solid var(--border-color);
            padding: 6px 10px;
            color: var(--text-main);
        }

        table.grid-table th {
            text-align: center;
            font-size: 11px;
            font-weight: bold;
        }

        table.no-border-table {
            width: 100%;
            border-collapse: collapse;
            border: none;
        }

        table.no-border-table td, table.no-border-table th {
            border: none;
            padding: 4px;
        }

        /* Dotted underline for values */
        .dotted-value {
            border-bottom: 1px dotted #000000;
            display: inline-block;
            min-width: 150px;
        }

        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #000000;
            margin-top: 10px;
            margin-bottom: 5px;
            text-decoration: underline;
        }

        @stack('styles')
    </style>
</head>
<body>
    <div class="document-wrapper">
        @include('pdf.partials.institution-header')

        <main class="content-area">
            @yield('content')
        </main>

        @include('pdf.partials.print-footer')
    </div>
</body>
</html>
