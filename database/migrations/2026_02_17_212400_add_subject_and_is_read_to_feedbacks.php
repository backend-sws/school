<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            if (!Schema::hasColumn('feedbacks', 'subject')) {
                $table->string('subject', 500)->nullable();
            }
            if (!Schema::hasColumn('feedbacks', 'is_read')) {
                $table->boolean('is_read')->default(false);
            }
            if (!Schema::hasColumn('feedbacks', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            $cols = ['subject', 'is_read'];
            if (Schema::hasColumn('feedbacks', 'updated_at')) {
                $cols[] = 'updated_at';
            }
            $table->dropColumn($cols);
        });
    }
};
