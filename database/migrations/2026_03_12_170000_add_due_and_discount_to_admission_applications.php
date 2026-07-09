<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('admission_applications', 'discount_amount')) {
                $table->decimal('discount_amount', 12, 2)->default(0)->after('amount');
            }
            if (!Schema::hasColumn('admission_applications', 'discount_reason')) {
                $table->string('discount_reason', 255)->nullable()->after('discount_amount');
            }
            if (!Schema::hasColumn('admission_applications', 'due_amount')) {
                $table->decimal('due_amount', 12, 2)->default(0)->after('online_transaction_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn(['discount_amount', 'discount_reason', 'due_amount']);
        });
    }
};
