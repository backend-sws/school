<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('library_books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('title', 300);
            $table->string('author', 200)->nullable();
            $table->string('isbn', 50)->nullable();
            $table->string('edition', 50)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['isbn']);
            $table->index(['is_active']);
        });

        Schema::create('library_copies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('library_book_id')->constrained()->cascadeOnDelete();
            $table->string('barcode', 80)->nullable();
            $table->string('shelf_location', 100)->nullable();
            $table->string('condition', 50)->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'barcode']);
            $table->index(['institution_id']);
            $table->index(['library_book_id']);
            $table->index(['is_available']);
        });

        Schema::create('library_issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('library_copy_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('issued_at');
            $table->date('due_at');
            $table->timestamp('returned_at')->nullable();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['library_copy_id']);
            $table->index(['user_id']);
            $table->index(['returned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('library_issues');
        Schema::dropIfExists('library_copies');
        Schema::dropIfExists('library_books');
    }
};
