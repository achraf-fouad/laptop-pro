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
        // Map old statuses to new ones before changing the column type
        DB::table('orders')->where('status', 'confirmed')->update(['status' => 'paid']);
        DB::table('orders')->where('status', 'declined')->update(['status' => 'cancelled']);
        // Any other unrecognized status to pending
        DB::table('orders')->whereNotIn('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])->update(['status' => 'pending']);

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('total_amount');
            }
            $table->enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'payment_method')) {
                $table->dropColumn('payment_method');
            }
            $table->string('status')->default('pending')->change();
        });
    }
};
