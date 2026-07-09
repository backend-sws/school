<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * PostgreSQL does not allow NULL in primary key columns.
 * Replace composite PK with an id column so scope_type/scope_id can remain nullable.
 */
return new class extends Migration {
    public function up(): void
    {
    }

    public function down(): void
    {
    }
};
