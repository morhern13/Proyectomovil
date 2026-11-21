<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Parent categories
        $calzado = Category::create([
            'company_id' => 1,
            'name' => 'Calzado',
            'slug' => 'calzado',
            'description' => 'Zapatos, tenis y zapatillas',
            'color' => '#0F766E',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $ropa = Category::create([
            'company_id' => 1,
            'name' => 'Ropa',
            'slug' => 'ropa',
            'description' => 'Ropa para dama, caballero y niños',
            'color' => '#F59E0B',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $accesorios = Category::create([
            'company_id' => 1,
            'name' => 'Accesorios',
            'slug' => 'accesorios',
            'description' => 'Carteras, relojes, cinturones y más',
            'color' => '#6366F1',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Subcategories - Calzado
        Category::create(['company_id' => 1, 'parent_id' => $calzado->id, 'name' => 'Tenis Deportivos', 'slug' => 'tenis-deportivos', 'description' => 'Tenis para running y deportes', 'color' => '#0D9488', 'is_active' => true, 'sort_order' => 1]);
        Category::create(['company_id' => 1, 'parent_id' => $calzado->id, 'name' => 'Zapatos Casuales', 'slug' => 'zapatos-casuales', 'description' => 'Zapatos para uso diario', 'color' => '#0D9488', 'is_active' => true, 'sort_order' => 2]);
        Category::create(['company_id' => 1, 'parent_id' => $calzado->id, 'name' => 'Zapatos Formales', 'slug' => 'zapatos-formales', 'description' => 'Zapatos de vestir', 'color' => '#0D9488', 'is_active' => true, 'sort_order' => 3]);
        Category::create(['company_id' => 1, 'parent_id' => $calzado->id, 'name' => 'Chanclas y Sandalias', 'slug' => 'chanclas-sandalias', 'description' => 'Calzado abierto', 'color' => '#0D9488', 'is_active' => true, 'sort_order' => 4]);
        Category::create(['company_id' => 1, 'parent_id' => $calzado->id, 'name' => 'Botas', 'slug' => 'botas', 'description' => 'Botas de todo tipo', 'color' => '#0D9488', 'is_active' => true, 'sort_order' => 5]);

        // Subcategories - Ropa
        Category::create(['company_id' => 1, 'parent_id' => $ropa->id, 'name' => 'Camisetas y Polos', 'slug' => 'camisetas-polos', 'description' => 'Camisetas, polos y franelas', 'color' => '#D97706', 'is_active' => true, 'sort_order' => 1]);
        Category::create(['company_id' => 1, 'parent_id' => $ropa->id, 'name' => 'Pantalones y Jeans', 'slug' => 'pantalones-jeans', 'description' => 'Pantalones, jeans y shorts', 'color' => '#D97706', 'is_active' => true, 'sort_order' => 2]);
        Category::create(['company_id' => 1, 'parent_id' => $ropa->id, 'name' => 'Chaquetas y Abrigos', 'slug' => 'chaquetas-abrigos', 'description' => 'Chamarras, chaquetas y abrigos', 'color' => '#D97706', 'is_active' => true, 'sort_order' => 3]);
        Category::create(['company_id' => 1, 'parent_id' => $ropa->id, 'name' => 'Vestidos y Faldas', 'slug' => 'vestidos-faldas', 'description' => 'Vestidos, faldas y enterizos', 'color' => '#D97706', 'is_active' => true, 'sort_order' => 4]);
        Category::create(['company_id' => 1, 'parent_id' => $ropa->id, 'name' => 'Ropa Interior', 'slug' => 'ropa-interior', 'description' => 'Ropa íntima y pijamas', 'color' => '#D97706', 'is_active' => true, 'sort_order' => 5]);

        // Subcategories - Accesorios
        Category::create(['company_id' => 1, 'parent_id' => $accesorios->id, 'name' => 'Carteras y Mochilas', 'slug' => 'carteras-mochilas', 'description' => 'Bolsos, carteras y mochilas', 'color' => '#4F46E5', 'is_active' => true, 'sort_order' => 1]);
        Category::create(['company_id' => 1, 'parent_id' => $accesorios->id, 'name' => 'Cinturones', 'slug' => 'cinturones', 'description' => 'Cinturones y correas', 'color' => '#4F46E5', 'is_active' => true, 'sort_order' => 2]);
        Category::create(['company_id' => 1, 'parent_id' => $accesorios->id, 'name' => 'Relojes', 'slug' => 'relojes', 'description' => 'Relojes de pulsera', 'color' => '#4F46E5', 'is_active' => true, 'sort_order' => 3]);
        Category::create(['company_id' => 1, 'parent_id' => $accesorios->id, 'name' => 'Gorras y Sombreros', 'slug' => 'gorras-sombreros', 'description' => 'Gorras, viseras y sombreros', 'color' => '#4F46E5', 'is_active' => true, 'sort_order' => 4]);
        Category::create(['company_id' => 1, 'parent_id' => $accesorios->id, 'name' => 'Medias', 'slug' => 'medias', 'description' => 'Calcetines y medias', 'color' => '#4F46E5', 'is_active' => true, 'sort_order' => 5]);
    }
}
