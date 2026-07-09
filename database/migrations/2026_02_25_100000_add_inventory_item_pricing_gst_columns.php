<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->decimal('purchase_price', 12, 2)->nullable()->after('selling_price');
            $table->decimal('margin_percentage', 10, 2)->nullable()->after('purchase_price');
            $table->decimal('gst_rate', 5, 2)->nullable()->after('margin_percentage');
            $table->string('hsn_code', 20)->nullable()->after('gst_rate');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn(['purchase_price', 'margin_percentage', 'gst_rate', 'hsn_code']);
        });
    }
};
