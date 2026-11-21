<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supplier_id')->nullable();
            $table->string('code', 50)->unique();
            $table->string('barcode', 100)->nullable()->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('unit')->default('unidad');
            $table->decimal('cost', 12, 2)->default(0);
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('price2', 12, 2)->nullable();
            $table->decimal('price3', 12, 2)->nullable();
            $table->decimal('price4', 12, 2)->nullable();
            $table->decimal('utility_percent', 5, 2)->default(0);
            $table->decimal('stock', 12, 2)->default(0);
            $table->decimal('stock_min', 12, 2)->default(0);
            $table->decimal('stock_max', 12, 2)->nullable();
            $table->boolean('track_stock')->default(true);
            $table->boolean('has_variants')->default(false);
            $table->string('image')->nullable();
            $table->date('expiration_date')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_id', 'category_id']);
            $table->index(['company_id', 'code']);
            $table->index(['company_id', 'barcode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
