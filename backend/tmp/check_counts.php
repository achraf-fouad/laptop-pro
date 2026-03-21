<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\Product;

$categories = Category::withCount('products')->get();
echo "Category Counts:\n";
foreach ($categories as $cat) {
    echo "- {$cat->name['fr']} ({$cat->slug}): {$cat->products_count}\n";
}
echo "Total Products: " . Product::count() . "\n";
