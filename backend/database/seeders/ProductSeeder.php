<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $products = [
            // Tenis Deportivos (category_id 3)
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 1, 'code' => 'TEN-NIK-001', 'barcode' => '884411116789', 'name' => 'Nike Air Max 90', 'description' => 'Tenis Nike Air Max 90 originales', 'cost' => 3200, 'price' => 5495, 'stock' => 25, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 1, 'code' => 'TEN-NIK-002', 'barcode' => '884411116790', 'name' => 'Nike Revolution 7', 'description' => 'Tenis Nike Revolution 7 para running', 'cost' => 2800, 'price' => 4595, 'stock' => 40, 'stock_min' => 10, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 2, 'code' => 'TEN-ADI-001', 'barcode' => '884411116791', 'name' => 'Adidas Runfalcon 5', 'description' => 'Tenis Adidas Runfalcon 5', 'cost' => 2500, 'price' => 4295, 'stock' => 18, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 3, 'code' => 'TEN-PUM-001', 'barcode' => '884411116792', 'name' => 'Puma Smash v3', 'description' => 'Tenis Puma Smash v3 casuales', 'cost' => 2100, 'price' => 3795, 'stock' => 30, 'stock_min' => 8, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 7, 'code' => 'TEN-VAN-001', 'barcode' => '884411116793', 'name' => 'Vans Old Skool', 'description' => 'Tenis Vans Old Skool clásicos', 'cost' => 1900, 'price' => 3495, 'stock' => 3, 'stock_min' => 10, 'created_at' => $now],
            // Zapatos Casuales (category_id 4)
            ['company_id' => 1, 'category_id' => 4, 'brand_id' => 5, 'code' => 'ZAP-NB-001', 'barcode' => '884411116794', 'name' => 'New Balance 574', 'description' => 'Zapatos New Balance 574 clásicos', 'cost' => 2900, 'price' => 4995, 'stock' => 12, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 4, 'brand_id' => 8, 'code' => 'ZAP-SKE-001', 'barcode' => '884411116795', 'name' => 'Skechers Go Walk 6', 'description' => 'Zapatos Skechers Go Walk 6 cómodos', 'cost' => 2200, 'price' => 3895, 'stock' => 22, 'stock_min' => 6, 'created_at' => $now],
            // Zapatos Formales (category_id 5)
            ['company_id' => 1, 'category_id' => 5, 'brand_id' => null, 'code' => 'ZAP-FOR-001', 'barcode' => '884411116796', 'name' => 'Zapato Formal Derby', 'description' => 'Zapato formal Derby cuero negro', 'cost' => 1800, 'price' => 3295, 'stock' => 15, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 5, 'brand_id' => null, 'code' => 'ZAP-FOR-002', 'barcode' => '884411116797', 'name' => 'Zapato Formal Oxford', 'description' => 'Zapato Oxford cuero marrón', 'cost' => 2000, 'price' => 3595, 'stock' => 8, 'stock_min' => 4, 'created_at' => $now],
            // Botas (category_id 7)
            ['company_id' => 1, 'category_id' => 7, 'brand_id' => 4, 'code' => 'BOT-REE-001', 'barcode' => '884411116798', 'name' => 'Botas Reebok Classic', 'description' => 'Botas Reebok Classic Leather', 'cost' => 2600, 'price' => 4495, 'stock' => 10, 'stock_min' => 5, 'created_at' => $now],
            // Camisetas y Polos (category_id 8)
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 1, 'code' => 'CAM-NIK-001', 'barcode' => '884411116799', 'name' => 'Camiseta Nike Dri-FIT', 'description' => 'Camiseta deportiva Nike Dri-FIT algodón', 'cost' => 800, 'price' => 1495, 'stock' => 50, 'stock_min' => 15, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 2, 'code' => 'CAM-ADI-001', 'barcode' => '884411116800', 'name' => 'Camiseta Adidas Essentials', 'description' => 'Camiseta Adidas Essentials logo', 'cost' => 700, 'price' => 1295, 'stock' => 45, 'stock_min' => 15, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 13, 'code' => 'CAM-POL-001', 'barcode' => '884411116801', 'name' => 'Polo Ralph Lauren Clásico', 'description' => 'Polo Ralph Lauren manga corta', 'cost' => 1500, 'price' => 2795, 'stock' => 0, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 14, 'code' => 'CAM-LAC-001', 'barcode' => '884411116802', 'name' => 'Polo Lacoste Sport', 'description' => 'Polo Lacoste Sport manga corta', 'cost' => 1400, 'price' => 2595, 'stock' => 7, 'stock_min' => 5, 'created_at' => $now],
            // Pantalones y Jeans (category_id 9)
            ['company_id' => 1, 'category_id' => 9, 'brand_id' => 11, 'code' => 'PAN-LEV-001', 'barcode' => '884411116803', 'name' => 'Jeans Levis 501', 'description' => 'Jeans Levis 501 original', 'cost' => 1800, 'price' => 3295, 'stock' => 0, 'stock_min' => 8, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 9, 'brand_id' => 11, 'code' => 'PAN-LEV-002', 'barcode' => '884411116804', 'name' => 'Jeans Levis 512', 'description' => 'Jeans Levis 512 slim', 'cost' => 1700, 'price' => 3195, 'stock' => 20, 'stock_min' => 8, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 9, 'brand_id' => 12, 'code' => 'PAN-TOM-001', 'barcode' => '884411116805', 'name' => 'Pantalón Tommy Hilfiger', 'description' => 'Pantalón casual Tommy Hilfiger', 'cost' => 2000, 'price' => 3795, 'stock' => 14, 'stock_min' => 6, 'created_at' => $now],
            // Chaquetas y Abrigos (category_id 10)
            ['company_id' => 1, 'category_id' => 10, 'brand_id' => 9, 'code' => 'CHA-UND-001', 'barcode' => '884411116806', 'name' => 'Chaqueta Under Armour Storm', 'description' => 'Chaqueta Under Armour Storm resistente al agua', 'cost' => 2200, 'price' => 3995, 'stock' => 9, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 10, 'brand_id' => 20, 'code' => 'CHA-CAL-001', 'barcode' => '884411116807', 'name' => 'Chaqueta Calvin Klein', 'description' => 'Chaqueta ligera Calvin Klein', 'cost' => 2400, 'price' => 4295, 'stock' => 6, 'stock_min' => 4, 'created_at' => $now],
            // Vestidos y Faldas (category_id 11)
            ['company_id' => 1, 'category_id' => 11, 'brand_id' => 15, 'code' => 'VES-ZAR-001', 'barcode' => '884411116808', 'name' => 'Vestido Zara Floral', 'description' => 'Vestido Zara estampado floral', 'cost' => 1200, 'price' => 2295, 'stock' => 16, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 11, 'brand_id' => 16, 'code' => 'VES-HYM-001', 'barcode' => '884411116809', 'name' => 'Vestido H&M Casual', 'description' => 'Vestido H&M casual manga corta', 'cost' => 900, 'price' => 1795, 'stock' => 28, 'stock_min' => 8, 'created_at' => $now],
            // Carteras y Mochilas (category_id 13)
            ['company_id' => 1, 'category_id' => 13, 'brand_id' => 19, 'code' => 'CAR-GUE-001', 'barcode' => '884411116810', 'name' => 'Cartera Guess Tote', 'description' => 'Cartera Guess Tote dama', 'cost' => 2800, 'price' => 4995, 'stock' => 5, 'stock_min' => 3, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 13, 'brand_id' => 1, 'code' => 'MOCH-NIK-001', 'barcode' => '884411116811', 'name' => 'Mochila Nike Heritage', 'description' => 'Mochila Nike Heritage 24L', 'cost' => 1500, 'price' => 2795, 'stock' => 11, 'stock_min' => 4, 'created_at' => $now],
            // Cinturones (category_id 14)
            ['company_id' => 1, 'category_id' => 14, 'brand_id' => 12, 'code' => 'CIN-TOM-001', 'barcode' => '884411116812', 'name' => 'Cinturón Tommy Hilfiger', 'description' => 'Cinturón Tommy Hilfiger cuero negro', 'cost' => 1000, 'price' => 1995, 'stock' => 20, 'stock_min' => 6, 'created_at' => $now],
            // Relojes (category_id 15)
            ['company_id' => 1, 'category_id' => 15, 'brand_id' => null, 'code' => 'REL-CAS-001', 'barcode' => '884411116813', 'name' => 'Reloj Casio Vintage', 'description' => 'Reloj Casio Vintage A168WG', 'cost' => 900, 'price' => 1795, 'stock' => 13, 'stock_min' => 5, 'created_at' => $now],
            // Gorras y Sombreros (category_id 16)
            ['company_id' => 1, 'category_id' => 16, 'brand_id' => 1, 'code' => 'GOR-NIK-001', 'barcode' => '884411116814', 'name' => 'Gorra Nike Dri-FIT', 'description' => 'Gorra Nike Dri-FIT negra', 'cost' => 500, 'price' => 995, 'stock' => 35, 'stock_min' => 10, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 16, 'brand_id' => 2, 'code' => 'GOR-ADI-001', 'barcode' => '884411116815', 'name' => 'Gorra Adidas Originals', 'description' => 'Gorra Adidas Originals trefoil', 'cost' => 500, 'price' => 995, 'stock' => 4, 'stock_min' => 10, 'created_at' => $now],
            // Medias (category_id 17)
            ['company_id' => 1, 'category_id' => 17, 'brand_id' => 1, 'code' => 'MED-NIK-001', 'barcode' => '884411116816', 'name' => 'Medias Nike 3 Pares', 'description' => 'Pack 3 pares medias Nike algodón', 'cost' => 350, 'price' => 695, 'stock' => 60, 'stock_min' => 20, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 17, 'brand_id' => 2, 'code' => 'MED-ADI-001', 'barcode' => '884411116817', 'name' => 'Medias Adidas 3 Pares', 'description' => 'Pack 3 pares medias Adidas', 'cost' => 300, 'price' => 595, 'stock' => 55, 'stock_min' => 20, 'created_at' => $now],
            // Chanclas y Sandalias (category_id 6)
            ['company_id' => 1, 'category_id' => 6, 'brand_id' => 2, 'code' => 'CHA-ADI-001', 'barcode' => '884411116818', 'name' => 'Chanclas Adidas Adilette', 'description' => 'Chanclas Adidas Adilette originales', 'cost' => 600, 'price' => 1195, 'stock' => 42, 'stock_min' => 12, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 6, 'brand_id' => 8, 'code' => 'SAN-SKE-001', 'barcode' => '884411116819', 'name' => 'Sandalias Skechers Reggae', 'description' => 'Sandalias Skechers Reggae slingback', 'cost' => 700, 'price' => 1395, 'stock' => 17, 'stock_min' => 6, 'created_at' => $now],
        ];

        foreach ($products as $data) {
            Product::create($data);
        }

        // Create Varios category before adding extra products that reference it
        $variosCat = \App\Models\Category::firstOrCreate(
            ['company_id' => 1, 'slug' => 'varios'],
            ['name' => 'Varios', 'description' => 'Productos varios y combos', 'color' => '#6B7280', 'is_active' => true, 'sort_order' => 99]
        );

        $extra = [
            // Más Tenis Deportivos (category_id 3)
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 1, 'code' => 'TEN-NIK-003', 'barcode' => '884411116820', 'name' => 'Nike Air Force 1', 'description' => 'Tenis Nike Air Force 1 blancos', 'cost' => 3500, 'price' => 5995, 'stock' => 22, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 1, 'code' => 'TEN-NIK-004', 'barcode' => '884411116821', 'name' => 'Nike Dunk Low Retro', 'description' => 'Tenis Nike Dunk Low Retro blancos/negros', 'cost' => 3800, 'price' => 6495, 'stock' => 8, 'stock_min' => 4, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 2, 'code' => 'TEN-ADI-002', 'barcode' => '884411116822', 'name' => 'Adidas Superstar', 'description' => 'Tenis Adidas Superstar clásicos', 'cost' => 3100, 'price' => 5495, 'stock' => 15, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 2, 'code' => 'TEN-ADI-003', 'barcode' => '884411116823', 'name' => 'Adidas Stan Smith', 'description' => 'Tenis Adidas Stan Smith blancos', 'cost' => 2900, 'price' => 5195, 'stock' => 11, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 6, 'code' => 'TEN-CON-001', 'barcode' => '884411116824', 'name' => 'Converse Chuck Taylor All Star', 'description' => 'Tenis Converse Chuck Taylor altos', 'cost' => 1600, 'price' => 2995, 'stock' => 33, 'stock_min' => 10, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 10, 'code' => 'TEN-JOR-001', 'barcode' => '884411116825', 'name' => 'Jordan Air 1 Mid', 'description' => 'Tenis Jordan Air 1 Mid blanco/rojo', 'cost' => 4500, 'price' => 7995, 'stock' => 6, 'stock_min' => 3, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 3, 'code' => 'TEN-PUM-002', 'barcode' => '884411116826', 'name' => 'Puma Suede Classic', 'description' => 'Tenis Puma Suede Classic negro', 'cost' => 2000, 'price' => 3595, 'stock' => 19, 'stock_min' => 6, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 5, 'code' => 'TEN-NWB-001', 'barcode' => '884411116827', 'name' => 'New Balance 327', 'description' => 'Tenis New Balance 327 casual', 'cost' => 2700, 'price' => 4795, 'stock' => 14, 'stock_min' => 5, 'created_at' => $now],

            // Más Ropa (category_id 8, 9)
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 17, 'code' => 'POL-MAN-001', 'barcode' => '884411116828', 'name' => 'Blusa Mango Floral', 'description' => 'Blusa Mango estampado floral manga larga', 'cost' => 800, 'price' => 1595, 'stock' => 25, 'stock_min' => 8, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 18, 'code' => 'CAM-FOR-001', 'barcode' => '884411116829', 'name' => 'Top Forever 21 Básico', 'description' => 'Top Forever 21 algodón básico', 'cost' => 400, 'price' => 795, 'stock' => 40, 'stock_min' => 15, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 9, 'brand_id' => 11, 'code' => 'PAN-LEV-003', 'barcode' => '884411116830', 'name' => 'Short Levis Bermuda', 'description' => 'Short jeans Levis Bermuda', 'cost' => 1200, 'price' => 2295, 'stock' => 18, 'stock_min' => 6, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 9, 'brand_id' => 16, 'code' => 'PAN-HYM-001', 'barcode' => '884411116831', 'name' => 'Jogger H&M Algodón', 'description' => 'Pantalón jogger H&M algodón gris', 'cost' => 900, 'price' => 1795, 'stock' => 30, 'stock_min' => 10, 'created_at' => $now],

            // Más Accesorios (category_id 13, 14, 15, 16)
            ['company_id' => 1, 'category_id' => 13, 'brand_id' => 19, 'code' => 'MOCH-GUE-001', 'barcode' => '884411116832', 'name' => 'Mochila Guess Casual', 'description' => 'Mochila Guess casual gris', 'cost' => 1800, 'price' => 3295, 'stock' => 7, 'stock_min' => 3, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 14, 'brand_id' => 20, 'code' => 'CIN-CAL-001', 'barcode' => '884411116833', 'name' => 'Cinturón Calvin Klein', 'description' => 'Cinturón Calvin Klein cuero marrón', 'cost' => 1100, 'price' => 2195, 'stock' => 13, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 15, 'brand_id' => null, 'code' => 'REL-CAS-002', 'barcode' => '884411116834', 'name' => 'Reloj Casio G-Shock DW5600', 'description' => 'Reloj Casio G-Shock clásico', 'cost' => 2500, 'price' => 4495, 'stock' => 9, 'stock_min' => 4, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 15, 'brand_id' => null, 'code' => 'REL-TIM-001', 'barcode' => '884411116835', 'name' => 'Reloj Timex Weekender', 'description' => 'Reloj Timex Weekender cuero café', 'cost' => 1300, 'price' => 2495, 'stock' => 11, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 16, 'brand_id' => 7, 'code' => 'GOR-VAN-001', 'barcode' => '884411116836', 'name' => 'Gorra Vans Classic', 'description' => 'Gorra Vans Classic negra', 'cost' => 350, 'price' => 695, 'stock' => 28, 'stock_min' => 10, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 16, 'brand_id' => 3, 'code' => 'GOR-PUM-001', 'barcode' => '884411116837', 'name' => 'Gorra Puma Essentials', 'description' => 'Gorra Puma Essentials azul', 'cost' => 350, 'price' => 695, 'stock' => 5, 'stock_min' => 10, 'created_at' => $now],

            // Ropa Interior (category_id 12)
            ['company_id' => 1, 'category_id' => 12, 'brand_id' => 20, 'code' => 'INT-CAL-001', 'barcode' => '884411116838', 'name' => 'Boxer Calvin Klein 3 Pack', 'description' => 'Pack 3 boxer Calvin Klein algodón', 'cost' => 600, 'price' => 1295, 'stock' => 35, 'stock_min' => 10, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 12, 'brand_id' => 16, 'code' => 'INT-HYM-001', 'barcode' => '884411116839', 'name' => 'Bralette H&M Algodón', 'description' => 'Bralette H&M algodón color nude', 'cost' => 400, 'price' => 795, 'stock' => 20, 'stock_min' => 8, 'created_at' => $now],

            // Varios
            ['company_id' => 1, 'category_id' => $variosCat->id, 'brand_id' => null, 'code' => 'GEN-LOT-001', 'barcode' => '884411116840', 'name' => 'Lote 3 Pares Tenis Deportivos', 'description' => 'Lote promocional 3 pares tenis', 'cost' => 4500, 'price' => 7995, 'stock' => 5, 'stock_min' => 2, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 3, 'brand_id' => 4, 'code' => 'TEN-REE-002', 'barcode' => '884411116841', 'name' => 'Reebok Club C 85', 'description' => 'Tenis Reebok Club C 85 blanco', 'cost' => 2300, 'price' => 4195, 'stock' => 12, 'stock_min' => 5, 'created_at' => $now],
            ['company_id' => 1, 'category_id' => 8, 'brand_id' => 12, 'code' => 'CAM-TOM-001', 'barcode' => '884411116842', 'name' => 'Camiseta Tommy Hilfiger Flag', 'description' => 'Camiseta Tommy Hilfiger bandera algodón', 'cost' => 900, 'price' => 1795, 'stock' => 24, 'stock_min' => 8, 'created_at' => $now],
        ];

        foreach ($extra as $data) {
            Product::create($data);
        }
    }
}
