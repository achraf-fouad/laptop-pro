<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => [
                'fr' => $this->faker->words(3, true) . ' Laptop',
                'en' => $this->faker->words(3, true) . ' Laptop',
                'ar' => $this->faker->words(3, true) . ' حاسوب',
            ],
            'description' => [
                'fr' => $this->faker->sentence(),
                'en' => $this->faker->sentence(),
                'ar' => $this->faker->sentence(),
            ],
            'price' => $this->faker->randomFloat(2, 5000, 30000),
            'original_price' => $this->faker->randomFloat(2, 35000, 50000),
            'stock' => $this->faker->numberBetween(0, 100),
            'stock_status' => $this->faker->randomElement(['in_stock', 'low_stock', 'out_of_stock']),
            'brand' => $this->faker->randomElement(['HP', 'Dell', 'Lenovo', 'Apple', 'Asus']),
            'images' => [
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop',
            ],
            'rating' => $this->faker->randomFloat(1, 1, 5),
            'review_count' => $this->faker->numberBetween(0, 1000),
            'featured' => $this->faker->boolean(),
        ];
    }
}
