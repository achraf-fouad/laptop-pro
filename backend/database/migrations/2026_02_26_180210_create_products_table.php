<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // {fr: "...", en: "...", ar: "..."}
            $table->json('description');
            $table->decimal('price', 12, 2);
            $table->decimal('original_price', 12, 2)->nullable();
            $table->string('category');
            $table->string('brand')->nullable();
            $table->string('image')->nullable();
            $table->string('stock_status')->default('in_stock');
            $table->integer('stock_quantity')->default(0);
            $table->float('rating')->default(0);
            $table->integer('review_count')->default(0);
            $table->json('specs')->nullable();
            $table->json('compatibility')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
