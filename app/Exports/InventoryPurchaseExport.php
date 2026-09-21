<?php

namespace App\Exports;

use App\Models\InventoryPurchase;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class InventoryPurchaseExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;
    private int $rowNumber = 0;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = InventoryPurchase::query()->with([
            'vendor:id,name,city,contact_phone,contact_name',
            'purchasedBy:id,name',
            'settlement:id,reference_number,settlement_date,payment_mode',
            'lines.item:id,name,code,unit',
        ]);

        if (!empty($this->filters['inventory_vendor_id']) && $this->filters['inventory_vendor_id'] !== 'all') {
            $query->where('inventory_vendor_id', $this->filters['inventory_vendor_id']);
        }

        if (!empty($this->filters['payment_status']) && $this->filters['payment_status'] !== 'all') {
            $query->where('payment_status', $this->filters['payment_status']);
        }

        if (!empty($this->filters['inventory_item_id']) && $this->filters['inventory_item_id'] !== 'all') {
            $query->whereHas('lines', fn($q) => $q->where('inventory_item_id', $this->filters['inventory_item_id']));
        }

        if (!empty($this->filters['from_date'])) {
            $query->whereDate('purchased_at', '>=', $this->filters['from_date']);
        }

        if (!empty($this->filters['to_date'])) {
            $query->whereDate('purchased_at', '<=', $this->filters['to_date']);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(bill_no) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(supplier_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(remarks) LIKE ?', [$search])
                    ->orWhereHas('vendor', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(name) LIKE ?', [$search]);
                    });
            });
        }

        return $query->orderBy('purchased_at', 'desc')->orderBy('id', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Purchase Date',
            'Bill / Invoice No',
            'Vendor / Supplier',
            'Vendor City',
            'Vendor Phone',
            'Total Items Count',
            'Items Purchased Summary',
            'Total Cost (₹)',
            'Payment Mode',
            'Payment Status',
            'Settled Date',
            'Settlement Ref / UTR',
            'Purchased By',
            'Remarks / Notes',
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        $vendorName = $row->vendor?->name ?? $row->supplier_name ?? '—';
        $vendorCity = $row->vendor?->city ?? '—';
        $vendorPhone = $row->vendor?->contact_phone ?? '—';

        $paymentStatus = match ($row->payment_status) {
            'credit'  => 'Credit (Due)',
            'settled' => 'Settled',
            default   => 'Direct Paid',
        };

        // Format items summary
        $itemsSummary = $row->lines->map(function ($line) {
            $name = $line->item?->name ?? "Item #{$line->inventory_item_id}";
            $qty = (float) $line->quantity;
            $unit = $line->item?->unit ?? 'pcs';
            return "{$name} ({$qty} {$unit})";
        })->implode(', ');

        return [
            $this->rowNumber,
            $row->purchased_at ? $row->purchased_at->format('Y-m-d') : '—',
            $row->bill_no ?? '—',
            $vendorName,
            $vendorCity,
            $vendorPhone,
            $row->lines->count(),
            $itemsSummary ?: '—',
            number_format((float) $row->total_cost, 2),
            ucfirst(str_replace('_', ' ', $row->payment_mode ?? 'cash')),
            $paymentStatus,
            $row->settled_at ? $row->settled_at->format('Y-m-d') : ($row->settlement?->settlement_date ? $row->settlement->settlement_date->format('Y-m-d') : '—'),
            $row->settlement?->reference_number ?? '—',
            $row->purchasedBy?->name ?? '—',
            $row->remarks ?? '—',
        ];
    }
}
