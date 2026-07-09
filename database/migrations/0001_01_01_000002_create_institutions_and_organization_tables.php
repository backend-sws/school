<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private static function institutionTypeDefault(): string
    {
        return class_exists(\App\Enums\InstitutionType::class)
            ? \App\Enums\InstitutionType::COLLEGE->value
            : 'college';
    }

    private static function institutionTypeValues(): array
    {
        return class_exists(\App\Enums\InstitutionType::class)
            ? \App\Enums\InstitutionType::values()
            : ['school', 'college', 'coaching', 'university'];
    }

    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('type', 32)->default(self::institutionTypeDefault());
            $table->string('name', 200);
            $table->string('code', 30)->unique()->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 10)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('website', 200)->nullable();
            $table->text('logo_url')->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();
        });

        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            $allowed = implode("','", self::institutionTypeValues());
            DB::statement("ALTER TABLE institutions ADD CONSTRAINT institutions_type_check CHECK (type IN ('{$allowed}'))");
        }

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 30)->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['institution_id', 'code']);
            $table->index(['institution_id']);
        });

        Schema::create('main_streams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 20)->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['institution_id', 'code']);
            $table->index(['institution_id']);
        });

        Schema::create('streams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('main_stream_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 30)->nullable();
            $table->integer('duration_years')->default(4);
            $table->foreignId('department_id')->nullable()->constrained();
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['institution_id', 'code']);
            $table->index(['institution_id']);
            $table->index(['main_stream_id']);
        });

        Schema::create('academic_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained();
            $table->string('name', 50);
            $table->integer('start_year');
            $table->integer('end_year');
            $table->integer('duration_months')->nullable();
            $table->boolean('is_current')->default(false);
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['institution_id', 'start_year', 'end_year']);
            $table->index(['institution_id']);
        });
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE institutions DROP CONSTRAINT IF EXISTS institutions_type_check');
        }
        Schema::dropIfExists('academic_sessions');
        Schema::dropIfExists('streams');
        Schema::dropIfExists('main_streams');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('institutions');
    }
};
