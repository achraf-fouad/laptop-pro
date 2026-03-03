<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hierarchy = [
            [
                'name' => ['en' => 'Laptops & Portables', 'fr' => 'Ordinateurs Portables & Laptop', 'ar' => 'الحواسيب المحمولة'],
                'children' => []
            ],
            [
                'name' => ['en' => 'PC Components', 'fr' => 'Composants PC', 'ar' => 'مكونات الحاسوب'],
                'children' => [
                    ['name' => ['en' => 'Motherboards', 'fr' => 'Carte mère', 'ar' => 'لوحات أم']],
                    ['name' => ['en' => 'Processors (Intel / AMD)', 'fr' => 'Processeur (Intel / AMD)', 'ar' => 'معالجات']],
                    ['name' => ['en' => 'Graphics Cards (GPU)', 'fr' => 'Carte graphique (GPU)', 'ar' => 'بطاقات شاشة']],
                    ['name' => ['en' => 'Power Supplies (PSU)', 'fr' => 'Alimentation (PSU)', 'ar' => 'مزودات طاقة']],
                    ['name' => ['en' => 'PC Cases', 'fr' => 'Boîtier PC', 'ar' => 'صناديق حاسوب']],
                    ['name' => ['en' => 'Fans & Cooling (Air / Water)', 'fr' => 'Ventilateurs & refroidissement (Air / Watercooling)', 'ar' => 'تبريد ومراوح']],
                    ['name' => ['en' => 'Thermal Paste', 'fr' => 'Pâte thermique', 'ar' => 'معجون حراري']],
                ]
            ],
            [
                'name' => ['en' => 'Spare Parts', 'fr' => 'Pièces de rechange', 'ar' => 'قطع غيار'],
                'children' => [
                    ['name' => ['en' => 'Batteries', 'fr' => 'Batterie', 'ar' => 'بطاريات']],
                    ['name' => ['en' => 'Keyboards', 'fr' => 'Clavier', 'ar' => 'لوحات مفاتيح']],
                    ['name' => ['en' => 'RAM', 'fr' => 'Ram', 'ar' => 'ذاكرة']],
                    ['name' => ['en' => 'Displays', 'fr' => 'Afficheur', 'ar' => 'شاشات عرض']],
                    ['name' => ['en' => 'Chargers', 'fr' => 'Chargeur', 'ar' => 'شواحن']],
                ]
            ],
            [
                'name' => ['en' => 'Screens & Monitors', 'fr' => 'Écrans & Moniteur pc', 'ar' => 'شاشات وحواسب'],
                'children' => []
            ],
            [
                'name' => ['en' => 'PC Peripherals', 'fr' => 'PÉRIPHÉRIQUE PC', 'ar' => 'ملحقات الحاسوب'],
                'children' => [
                    ['name' => ['en' => 'Keyboards', 'fr' => 'Clavier', 'ar' => 'لوحات مفاتيح']],
                    ['name' => ['en' => 'Mice', 'fr' => 'Souris', 'ar' => 'فأرة']],
                    ['name' => ['en' => 'Headsets', 'fr' => 'Casque', 'ar' => 'سماعات']],
                    ['name' => ['en' => 'Webcams', 'fr' => 'Webcams', 'ar' => 'كاميرات الويب']],
                    ['name' => ['en' => 'Mouse Pads', 'fr' => 'Tapis de souris', 'ar' => 'لوحات فأرة']],
                ]
            ],
            [
                'name' => ['en' => 'Chairs', 'fr' => 'CHAISES', 'ar' => 'كراسي'],
                'children' => []
            ],
            [
                'name' => ['en' => 'Bags & Cases', 'fr' => 'Cartables', 'ar' => 'حقائب'],
                'children' => [
                    ['name' => ['en' => 'Backpacks', 'fr' => 'Sac à dos', 'ar' => 'حقائب ظهر']],
                    ['name' => ['en' => 'Sleeves', 'fr' => 'Sacoche', 'ar' => 'حقائب يد']],
                    ['name' => ['en' => 'Housings', 'fr' => 'Housse', 'ar' => 'أغطية']],
                ]
            ],
            [
                'name' => ['en' => 'Storage', 'fr' => 'STOCKAGE', 'ar' => 'تخزين'],
                'children' => [
                    ['name' => ['en' => 'SSD', 'fr' => 'SSD', 'ar' => 'SSD']],
                    ['name' => ['en' => 'HDD', 'fr' => 'HDD', 'ar' => 'HDD']],
                    ['name' => ['en' => 'External Drives', 'fr' => 'externe', 'ar' => 'قرص خارجي']],
                    ['name' => ['en' => 'Drive Accessories', 'fr' => 'Accessoires disque dur', 'ar' => 'ملحقات الأقراص']],
                ]
            ],
            [
                'name' => ['en' => 'Cables', 'fr' => 'CÂBLES', 'ar' => 'كابلات'],
                'children' => []
            ],
            [
                'name' => ['en' => 'Printers & Scanners', 'fr' => 'IMPRIMANTE & SCANNER', 'ar' => 'طابعات وماسحات'],
                'children' => []
            ],
            [
                'name' => ['en' => 'Consoles & Gaming', 'fr' => 'CONSOLES & JEUX', 'ar' => 'كنسول وألعاب'],
                'children' => [
                    ['name' => ['en' => 'Consoles', 'fr' => 'Console', 'ar' => 'كنسول']],
                    ['name' => ['en' => 'Video Games', 'fr' => 'Jeux vidéo', 'ar' => 'ألعاب فيديو']],
                ]
            ],
            [
                'name' => ['en' => 'Camera Universe', 'fr' => 'UNIVERS CAMÉRA', 'ar' => 'عالم الكاميرات'],
                'children' => []
            ],
        ];

        foreach ($hierarchy as $parentData) {
            $parent = Category::create([
                'name' => $parentData['name'],
                'slug' => Str::slug($parentData['name']['en']),
                'parent_id' => null,
            ]);

            if (isset($parentData['children'])) {
                foreach ($parentData['children'] as $childData) {
                    $childSlug = Str::slug($parentData['name']['en'] . '-' . $childData['name']['en']);
                    Category::create([
                        'name' => $childData['name'],
                        'slug' => $childSlug,
                        'parent_id' => $parent->id,
                    ]);
                }
            }
        }
    }
}
