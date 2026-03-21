<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Category;
use App\Models\Review;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use DOMDocument;
use DOMXPath;

class ScrapeProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scrape-products {--clear : Clear existing products and categories} {--limit= : Limit number of products per category}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape products from accesscomputer.ma and add them to the database';

    protected $baseUrl = 'https://accesscomputer.ma';

    protected $categoriesToScrape = [
        'laptops-portables' => 'https://accesscomputer.ma/fr/pc-portable-maroc-%C3%A0-prix-pas-cher',
        'pc-components-motherboards' => 'https://accesscomputer.ma/fr/categorie/composants',
        'pc-components-processors-intel-amd' => 'https://accesscomputer.ma/fr/categorie/composants/processeur',
        'pc-components-graphics-cards-gpu' => 'https://accesscomputer.ma/fr/categorie/composants/carte-graphique',
        'pc-components-power-supplies-psu' => 'https://accesscomputer.ma/fr/categorie/composants/bloc-d-alimentation',
        'pc-components-pc-cases' => 'https://accesscomputer.ma/fr/boitiers-pc',
        'pc-components-fans-cooling-air-water' => 'https://accesscomputer.ma/fr/categorie/composants',
        'pc-components-thermal-paste' => 'https://accesscomputer.ma/fr/categorie/composants',
        'spare-parts-batteries' => 'https://accesscomputer.ma/fr/batterie-pc-portable',
        'spare-parts-keyboards' => 'https://accesscomputer.ma/fr/pc-portable-maroc-%C3%A0-prix-pas-cher',
        'spare-parts-ram' => 'https://accesscomputer.ma/fr/categorie/composants/ram',
        'spare-parts-displays' => 'https://accesscomputer.ma/fr/categorie/ecran',
        'spare-parts-chargers' => 'https://accesscomputer.ma/fr/chargeur-pc-portable',
        'screens-monitors' => 'https://accesscomputer.ma/fr/categorie/ecran',
        'pc-peripherals-keyboards' => 'https://accesscomputer.ma/fr/souris-clavier',
        'pc-peripherals-mice' => 'https://accesscomputer.ma/fr/souris-clavier',
        'pc-peripherals-headsets' => 'https://accesscomputer.ma/fr/casque-micro',
        'pc-peripherals-webcams' => 'https://accesscomputer.ma/fr/webcam',
        'pc-peripherals-mouse-pads' => 'https://accesscomputer.ma/fr/souris-clavier',
        'chairs' => 'https://accesscomputer.ma/fr/chaise-gamer',
        'bags-cases-backpacks' => 'https://accesscomputer.ma/fr/sacs-sacoches',
        'bags-cases-messenger-bags' => 'https://accesscomputer.ma/fr/sacs-sacoches',
        'bags-cases-sleeves' => 'https://accesscomputer.ma/fr/sacs-sacoches',
        'storage-ssd' => 'https://accesscomputer.ma/fr/categorie/composants/disque-dur/ssd',
        'storage-hdd' => 'https://accesscomputer.ma/fr/categorie/composants/disque-dur',
        'storage-external-storage' => 'https://accesscomputer.ma/fr/stockage-externe',
        'storage-drive-accessories' => 'https://accesscomputer.ma/fr/categorie/composants/disque-dur',
        'cables' => 'https://accesscomputer.ma/fr/reseaux-connectique',
        'printers-scanners' => 'https://accesscomputer.ma/fr/categorie/impression',
        'consoles-gaming-consoles' => 'https://accesscomputer.ma/fr/consoles',
        'consoles-gaming-video-games' => 'https://accesscomputer.ma/fr/consoles',
        'camera-universe' => 'https://accesscomputer.ma/fr/webcam',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('clear')) {
            $this->info('Clearing existing products, reviews, and orders...');
            Schema::disableForeignKeyConstraints();
            OrderItem::truncate();
            Review::truncate();
            Product::truncate();
            Schema::enableForeignKeyConstraints();
            $this->info('Cleanup done.');
        }

        foreach ($this->categoriesToScrape as $slug => $url) {
            $this->info("Scraping for category slug: $slug");
            $category = Category::where('slug', $slug)->first();
            
            if (!$category) {
                $this->warn("Category with slug $slug not found. Skipping...");
                continue;
            }

            try {
                $this->scrapeCategory($url, $category);
            } catch (\Exception $e) {
                $this->error("Error scraping category $slug: " . $e->getMessage());
            }
        }

        $this->info('Scraping completed successfully!');
    }

    protected function scrapeCategory($url, $category)
    {
        $page = 1;
        $count = 0;
        $limit = $this->option('limit');

        while (true) {
            $this->info("  Page $page...");
            try {
                $response = Http::timeout(30)->get($url . "?page=$page");
                
                if (!$response->successful()) {
                    break;
                }

                $dom = new DOMDocument();
                @$dom->loadHTML($response->body());
                $xpath = new DOMXPath($dom);

                // Find product links
                $productNodes = $xpath->query("//a[contains(@class, 'sylius-product-name')]");
                
                if ($productNodes->length === 0) {
                    $productNodes = $xpath->query("//div[contains(@class, 'flex-col')]//a[contains(@href, '/fr/')]");
                }

                if ($productNodes->length === 0) {
                    break;
                }

                $productLinks = [];
                foreach ($productNodes as $node) {
                    $href = $node->getAttribute('href');
                    if (Str::startsWith($href, '/fr/') && !Str::contains($href, '/categorie/')) {
                        $productLinks[] = $this->baseUrl . $href;
                    }
                }

                $productLinks = array_unique($productLinks);

                foreach ($productLinks as $link) {
                    if ($limit && $count >= $limit) return;
                    
                    try {
                        $this->scrapeProduct($link, $category);
                        $count++;
                        usleep(100000); // 100ms delay to be gentle
                    } catch (\Exception $e) {
                        $this->warn("    Failed to scrape product $link: " . $e->getMessage());
                    }
                }

                // Check if there is a "Next" page
                $nextPage = $xpath->query("//a[contains(@class, 'next')]");
                if ($nextPage->length === 0) {
                    break;
                }

                $page++;
                if ($page > 5) break; // Safeguard
            } catch (\Exception $e) {
                $this->error("  Error on page $page: " . $e->getMessage());
                break;
            }
        }
    }

    protected function scrapeProduct($url, $category)
    {
        $this->info("    Scraping product: $url");
        $response = Http::timeout(30)->get($url);
        
        if (!$response->successful()) return;

        $dom = new DOMDocument();
        @$dom->loadHTML($response->body());
        $xpath = new DOMXPath($dom);

        // Name
        $nameNode = $xpath->query("//h1")->item(0);
        $name = $nameNode ? trim($nameNode->nodeValue) : 'Unknown Product';

        // Skip if name is empty
        if (empty($name)) return;

        // Check for duplicates
        if (Product::where('name->fr', $name)->exists()) {
            $this->info("    Product already exists. Skipping...");
            return;
        }

        // Price
        $priceNode = $xpath->query("//span[contains(@class, 'text-primary') and contains(@class, 'font-bold')]")->item(0);
        $priceStr = $priceNode ? trim($priceNode->nodeValue) : '0';
        $price = (float) preg_replace('/[^0-9.]/', '', str_replace(',', '.', str_replace(' ', '', $priceStr)));

        // Original Price
        $oldPriceNode = $xpath->query("//span[contains(@class, 'line-through')]")->item(0);
        $oldPriceStr = $oldPriceNode ? trim($oldPriceNode->nodeValue) : null;
        $originalPrice = $oldPriceStr ? (float) preg_replace('/[^0-9.]/', '', str_replace(',', '.', str_replace(' ', '', $oldPriceStr))) : null;

        // Description
        $descNode = $xpath->query("//div[contains(@class, 'product-description')]")->item(0);
        $description = $descNode ? trim($descNode->nodeValue) : '';

        // Images
        $imageNodes = $xpath->query("//img[contains(@src, 'media/cache/resolve')]");
        $images = [];
        foreach ($imageNodes as $node) {
            $imgUrl = $node->getAttribute('src');
            if (Str::contains($imgUrl, 'sylius_shop_product_thumbnail') || Str::contains($imgUrl, 'sylius_shop_product_large_thumbnail')) {
                $localPath = $this->downloadImage($imgUrl);
                if ($localPath) {
                    $images[] = $localPath;
                }
            }
        }
        $images = array_unique($images);

        // Specs
        $specs = [];
        $brand = 'Unknown';
        $specRows = $xpath->query("//table[contains(@class, 'table')]//tr");
        foreach ($specRows as $row) {
            $tds = $xpath->query(".//td", $row);
            if ($tds->length >= 2) {
                $key = trim($tds->item(0)->nodeValue);
                $val = trim($tds->item(1)->nodeValue);
                $specs[$key] = $val;

                if (Str::lower($key) === 'marque') {
                    $brand = $val;
                }
            }
        }

        // Create product
        Product::create([
            'name' => [
                'fr' => $name,
                'en' => $name,
                'ar' => $name,
            ],
            'description' => [
                'fr' => $description,
                'en' => $description,
                'ar' => $description,
            ],
            'price' => $price,
            'original_price' => $originalPrice,
            'images' => $images,
            'category_id' => $category->id,
            'brand' => $brand,
            'stock' => rand(5, 50),
            'stock_status' => 'in_stock',
            'rating' => 4.0 + (rand(0, 10) / 10),
            'review_count' => rand(0, 100),
            'specs' => $specs,
            'featured' => rand(0, 10) > 8,
        ]);
    }

    protected function downloadImage($url)
    {
        try {
            if (Str::startsWith($url, '//')) {
                $url = 'https:' . $url;
            } elseif (Str::startsWith($url, '/')) {
                $url = $this->baseUrl . $url;
            }

            $response = Http::get($url);
            if (!$response->successful()) return null;

            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
            $filename = 'products/' . Str::random(20) . '.' . $extension;
            
            Storage::disk('public')->put($filename, $response->body());
            
            return 'storage/' . $filename;
        } catch (\Exception $e) {
            return null;
        }
    }
}
