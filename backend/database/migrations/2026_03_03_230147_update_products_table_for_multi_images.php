<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Update prices to 10,2 as requested
            $table->decimal('price', 10, 2)->change();
            $table->decimal('original_price', 10, 2)->nullable()->change();

            // Add new images column for JSON array
            $table->json('images')->nullable()->after('original_price');

            // Rename and update stock columns
            $table->renameColumn('stock_quantity', 'stock');

            // Recreate stock_status as enum for strictness
            $table->dropColumn('stock_status');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->enum('stock_status', ['in_stock', 'low_stock', 'out_of_stock'])
                ->default('in_stock')
                ->after('stock');
        });

        Schema::table('products', function (Blueprint $table) {
            // Drop old image columns
            $table->dropColumn(['image', 'image_2', 'image_3']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->change();
            $table->decimal('original_price', 12, 2)->nullable()->change();
            $table->dropColumn('images');
            $table->renameColumn('stock', 'stock_quantity');
            $table->dropColumn('stock_status');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('stock_status')->default('in_stock')->after('stock_quantity');
            $table->string('image')->nullable()->after('brand');
            $table->string('image_2')->nullable();
            $table->string('image_3')->nullable();
        });
    }
};
