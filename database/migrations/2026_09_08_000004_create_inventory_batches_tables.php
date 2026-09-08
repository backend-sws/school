<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. inventory_batches table
        Schema::create('inventory_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->string('batch_no', 100);
            $table->unsignedBigInteger('purchase_line_id')->nullable();
            $table->foreign('purchase_line_id')->references('id')->on('inventory_purchase_lines')->nullOnDelete();
            $table->decimal('received_quantity', 12, 3);
            $table->decimal('remaining_quantity', 12, 3);
            $table->decimal('unit_cost', 12, 2)->default(0);
            $table->date('received_at');
            $table->string('supplier_name', 200)->nullable();
            $table->string('status', 20)->default('active'); // active, exhausted
            $table->timestamps();

            $table->index(['institution_id', 'inventory_item_id', 'status', 'received_at'], 'inv_batches_fifo_idx');
        });

        // 2. inventory_issue_batches pivot table (tracks FIFO consumption per issue)
        Schema::create('inventory_issue_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_issue_id')->constrained('inventory_issues')->cascadeOnDelete();
            $table->foreignId('inventory_batch_id')->constrained('inventory_batches')->cascadeOnDelete();
            $table->decimal('quantity', 12, 3);
            $table->decimal('unit_cost', 12, 2)->default(0);
            $table->decimal('amount', 14, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['inventory_issue_id']);
            $table->index(['inventory_batch_id']);
        });

        // 3. Add total_cost and unit_cost to inventory_issues if not already present
        Schema::table('inventory_issues', function (Blueprint $table) {
            if (!Schema::hasColumn('inventory_issues', 'total_cost')) {
                $table->decimal('total_cost', 14, 2)->default(0)->after('returned_quantity');
            }
            if (!Schema::hasColumn('inventory_issues', 'unit_cost')) {
                $table->decimal('unit_cost', 12, 2)->default(0)->after('total_cost');
            }
        });

        // 4. Seed initial batches from existing purchases
        $existingPurchases = DB::table('inventory_purchase_lines')
            ->join('inventory_purchases', 'inventory_purchase_lines.inventory_purchase_id', '=', 'inventory_purchases.id')
            ->select(
                'inventory_purchase_lines.id as line_id',
                'inventory_purchases.institution_id',
                'inventory_purchase_lines.inventory_item_id',
                'inventory_purchase_lines.quantity',
                'inventory_purchase_lines.unit_cost',
                'inventory_purchases.bill_no',
                'inventory_purchases.supplier_name',
                'inventory_purchases.purchased_at'
            )
            ->get();

        foreach ($existingPurchases as $p) {
            DB::table('inventory_batches')->insert([
                'institution_id'    => $p->institution_id,
                'inventory_item_id' => $p->inventory_item_id,
                'batch_no'          => $p->bill_no ?: ('PUR-LINE-' . $p->line_id),
                'purchase_line_id'  => $p->line_id,
                'received_quantity' => $p->quantity,
                'remaining_quantity'=> $p->quantity,
                'unit_cost'         => $p->unit_cost ?: 0,
                'received_at'       => $p->purchased_at,
                'supplier_name'     => $p->supplier_name,
                'status'            => $p->quantity > 0 ? 'active' : 'exhausted',
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }

        // 5. Seed opening batches for existing items with stock not covered by purchases
        $items = DB::table('inventory_items')->where('current_quantity', '>', 0)->get();
        foreach ($items as $item) {
            $batchSum = DB::table('inventory_batches')
                ->where('inventory_item_id', $item->id)
                ->sum('remaining_quantity');

            $diff = (float)$item->current_quantity - (float)$batchSum;
            if ($diff > 0.001) {
                DB::table('inventory_batches')->insert([
                    'institution_id'    => $item->institution_id,
                    'inventory_item_id' => $item->id,
                    'batch_no'          => 'OPENING-STOCK',
                    'purchase_line_id'  => null,
                    'received_quantity' => $diff,
                    'remaining_quantity'=> $diff,
                    'unit_cost'         => $item->purchase_price ?: 0,
                    'received_at'       => $item->created_at ? date('Y-m-d', strtotime($item->created_at)) : now()->toDateString(),
                    'supplier_name'     => 'Opening Balance',
                    'status'            => 'active',
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_issue_batches');
        Schema::dropIfExists('inventory_batches');
        Schema::table('inventory_issues', function (Blueprint $table) {
            if (Schema::hasColumn('inventory_issues', 'total_cost')) {
                $table->dropColumn(['total_cost', 'unit_cost']);
            }
        });
    }
};
