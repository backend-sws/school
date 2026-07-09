<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->string('brand_theme', 32)->nullable()
                  ->comment('CSS theme key: royal, nature, vibrant, heritage, etc.');
            $table->string('brand_font', 32)->nullable()
                  ->comment('Font key: serif, display, or null (sans default)');
            $table->string('brand_color', 7)->nullable()
                  ->comment('Custom hex primary color, e.g. #2E7D32');
        });
    }

    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn(['brand_theme', 'brand_font', 'brand_color']);
        });
    }
};
