<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('products', function (Blueprint $table) {
        $table->text('image_2')->nullable()->change();
        $table->text('image_3')->nullable()->change();
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->string('image_2')->nullable()->change();
        $table->string('image_3')->nullable()->change();
    });
}
};
