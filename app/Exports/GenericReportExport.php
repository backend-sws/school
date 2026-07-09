<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;

class GenericReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected Collection $data;
    protected array $headers;

    public function __construct(array $data, array $headers)
    {
        $this->data = collect($data);
        $this->headers = $headers;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return collect($this->headers)->pluck('label')->toArray();
    }

    public function map($row): array
    {
        $mapped = [];
        foreach ($this->headers as $header) {
            $key = $header['key'];
            $mapped[] = $row[$key] ?? '';
        }
        return $mapped;
    }
}
