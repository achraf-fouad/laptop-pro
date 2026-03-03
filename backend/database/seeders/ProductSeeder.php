<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => ['fr' => 'Laptop HP ProBook 450 G10', 'en' => 'HP ProBook 450 G10 Laptop', 'ar' => 'حاسوب HP ProBook 450 G10'],
                'description' => [
                    'fr' => 'Ordinateur portable professionnel avec processeur Intel Core i7, 16Go RAM, 512Go SSD. Idéal pour les professionnels exigeants.',
                    'en' => 'Professional laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD. Ideal for demanding professionals.',
                    'ar' => 'حاسوب محمول احترافي بمعالج Intel Core i7، ذاكرة 16 جيجا، قرص SSD 512 جيجا.'
                ],
                'price' => 145000,
                'original_price' => 165000,
                'category' => 'laptops',
                'brand' => 'HP',
                'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.7,
                'review_count' => 124,
                'specs' => ['Processeur' => 'Intel Core i7-1355U', 'RAM' => '16 Go DDR4', 'Stockage' => '512 Go SSD NVMe', 'Écran' => '15.6" Full HD IPS', 'OS' => 'Windows 11 Pro'],
                'compatibility' => [],
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'Lenovo ThinkPad T14s Gen 4', 'en' => 'Lenovo ThinkPad T14s Gen 4', 'ar' => 'Lenovo ThinkPad T14s الجيل الرابع'],
                'description' => [
                    'fr' => 'Le compagnon idéal des professionnels en déplacement. Ultra-léger, performant et sécurisé.',
                    'en' => 'The ideal companion for professionals on the go. Ultra-light, powerful and secure.',
                    'ar' => 'الرفيق المثالي للمهنيين أثناء التنقل. خفيف الوزن وقوي وآمن.'
                ],
                'price' => 198000,
                'category' => 'laptops',
                'brand' => 'Lenovo',
                'image' => 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.8,
                'review_count' => 89,
                'specs' => ['Processeur' => 'Intel Core i7-1365U', 'RAM' => '16 Go LPDDR5', 'Stockage' => '512 Go SSD', 'Écran' => '14" 2.8K OLED', 'OS' => 'Windows 11 Pro'],
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'Écran LCD 15.6" Full HD', 'en' => '15.6" Full HD LCD Screen', 'ar' => 'شاشة LCD 15.6 بوصة Full HD'],
                'description' => [
                    'fr' => 'Écran de remplacement compatible avec la plupart des laptops 15.6 pouces. Résolution Full HD 1920x1080.',
                    'en' => 'Replacement screen compatible with most 15.6-inch laptops. Full HD 1920x1080 resolution.',
                    'ar' => 'شاشة بديلة متوافقة مع معظم الحواسيب المحمولة 15.6 بوصة.'
                ],
                'price' => 12500,
                'original_price' => 15000,
                'category' => 'screens',
                'brand' => 'Generic',
                'image' => 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.5,
                'review_count' => 234,
                'compatibility' => ['HP', 'Dell', 'Lenovo', 'Acer', 'ASUS'],
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'Batterie Laptop Universelle 4400mAh', 'en' => 'Universal Laptop Battery 4400mAh', 'ar' => 'بطارية حاسوب محمول عالمية 4400mAh'],
                'description' => [
                    'fr' => 'Batterie haute capacité compatible avec une large gamme de laptops. Longue durée et fiabilité.',
                    'en' => 'High-capacity battery compatible with a wide range of laptops. Long-lasting and reliable.',
                    'ar' => 'بطارية عالية السعة متوافقة مع مجموعة واسعة من الحواسيب المحمولة.'
                ],
                'price' => 8500,
                'category' => 'batteries',
                'brand' => 'Generic',
                'image' => 'https://images.unsplash.com/photo-1619953942547-233eab5a70d6?w=600&h=400&fit=crop',
                'stock_status' => 'low_stock',
                'rating' => 4.3,
                'review_count' => 167,
                'compatibility' => ['HP Pavilion', 'HP ProBook', 'Dell Inspiron'],
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'RAM 8Go DDR4 3200MHz', 'en' => 'RAM 8GB DDR4 3200MHz', 'ar' => 'ذاكرة رام 8 جيجا DDR4'],
                'description' => [
                    'fr' => 'Mémoire RAM haute performance pour booster votre ordinateur portable.',
                    'en' => 'High performance RAM memory to boost your laptop.',
                    'ar' => 'ذاكرة رام عالية الأداء لزيادة سرعة حاسوبك المحمول.'
                ],
                'price' => 4500,
                'category' => 'ram',
                'brand' => 'Crucial',
                'image' => 'https://images.unsplash.com/photo-1541029071515-84cc54f8439e?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.9,
                'review_count' => 450,
                'featured' => false,
            ],
            [
                'name' => ['fr' => 'SSD Samsung 980 1To NVMe', 'en' => 'SSD Samsung 980 1TB NVMe', 'ar' => 'قرص SSD سامسونج 1 تيرابايت'],
                'description' => [
                    'fr' => 'Profitez de vitesses de transfert incroyables avec le SSD Samsung 980.',
                    'en' => 'Enjoy incredible transfer speeds with the Samsung 980 SSD.',
                    'ar' => 'استمتع بسرعات نقل هائلة مع قرص سامسونج SSD 980.'
                ],
                'price' => 11000,
                'category' => 'ssd',
                'brand' => 'Samsung',
                'image' => 'https://images.unsplash.com/photo-1597872200370-493de239bc5d?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.9,
                'review_count' => 850,
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'Dell XPS 13 9315', 'en' => 'Dell XPS 13 9315', 'ar' => 'Dell XPS 13 9315'],
                'description' => [
                    'fr' => 'L\'ordinateur portable 13 pouces le plus compact et le plus fin de Dell.',
                    'en' => 'Dell\'s most compact and thinnest 13-inch laptop.',
                    'ar' => 'أصغر وأنحف حاسوب محمول من Dell بمقاس 13 بوصة.'
                ],
                'price' => 125000,
                'category' => 'laptops',
                'brand' => 'Dell',
                'image' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.6,
                'review_count' => 45,
                'specs' => ['Processeur' => 'Intel Core i5-1230U', 'RAM' => '8Go LPDDR5', 'Stockage' => '256Go SSD', 'Écran' => '13.4" FHD+'],
                'featured' => false,
            ],
            [
                'name' => ['fr' => 'Souris Sans Fil Logitech M185', 'en' => 'Logitech M185 Wireless Mouse', 'ar' => 'فأرة لاسلكية لوجيتيك M185'],
                'description' => [
                    'fr' => 'Une souris simple et fiable avec sans fil prêt à l\'emploi.',
                    'en' => 'A simple, reliable mouse with plug-and-play wireless.',
                    'ar' => 'فأرة بسيطة وموثوقة مع اتصال لاسلكي جاهز للاستخدام.'
                ],
                'price' => 2500,
                'category' => 'accessories',
                'brand' => 'Logitech',
                'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.4,
                'review_count' => 1200,
                'featured' => false,
            ],
            [
                'name' => ['fr' => 'Chargeur HP 65W Smart AC Adapter', 'en' => 'HP 65W Smart AC Adapter', 'ar' => 'شاحن HP بقوة 65 واط'],
                'description' => [
                    'fr' => 'Alimentez votre ordinateur portable avec un adaptateur secteur HP d\'origine.',
                    'en' => 'Power your laptop with a genuine HP AC adapter.',
                    'ar' => 'قم بتشغيل حاسوبك المحمول باستخدام محول طاقة أصلي من HP.'
                ],
                'price' => 4500,
                'category' => 'chargers',
                'brand' => 'HP',
                'image' => 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.2,
                'review_count' => 88,
                'featured' => false,
            ],
            [
                'name' => ['fr' => 'Chaise Gaming RGB Pro', 'en' => 'Pro RGB Gaming Chair', 'ar' => 'كرسي ألعاب RGB برو'],
                'description' => [
                    'fr' => 'Confort ultime avec éclairage RGB intégré et support lombaire.',
                    'en' => 'Ultimate comfort with integrated RGB lighting and lumbar support.',
                    'ar' => 'راحة فائقة مع إضاءة RGB مدمجة ودعم أسفل الظهر.'
                ],
                'price' => 25000,
                'category' => 'chairs',
                'brand' => 'Generic',
                'image' => 'https://images.unsplash.com/photo-1598550476439-6847785fce6e?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.8,
                'review_count' => 45,
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'Canon EOS R5 Mirrorless', 'en' => 'Canon EOS R5 Mirrorless', 'ar' => 'كانون EOS R5 بدون مرآة'],
                'description' => [
                    'fr' => 'Appareil photo plein format 45MP avec vidéo 8K.',
                    'en' => '45MP full-frame camera with 8K video.',
                    'ar' => 'كاميرا إطار كامل بدقة 45 ميجابكسل مع فيديو 8K.'
                ],
                'price' => 38000,
                'category' => 'camera',
                'brand' => 'Canon',
                'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.9,
                'review_count' => 12,
                'featured' => true,
            ],
            [
                'name' => ['fr' => 'IMPRIMANTE HP LASERJET PRO', 'en' => 'HP LASERJET PRO PRINTER', 'ar' => 'طابعة HP ليزر جيت برو'],
                'description' => [
                    'fr' => 'Imprimante laser monochrome rapide et fiable pour le bureau.',
                    'en' => 'Fast and reliable monochrome laser printer for the office.',
                    'ar' => 'طابعة ليزر أحادية اللون سريعة وموثوقة للمكتب.'
                ],
                'price' => 32000,
                'category' => 'printers',
                'brand' => 'HP',
                'image' => 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 4.5,
                'review_count' => 67,
                'featured' => false,
            ],
            [
                'name' => ['fr' => 'PlayStation 5 Console', 'en' => 'PlayStation 5 Console', 'ar' => 'جهاز بلايستيشن 5'],
                'description' => [
                    'fr' => 'La nouvelle génération de jeux avec des graphismes incroyables.',
                    'en' => 'Next generation gaming with incredible graphics.',
                    'ar' => 'الجيل التالي من الألعاب مع رسومات مذهلة.'
                ],
                'price' => 65000,
                'category' => 'consoles',
                'brand' => 'Sony',
                'image' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop',
                'stock_status' => 'in_stock',
                'rating' => 5.0,
                'review_count' => 450,
                'featured' => true,
            ]
        ];

        foreach ($products as $productData) {
            // Map 'image' to 'images' array
            if (isset($productData['image'])) {
                $productData['images'] = [$productData['image']];
                unset($productData['image']);
            }

            // Add default stock if missing
            if (!isset($productData['stock'])) {
                $productData['stock'] = 10;
            }

            // Find category by old string name mapping
            $categorySlug = $this->mapOldCategoryToNew($productData['category']);
            $category = \App\Models\Category::where('slug', $categorySlug)->first();

            if ($category) {
                $productData['category_id'] = $category->id;
            }

            unset($productData['category']); // Remove old category string

            Product::create($productData);
        }
    }

    private function mapOldCategoryToNew(string $oldCategory): string
    {
        $map = [
            'laptops' => 'laptops-portables',
            'screens' => 'screens-monitors',
            'batteries' => 'spare-parts-batteries',
            'ram' => 'spare-parts-ram',
            'ssd' => 'storage-ssd',
            'accessories' => 'pc-peripherals-mice',
            'chargers' => 'spare-parts-chargers',
            'keyboards' => 'pc-peripherals-keyboards',
            'cooling' => 'pc-components-fans-cooling-air-water',
            'chairs' => 'chairs',
            'camera' => 'camera-universe',
            'printers' => 'printers-scanners',
            'consoles' => 'consoles-gaming',
        ];

        return $map[$oldCategory] ?? $oldCategory;
    }
}
