<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['Nike', 'Nike'],
            ['Adidas', 'Adidas'],
            ['Puma', 'Puma'],
            ['Reebok', 'Reebok'],
            ['New Balance', 'New Balance'],
            ['Converse', 'Converse'],
            ['Vans', 'Vans'],
            ['Skechers', 'Skechers'],
            ['Under Armour', 'Under Armour'],
            ['Jordan', 'Jordan'],
            ['Levis', 'Levis'],
            ['Tommy Hilfiger', 'Tommy Hilfiger'],
            ['Polo Ralph Lauren', 'Polo Ralph Lauren'],
            ['Lacoste', 'Lacoste'],
            ['Zara', 'Zara'],
            ['H&M', 'H&M'],
            ['Mango', 'Mango'],
            ['Forever 21', 'Forever 21'],
            ['Guess', 'Guess'],
            ['Calvin Klein', 'Calvin Klein'],
        ];

        foreach ($brands as $i => [$name]) {
            Brand::create([
                'company_id' => 1,
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => "Marca $name",
                'is_active' => true,
            ]);
        }
    }
}
